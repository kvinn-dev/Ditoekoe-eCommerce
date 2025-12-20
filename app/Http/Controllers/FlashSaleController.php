<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\FlashSale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FlashSaleController extends Controller
{
    /**
     * Flash sale homepage
     */
    public function index()
    {
        $flashSaleProducts = Product::where('is_flash_sale', true)
            ->with('category')
            ->latest()
            ->take(20)
            ->get()
            ->map(fn($product) => [
                'id'             => $product->id,
                'name'           => $product->name,
                'slug'           => $product->slug,
                'price'          => $product->price,
                'discount_price' => $product->discount_price,
                'image'          => $product->image,
                'category'       => $product->category,
                'stock'          => $product->stock,
                'sold_count'     => $product->sold_count,
            ]);

        return Inertia::render('Flash_Sale', [
            'auth'               => Auth::user(),
            'flashSaleProducts'  => $flashSaleProducts,
        ]);
    }

    /**
     * All flash sale products page
     */
    public function all()
    {
        $flashSaleProducts = Product::where('is_flash_sale', true)
            ->with('category')
            ->latest()
            ->paginate(40);

        return Inertia::render('FlashSale/All', [
            'auth'     => Auth::user(),
            'products' => $flashSaleProducts,
        ]);
    }

    /**
     * API endpoint
     */
    public function getProducts()
    {
        return response()->json(
            Product::where('is_flash_sale', true)
                ->with('category')
                ->latest()
                ->take(20)
                ->get()
        );
    }

    /**
     * Admin: manage flash sale
     */
    public function manage()
    {
        return Inertia::render('Admin/FlashSale/Index', [
            'flashSales' => FlashSale::with('product')->get(),
            'products'   => Product::all(),
        ]);
    }

    /**
     * Admin: store
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id'           => 'required|exists:products,id',
            'discount_percentage'  => 'required|integer|min:1|max:99',
            'start_time'           => 'required|date',
            'end_time'             => 'required|date|after:start_time',
            'stock_limit'          => 'required|integer|min:1',
        ]);

        FlashSale::create($validated);

        return redirect()
            ->route('admin.flash-sale')
            ->with('success', 'Flash sale added successfully.');
    }

    /**
     * Admin: update
     */
    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'discount_percentage' => 'required|integer|min:1|max:99',
            'start_time'          => 'required|date',
            'end_time'            => 'required|date|after:start_time',
            'stock_limit'         => 'required|integer|min:1',
        ]);

        FlashSale::findOrFail($id)->update($validated);

        return redirect()
            ->route('admin.flash-sale')
            ->with('success', 'Flash sale updated successfully.');
    }

    /**
     * Admin: delete
     */
    public function destroy(int $id)
    {
        FlashSale::findOrFail($id)->delete();

        return redirect()
            ->route('admin.flash-sale')
            ->with('success', 'Flash sale removed successfully.');
    }
}
