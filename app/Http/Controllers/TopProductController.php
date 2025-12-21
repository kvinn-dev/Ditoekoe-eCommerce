<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\TopProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TopProductController extends Controller
{

    public function index()
    {
        $topProducts = Product::where('is_top_product', true)
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

        return Inertia::render('Top_Product', [
            'auth'               => Auth::user(),
            'topProducts'  => $topProducts,
        ]);
    }

    public function all()
    {
        $topProducts = Product::where('is_top_product', true)
            ->with('category')
            ->latest()
            ->paginate(40);

        return Inertia::render('TopProduct/All', [
            'auth'     => Auth::user(),
            'products' => $topProducts,
        ]);
    }

    /**
     * API endpoint
     */
    public function getProducts()
    {
        return response()->json(
            Product::where('is_top_product', true)
                ->with('category')
                ->latest()
                ->take(20)
                ->get()
        );
    }

    public function manage()
    {
        return Inertia::render('Admin/TopProduct/Index', [
            'topProduct' => TopProduct::with('product')->get(),
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

        TopProduct::create($validated);

        return redirect()
            ->route('admin.top-product')
            ->with('success', 'Top product added successfully.');
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

        TopProduct::findOrFail($id)->update($validated);

        return redirect()
            ->route('admin.top-product')
            ->with('success', 'Top product updated successfully.');
    }

    /**
     * Admin: delete
     */
    public function destroy(int $id)
    {
        TopProduct::findOrFail($id)->delete();

        return redirect()
            ->route('admin.top-product')
            ->with('success', 'Top product removed successfully.');
    }
}
