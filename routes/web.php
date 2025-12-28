<?php

use App\Http\Controllers\UserProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

// Controllers
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ViewProductController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Web\CategoryController as WebCategoryController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\FlashSaleController;
use App\Http\Controllers\TopProductController;


Route::post('/register', function (Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|confirmed|min:8',
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    Auth::login($user);

    return response()->json([
        'message' => 'User registered successfully',
        'user' => $user,
    ], 201);
});

Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (Auth::attempt($request->only('email', 'password'))) {
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Login berhasil',
            'user' => Auth::user(),
        ]);
    }

    return response()->json(['message' => 'Email atau password salah'], 422);
});

Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return response()->json(['message' => 'Logged out']);
});

// Ambil CSRF token untuk frontend
Route::get('/csrf-token', function () {
    return response()->json(['csrfToken' => csrf_token()]);
});

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/product/{slug}', [ViewProductController::class, 'view'])
    ->name('product.view');

/*
|--------------------------------------------------------------------------
| PRODUCT & CATEGORY (PUBLIC)
|--------------------------------------------------------------------------
*/

Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index'])
        ->name('products.index');

    Route::get('/{product:slug}', [ProductController::class, 'show'])
        ->name('products.show');
});

Route::prefix('categories')->group(function () {
    Route::get('/', [WebCategoryController::class, 'index'])
        ->name('categories.index');

    Route::get('/{category:slug}', [WebCategoryController::class, 'show'])
        ->name('categories.show');
});

/*
|--------------------------------------------------------------------------
| FLASH SALE & TOP PRODUCT (PUBLIC)
|--------------------------------------------------------------------------
*/

Route::get('/flash-sale', [FlashSaleController::class, 'index'])
    ->name('flash-sale');

Route::get('/flash-sale/batch', [FlashSaleController::class, 'batch']);

Route::get('/top-product', [TopProductController::class, 'index'])
    ->name('top-product');

Route::get('/top-product/all', [TopProductController::class, 'all'])
    ->name('top-product.all');

Route::middleware(['auth'])->group(function () {

    // Profile page
    Route::get('/user-profile', [UserProfileController::class, 'index'])
        ->name('user-profile');

    // Update basic info (name, avatar, dll)
    Route::post('/user-profile', [UserProfileController::class, 'update'])
        ->name('user-profile.update');

    // Update password
    Route::put('/user-profile/password', [UserProfileController::class, 'updatePassword'])
        ->name('user-profile.password');

    // Delete account
    Route::delete('/user-profile', [UserProfileController::class, 'destroy'])
        ->name('user-profile.destroy');
});

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // Dashboard
        Route::get('/dashboard', function () {
            return Inertia::render('Admin/Dashboard');
        })->name('dashboard');

        // Flash Sale Management
        Route::prefix('flash-sale')->group(function () {
            Route::get('/', [FlashSaleController::class, 'manage'])->name('flash-sale');
            Route::post('/', [FlashSaleController::class, 'store'])->name('flash-sale.store');
            Route::put('/{id}', [FlashSaleController::class, 'update'])->name('flash-sale.update');
            Route::delete('/{id}', [FlashSaleController::class, 'destroy'])->name('flash-sale.destroy');
        });

        // Top Product Management
        Route::prefix('top-product')->group(function () {
            Route::get('/', [TopProductController::class, 'manage'])->name('top-product');
            Route::post('/', [TopProductController::class, 'store'])->name('top-product.store');
            Route::put('/{id}', [TopProductController::class, 'update'])->name('top-product.update');
            Route::delete('/{id}', [TopProductController::class, 'destroy'])->name('top-product.destroy');
        });

        // Product Management
        Route::prefix('products')->group(function () {
            Route::get('/create', [ProductController::class, 'create'])->name('products.create');
            Route::post('/', [ProductController::class, 'store'])->name('products.store');
            Route::get('/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
            Route::put('/{product}', [ProductController::class, 'update'])->name('products.update');
            Route::delete('/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
        });

        // Category Management
        Route::prefix('categories')->group(function () {
            Route::get('/', [AdminCategoryController::class, 'index'])
                ->name('categories.index');

            Route::get('/create', [AdminCategoryController::class, 'create'])
                ->name('categories.create');

            Route::post('/', [AdminCategoryController::class, 'store'])
                ->name('categories.store');

            Route::get('/{category}/edit', [AdminCategoryController::class, 'edit'])
                ->name('categories.edit');

            Route::put('/{category}', [AdminCategoryController::class, 'update'])
                ->name('categories.update');

            Route::delete('/{category}', [AdminCategoryController::class, 'destroy'])
                ->name('categories.destroy');
        });

        // Order Management
        Route::prefix('orders')->group(function () {
            Route::put('/{order}', [OrderController::class, 'update'])->name('orders.update');
            Route::delete('/{order}', [OrderController::class, 'destroy'])->name('orders.destroy');
        });
    });

/*
|--------------------------------------------------------------------------
| API-LIKE ROUTES (SEMENTARA DI WEB)
|--------------------------------------------------------------------------
*/

Route::prefix('api')->group(function () {
    Route::get('/products', [ProductController::class, 'apiIndex']);
    Route::get('/products/featured', [ProductController::class, 'featured']);
    Route::get('/categories', [WebCategoryController::class, 'apiIndex']);

    Route::get('/flash-sale/products', [FlashSaleController::class, 'getProducts']);
    Route::get('/top-product/products', [TopProductController::class, 'getProducts']);
});
