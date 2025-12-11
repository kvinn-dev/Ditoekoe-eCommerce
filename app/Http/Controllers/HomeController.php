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

        // Render halaman React 'Home' dengan data
        return Inertia::render('Home', [
            'featuredProducts' => $featuredProducts,
            'newProducts' => $newProducts,
            'categories' => $categories,
        ]);
    }
}