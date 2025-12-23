<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FlashSale;
use App\Models\Product;
use Carbon\Carbon;

class FlashSaleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil semua produk
        $allProducts = Product::all();

        // Ambil setengah produk secara acak untuk flash sale
        $flashSaleProducts = $allProducts->shuffle()->take(intval($allProducts->count() / 2));

        foreach ($flashSaleProducts as $product) {
            $discountPercentage = rand(10, 50); // diskon 10%-50%
            $startTime = Carbon::now()->subDays(rand(0, 2));
            $endTime = Carbon::now()->addDays(rand(1, 5));

            FlashSale::create([
                'product_id' => $product->id,
                'original_price' => $product->price,
                'discounted_price' => round($product->price * (1 - $discountPercentage / 100), 2),
                'discount_percentage' => $discountPercentage,
                'stock_limit' => min(rand(10, $product->stock), $product->stock),
                'sold_count' => 0,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'is_active' => true,
            ]);
        }
    }
}
