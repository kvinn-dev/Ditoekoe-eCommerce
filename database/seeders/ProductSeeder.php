<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use Faker\Factory as Faker;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // Ambil semua kategori
        $categories = Category::all();
        $totalCategories = $categories->count();

        $totalProducts = 500; // total produk yang ingin dibuat

        // Counter SKU dan slug agar unik
        $skuCounter = 1;
        $slugCounter = 1;

        for ($i = 0; $i < $totalProducts; $i++) {
            // Pilih kategori secara merata
            $category = $categories[$i % $totalCategories];

            // Harga kelipatan ribuan
            $price = $faker->numberBetween(100, 1000) * 1000;
            $hasDiscount = $faker->boolean(30); // 30% chance diskon
            $discountPrice = $hasDiscount 
                ? round($price * $faker->randomFloat(2, 0.5, 0.9) / 1000) * 1000 
                : null;

            // Generate nama dan slug unik
            $name = $faker->words(3, true);
            $slug = Str::slug($name) . '-' . $slugCounter++;

            Product::create([
                'name' => $name,
                'slug' => $slug,
                'description' => $faker->paragraphs(3, true),
                'price' => $price,
                'discount_price' => $discountPrice,
                'stock' => $faker->numberBetween(10, 100),
                'sku' => 'PROD-' . str_pad($skuCounter++, 5, '0', STR_PAD_LEFT), // SKU unik
                'weight' => $faker->randomFloat(2, 0.1, 20),
                'dimensions' => $faker->randomElement(['10x10x10', '20x15x5', '30x20x10']),
                'image' => 'images/placeholder.png',
                'images' => json_encode([
                    'images/placeholder.png',
                    'images/placeholder.png',
                    'images/placeholder.png',
                ]),
                'category_id' => $category->id,
                'brand_id' => null,
                'is_featured' => $faker->boolean(20), // 20% chance featured
                'is_active' => true,
                'meta_title' => $faker->sentence(),
                'meta_description' => $faker->sentence(),
                'meta_keywords' => implode(', ', $faker->words(5)),
            ]);
        }
    }
}
