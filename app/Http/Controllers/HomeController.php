<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display home page
     */
    public function index()
    {
        // Data untuk homepage diambil dari model Product & Category
        $featuredProducts = Product::with(['category', 'brand'])
            ->where('is_active', true)
            ->where('is_featured', true)
            ->latest()
            ->limit(8)
            ->get();

        $newProducts = Product::with(['category', 'brand'])
            ->where('is_active', true)
            ->latest()
            ->limit(8)
            ->get();

        $categories = Category::withCount('products')
            ->whereNull('parent_id')
            ->with(['children' => function ($query) {
                $query->withCount('products');
            }])
            ->limit(6)
            ->get();

        $topProducts = Product::with('category')
            ->where('is_active', true)
            ->latest()
            ->limit(12)
            ->get()
            ->map(fn($product) => [
                'id'       => $product->id,
                'name'     => $product->name,
                'slug'     => $product->slug,
                'price'    => $product->discount_price ?? $product->price,
                'image'    => $product->image,
                'category' => $product->category,
                'sold'     => null,
            ]);

        $products = Product::where('is_active', true)
            ->latest()
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'slug' => $p->slug,
                'name' => $p->name,
                'price' => (int) $p->price,
                'discount_price' => $p->discount_price !== null
                    ? (int) $p->discount_price
                    : null,
                'discount' => (int) ($p->discount ?? 0),
                'stock' => (int) ($p->stock ?? 0),
                'image' => $p->image
                    ? $p->image
                    : '/images/placeholder.png',
            ]);


        // Render halaman React 'Home' dengan data
        return Inertia::render('Home', [
            'featuredProducts' => $featuredProducts,
            'newProducts' => $newProducts,
            'categories' => $categories,
            'topProducts'      => $topProducts,
            'products' => $products,
        ]);
    }
}
