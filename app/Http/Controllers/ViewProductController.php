<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Models\Product;
use App\Models\Category;
use App\Models\ViewProduct;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ViewProductController extends Controller
{
    public function view(string $slug)
    {
        $product = Product::with([
            'category.parent',
            'brand',
            'reviews.user',
            'store',
        ])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        // Catat view produk jika ada user login
        if (Auth::check()) {
            ViewProduct::create([
                'product_id' => $product->id,
                'user_id' => Auth::id(),
                'viewed_at' => now(),
            ]);
        }

        $formattedProduct = $this->formatProductData($product);

        return Inertia::render('View_Product', [
            'auth' => [
                'user' => Auth::user(),
                'is_admin' => Auth::user()->is_admin ?? false,
            ],
            'product' => $formattedProduct,
            'relatedProducts' => $this->getRelatedProducts($product),
            'breadcrumbCategories' => $this->getBreadcrumbCategories($product->category),
            'meta_title' => $product->meta_title ?? $product->name . ' - Ditoekoe',
            'meta_description' => $product->meta_description ?? Str::limit(strip_tags($product->description), 160),
            'meta_keywords' => $product->meta_keywords,
        ]);
    }

    private function formatProductData(Product $product): array
    {
        // ===============================
        // IMAGE HANDLING
        // ===============================
        $images = $product->images;
        if (!$images || !is_array($images) || count($images) === 0) {
            $images = $product->image
                ? [Storage::url($product->image)]
                : ['/images/placeholder.png'];
        }

        // ===============================
        // STORE DATA
        // ===============================
        $store = $product->store ?? new \stdClass();
        $storeData = [
            'id' => $product->store_id,
            'name' => $store->name ?? 'Official Store',
            'rating' => $store->rating ?? 0,
            'description' => $store->description ?? '',
            'location' => $store->location ?? null,
            'joined_at' => $store->created_at ?? null,
        ];

        // ===============================
        // HARGA & DISKON (GLOBAL PRODUCT - FINAL FIX)
        // ===============================
        $price = (float) $product->price;

        // default: tidak ada diskon
        $finalPrice = $price;
        $discountPrice = null;
        $discountPercent = 0;

        // diskon valid HANYA jika lebih kecil dari harga asli
        if (
            $product->discount_price !== null &&
            is_numeric($product->discount_price) &&
            (float) $product->discount_price > 0 &&
            (float) $product->discount_price < $price
        ) {
            $discountPrice = (float) $product->discount_price;
            $finalPrice = $discountPrice;
            $discountPercent = (int) round((($price - $discountPrice) / $price) * 100);
        }

        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,

            // ===============================
            // PRICE OUTPUT (LOCKED)
            // ===============================
            'price' => $price,
            'final_price' => $finalPrice,

            'price_formatted' => 'Rp ' . number_format($price, 0, ',', '.'),
            'discount_price' => $discountPrice,
            'discount_price_formatted' => $discountPrice
                ? 'Rp ' . number_format($discountPrice, 0, ',', '.')
                : null,
            'discount' => $discountPercent,

            // ===============================
            // PRODUCT INFO
            // ===============================
            'sold' => $product->sold ?? 0,
            'rating' => $product->rating ?? 0,
            'review_count' => $product->reviews
                ->where('is_approved', true)
                ->count(),

            'stock' => $product->stock,
            'min_order' => $product->min_order ?? 1,
            'weight' => $product->weight,
            'dimensions' => $product->dimensions,
            'description' => $product->description ?? '',
            'condition' => $product->condition ?? 'Baru',

            'is_featured' => $product->is_featured,
            'is_flash_sale' => $product->is_flash_sale,

            'created_at' => $product->created_at,
            'updated_at' => $product->updated_at,

            // ===============================
            // RELATION DATA
            // ===============================
            'store' => $storeData,

            'category' => [
                'id' => $product->category->id ?? null,
                'name' => $product->category->name ?? null,
                'slug' => $product->category->slug ?? null,
                'parent' => $product->category->parent ?? null,
            ],

            'brand' => [
                'id' => $product->brand->id ?? null,
                'name' => $product->brand->name ?? null,
                'slug' => $product->brand->slug ?? null,
            ],

            'image' => $images[0],
            'images' => $images,

            'features' => $this->getProductFeatures($product),
            'specifications' => $this->getProductSpecifications($product),

            'reviews' => $product->reviews
                ->where('is_approved', true)
                ->map(fn($review) => [
                    'user_name' => $review->user->name ?? 'Anonymous',
                    'rating' => $review->rating,
                    'title' => $review->title,
                    'comment' => $review->comment,
                    'created_at' => $review->created_at,
                ])
                ->toArray(),
            'important_info' => [
                [
                    'title' => 'Kebijakan Pengembalian Produk',
                    'content' =>   'Sebagai bentuk pelayanan kepada pelanggan, kami memberikan kebijakan pengembalian barang (retur).
                                    Produk yang berhak mendapatkan pengembalian diatur berdasarkan ketentuan berikut:

                                    1) Cacat Barang
                                    
                                        Pengajuan klaim pengembalian barang karena cacat wajib disertai bukti pendukung
                                        berupa foto dan video tanpa jeda pada saat proses pembukaan paket oleh pembeli.
                                        Bukti tersebut digunakan sebagai dasar verifikasi klaim.

                                    2) Kesalahan Pengiriman

                                        Untuk menghindari kesalahpahaman terkait pengiriman barang, pembeli disarankan
                                        untuk merekam video unboxing tanpa jeda saat membuka paket.
                                        Hal ini penting karena setiap barang yang dikirim telah disesuaikan dengan pesanan yang tercantum pada sistem.

                                        Kami tidak memberikan toleransi pengembalian barang yang disebabkan oleh kelalaian
                                        reseller atau dropshipper tanpa disertai bukti yang jelas, mengingat seluruh produk telah
                                        melalui proses pengecekan sebelum dikirim.',
                ],
                [
                    'title' => 'Info Pengiriman',
                    'content' => '  Pengiriman dilakukan dari toko resmi dan mengikuti kebijakan pengiriman yang telah ditentukan oleh penjual.

                                    Estimasi waktu pengiriman dapat berbeda tergantung lokasi tujuan dan jasa ekspedisi yang dipilih.',
                ],
                [
                    'title' => 'Fast Deliver!',
                    'content' => '  Lakukan konfirmasi pesanan dan pembayaran sebelum pukul 16.00 WIB untuk mendapatkan proses pengiriman yang lebih cepat di hari yang sama.',
                ],
            ],
        ];
    }

    private function getProductFeatures(Product $product): array
    {
        return $product->features_custom
            ? json_decode($product->features_custom, true)
            : [];
    }

    private function getProductSpecifications(Product $product): array
    {
        return $product->specifications_json
            ? json_decode($product->specifications_json, true)
            : [];
    }

    private function getRelatedProducts(Product $product): array
    {
        return Product::with(['category', 'brand', 'store', 'reviews'])
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->inRandomOrder()
            ->limit(8)
            ->get()
            ->map(function ($related) {

                $price = (float) $related->price;
                $finalPrice = $price;
                $discountPrice = null;
                $discountPercent = 0;

                if (
                    $related->discount_price !== null &&
                    (float) $related->discount_price > 0 &&
                    (float) $related->discount_price < $price
                ) {
                    $discountPrice = (float) $related->discount_price;
                    $finalPrice = $discountPrice;
                    $discountPercent = (int) round((($price - $discountPrice) / $price) * 100);
                }

                return [
                    'id' => $related->id,
                    'name' => $related->name,
                    'slug' => $related->slug,

                    'price' => $price,
                    'final_price' => $finalPrice,

                    'price_formatted' => 'Rp ' . number_format($price, 0, ',', '.'),
                    'discount_price' => $discountPrice,
                    'discount_price_formatted' => $discountPrice
                        ? 'Rp ' . number_format($discountPrice, 0, ',', '.')
                        : null,
                    'discount' => $discountPercent,

                    'sold' => $related->sold ?? 0,
                    'stock' => $related->stock,

                    'image' => $related->image
                        ? Storage::url($related->image)
                        : '/images/placeholder.png',

                    'rating' => $related->rating ?? 0,
                    'review_count' => $related->reviews
                        ->where('is_approved', true)
                        ->count(),

                    'store' => [
                        'name' => $related->store->name ?? 'Official Store',
                    ],
                ];
            })
            ->toArray();
    }

    private function getBreadcrumbCategories(?Category $category): array
    {
        $breadcrumbs = [['label' => 'Home', 'href' => '/']];

        if ($category) {
            $trail = [];
            $current = $category;
            while ($current) {
                $trail[] = [
                    'label' => $current->name,
                    'href' => '/categories/' . $current->slug,
                ];
                $current = $current->parent;
            }
            $breadcrumbs = array_merge($breadcrumbs, array_reverse($trail));
        }

        return $breadcrumbs;
    }
}
