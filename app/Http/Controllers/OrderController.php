<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Order::with(['user', 'items.product'])
            ->latest();

        // For customers, only show their own orders
        if (Auth::check() && !Auth::user()->is_admin) {
            $query->where('user_id', Auth::id());
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_email', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by payment status
        if ($request->has('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        $orders = $query->paginate(20)->withQueryString();

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['search', 'status', 'payment_status']),
            'statusOptions' => [
                'pending' => 'Menunggu',
                'processing' => 'Diproses',
                'shipped' => 'Dikirim',
                'delivered' => 'Selesai',
                'cancelled' => 'Dibatalkan',
            ],
            'paymentStatusOptions' => [
                'pending' => 'Menunggu',
                'paid' => 'Dibayar',
                'failed' => 'Gagal',
                'refunded' => 'Dikembalikan',
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Orders/Create', [
            'products' => Product::where('is_active', true)
                ->where('stock', '>', 0)
                ->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email',
            'customer_phone' => 'required|string|max:20',
            'customer_address' => 'required|string',
            'customer_city' => 'required|string|max:100',
            'customer_province' => 'required|string|max:100',
            'customer_postal_code' => 'required|string|max:10',
            'customer_country' => 'required|string|max:100',
            'payment_method' => 'required|string',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        // Calculate totals
        $subtotal = 0;
        $itemsData = [];

        foreach ($validated['items'] as $item) {
            $product = Product::findOrFail($item['product_id']);
            
            // Check stock
            if ($product->stock < $item['quantity']) {
                return back()->withErrors([
                    'items' => "Stok {$product->name} tidak mencukupi. Stok tersedia: {$product->stock}",
                ]);
            }

            $price = $product->discount_price ?? $product->price;
            $itemSubtotal = $price * $item['quantity'];
            $subtotal += $itemSubtotal;

            $itemsData[] = [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'product_price' => $price,
                'quantity' => $item['quantity'],
                'subtotal' => $itemSubtotal,
            ];

            // Reduce stock
            $product->decrement('stock', $item['quantity']);
        }

        // Calculate tax (11% PPN) and shipping
        $tax = $subtotal * 0.11;
        $shippingCost = 15000; // Flat rate for now
        $total = $subtotal + $tax + $shippingCost;

        DB::transaction(function () use ($validated, $subtotal, $tax, $shippingCost, $total, $itemsData) {
            $order = Order::create([
                'user_id' => Auth::id(),
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'],
                'customer_address' => $validated['customer_address'],
                'customer_city' => $validated['customer_city'],
                'customer_province' => $validated['customer_province'],
                'customer_postal_code' => $validated['customer_postal_code'],
                'customer_country' => $validated['customer_country'],
                'subtotal' => $subtotal,
                'tax' => $tax,
                'shipping_cost' => $shippingCost,
                'total' => $total,
                'payment_method' => $validated['payment_method'],
                'notes' => $validated['notes'] ?? null,
                'status' => 'pending',
                'payment_status' => 'pending',
            ]);

            // Create order items
            foreach ($itemsData as $itemData) {
                $order->items()->create($itemData);
            }
        });

        return redirect()
            ->route('orders.index')
            ->with('success', 'Pesanan berhasil dibuat!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        // Check authorization
        if (Auth::check() && !Auth::user()->is_admin && $order->user_id !== Auth::id()) {
            abort(403);
        }

        $order->load(['user', 'items.product', 'payment']);

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
            'payment_status' => 'required|in:pending,paid,failed,refunded',
            'shipping_tracking_number' => 'nullable|string|max:100',
            'shipping_carrier' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
        ]);

        // If order is cancelled, restore product stock
        if ($validated['status'] === 'cancelled' && $order->status !== 'cancelled') {
            foreach ($order->items as $item) {
                $product = $item->product;
                $product->increment('stock', $item->quantity);
            }
        }

        $order->update($validated);

        return redirect()
            ->route('orders.show', $order)
            ->with('success', 'Pesanan berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        // Only allow deletion of pending orders
        if ($order->status !== 'pending') {
            return redirect()
                ->route('orders.index')
                ->with('error', 'Hanya pesanan dengan status pending yang dapat dihapus!');
        }

        // Restore product stock
        foreach ($order->items as $item) {
            $product = $item->product;
            $product->increment('stock', $item->quantity);
        }

        $order->delete();

        return redirect()
            ->route('orders.index')
            ->with('success', 'Pesanan berhasil dihapus!');
    }

    /**
     * Customer checkout from cart
     */
    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'cart' => 'required|array|min:1',
            'cart.*.id' => 'required|exists:products,id',
            'cart.*.quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|array',
            'shipping_address.name' => 'required|string|max:255',
            'shipping_address.email' => 'required|email',
            'shipping_address.phone' => 'required|string|max:20',
            'shipping_address.address' => 'required|string',
            'shipping_address.city' => 'required|string|max:100',
            'shipping_address.province' => 'required|string|max:100',
            'shipping_address.postal_code' => 'required|string|max:10',
            'payment_method' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        // Process order (similar to store method)
        return $this->store(new Request([
            ...$validated,
            'customer_name' => $validated['shipping_address']['name'],
            'customer_email' => $validated['shipping_address']['email'],
            'customer_phone' => $validated['shipping_address']['phone'],
            'customer_address' => $validated['shipping_address']['address'],
            'customer_city' => $validated['shipping_address']['city'],
            'customer_province' => $validated['shipping_address']['province'],
            'customer_postal_code' => $validated['shipping_address']['postal_code'],
            'customer_country' => 'Indonesia',
            'items' => $validated['cart'],
        ]));
    }
}