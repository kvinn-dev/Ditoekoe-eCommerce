<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\FlashSaleController; // Tambahkan ini
use Inertia\Inertia;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');

// Flash Sale route - TAMBAHKAN INI
Route::get('/flash-sale', [FlashSaleController::class, 'index'])->name('flash-sale');
Route::get('/flash-sale/all', [FlashSaleController::class, 'all'])->name('flash-sale.all');

// Product routes
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{product:slug}', [ProductController::class, 'show'])->name('products.show');

// Category routes
Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
Route::get('/categories/{category:slug}', [CategoryController::class, 'show'])->name('categories.show');


// Admin routes
Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    // Flash Sale Management - TAMBAHKAN INI
    Route::get('/admin/flash-sale', [FlashSaleController::class, 'manage'])->name('admin.flash-sale');
    Route::post('/admin/flash-sale', [FlashSaleController::class, 'store'])->name('admin.flash-sale.store');
    Route::put('/admin/flash-sale/{id}', [FlashSaleController::class, 'update'])->name('admin.flash-sale.update');
    Route::delete('/admin/flash-sale/{id}', [FlashSaleController::class, 'destroy'])->name('admin.flash-sale.destroy');

    // Product management
    Route::get('/admin/products/create', [ProductController::class, 'create'])->name('admin.products.create');
    Route::post('/admin/products', [ProductController::class, 'store'])->name('admin.products.store');
    Route::get('/admin/products/{product}/edit', [ProductController::class, 'edit'])->name('admin.products.edit');
    Route::put('/admin/products/{product}', [ProductController::class, 'update'])->name('admin.products.update');
    Route::delete('/admin/products/{product}', [ProductController::class, 'destroy'])->name('admin.products.destroy');

    // Category management
    Route::get('/admin/categories/create', [CategoryController::class, 'create'])->name('admin.categories.create');
    Route::post('/admin/categories', [CategoryController::class, 'store'])->name('admin.categories.store');
    Route::get('/admin/categories/{category}/edit', [CategoryController::class, 'edit'])->name('admin.categories.edit');
    Route::put('/admin/categories/{category}', [CategoryController::class, 'update'])->name('admin.categories.update');
    Route::delete('/admin/categories/{category}', [CategoryController::class, 'destroy'])->name('admin.categories.destroy');

    // Order management
    Route::put('/admin/orders/{order}', [OrderController::class, 'update'])->name('admin.orders.update');
    Route::delete('/admin/orders/{order}', [OrderController::class, 'destroy'])->name('admin.orders.destroy');

    // Dashboard
    Route::get('/admin/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard');
});

// API endpoints for frontend
Route::prefix('api')->group(function () {
    Route::get('/products', [ProductController::class, 'apiIndex']);
    Route::get('/products/featured', [ProductController::class, 'featured']);
    Route::get('/categories', [CategoryController::class, 'apiIndex']);
    // Flash Sale API - TAMBAHKAN INI
    Route::get('/flash-sale/products', [FlashSaleController::class, 'getProducts']);
});