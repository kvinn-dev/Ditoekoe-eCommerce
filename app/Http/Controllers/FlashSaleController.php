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
     * Flash sale homepage - lazy load compatible
     */
    public function index(Request $request)
    {
        $perPage = $request->get('perPage', 30);
        $page = $request->get('page', 1);

        $query = FlashSale::with('product.category')
            ->active()
            ->latest();

        $total = $query->count();

        $flashSales = $query->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get();

        $flashSaleProducts = $flashSales->map(function ($fs) {
            $product = $fs->product;
            if (!$product) return null;

            // Ambil harga diskon persis dari DB
            $discountPrice = $product->discount_price ?? $product->price;
            $discountPercent = $product->discount ?? 0;

            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => $product->price,
                'discount_price' => $discountPrice,
                'price_formatted' => $product->price_formatted,
                'discount_price_formatted' => number_format($discountPrice, 0, ',', '.'),
                'final_price' => $product->final_price,
                'final_price_formatted' => $product->final_price_formatted,
                'discount' => $discountPercent,
                'image' => $product->image ?? '/images/placeholder.png',
                'category' => $product->category ? [
                    'id' => $product->category->id,
                    'name' => $product->category->name,
                    'slug' => $product->category->slug ?? strtolower(str_replace(' ', '-', $product->category->name)),
                ] : null,
                'stock' => $fs->remaining_stock ?? 0,
                'sold' => $fs->sold_count ?? 0,
                'time_left' => $fs->time_left ?? 0,
                'progress' => $fs->progress_percentage ?? 0,
            ];
        })->filter();

        // Ambil semua kategori unik dari flash sale untuk tombol filter
        $categories = $flashSaleProducts
            ->pluck('category')
            ->filter()
            ->unique('id')
            ->values();

        return Inertia::render('Flash_Sale', [
            'auth' => Auth::user(),
            'flashSaleProducts' => $flashSaleProducts,
            'categories' => $categories,
            'pagination' => [
                'total' => $total,
                'perPage' => $perPage,
                'currentPage' => $page,
                'lastPage' => ceil($total / $perPage),
            ],
        ]);
    }

    /**
     * API endpoint for lazy load / batch
     */
    public function batch(Request $request)
    {
        $perPage = 30;
        $page = (int) $request->get('page', 1);
        $categorySlug = $request->get('category', null);

        $query = FlashSale::with('product.category')
            ->active()
            ->latest();

        if ($categorySlug && $categorySlug !== 'all') {
            $query->whereHas('product.category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        $total = $query->count();

        $flashSales = $query->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get();

        $products = $flashSales->map(function ($fs) {
            $product = $fs->product;
            if (!$product) return null;

            $discountPercent = $product->discount ?? 0;
            $discountPrice = $discountPercent > 0
                ? round($product->price * (1 - $discountPercent / 100), 2)
                : $product->price;

            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => $product->price,
                'discount_price' => $discountPrice,
                'price_formatted' => $product->price_formatted,
                'discount_price_formatted' => number_format($discountPrice, 0, ',', '.'),
                'final_price' => $product->final_price,
                'final_price_formatted' => $product->final_price_formatted,
                'discount' => $discountPercent,
                'image' => $product->image ?? '/images/placeholder.png',
                'category' => $product->category ? [
                    'id' => $product->category->id,
                    'name' => $product->category->name,
                    'slug' => $product->category->slug ?? strtolower(str_replace(' ', '-', $product->category->name)),
                ] : null,
                'stock' => $fs->remaining_stock ?? 0,
                'sold' => $fs->sold_count ?? 0,
                'time_left' => $fs->time_left ?? 0,
                'progress' => $fs->progress_percentage ?? 0,
            ];
        })->filter();

        return response()->json([
            'products' => $products,
            'hasMore' => $page * $perPage < $total,
        ]);
    }

    // ==============================
    // Admin functions tetap sama
    // ==============================
    public function manage()
    {
        return Inertia::render('Admin/FlashSale/Index', [
            'flashSales' => FlashSale::with('product.category')->get(),
            'products' => Product::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'discount_percentage' => 'required|integer|min:1|max:99',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'stock_limit' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($validated['product_id']);
        $validated['original_price'] = $product->price;
        $validated['discounted_price'] = round($product->price * (1 - $validated['discount_percentage'] / 100), 2);
        $validated['is_active'] = true;
        $validated['sold_count'] = 0;

        FlashSale::create($validated);

        return redirect()
            ->route('admin.flash-sale')
            ->with('success', 'Flash sale added successfully.');
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'discount_percentage' => 'required|integer|min:1|max:99',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'stock_limit' => 'required|integer|min:1',
        ]);

        $flashSale = FlashSale::findOrFail($id);
        $flashSale->discounted_price = round($flashSale->product->price * (1 - $validated['discount_percentage'] / 100), 2);
        $flashSale->update($validated);

        return redirect()
            ->route('admin.flash-sale')
            ->with('success', 'Flash sale updated successfully.');
    }

    public function destroy(int $id)
    {
        FlashSale::findOrFail($id)->delete();

        return redirect()
            ->route('admin.flash-sale')
            ->with('success', 'Flash sale removed successfully.');
    }
}
