<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Array contoh nama kategori
        $categories = [
            'Elektronik',
            'Fashion Pria',
            'Fashion Wanita',
            'Sepatu',
            'Tas',
            'Peralatan Rumah Tangga',
            'Mainan & Hobi',
            'Kecantikan & Perawatan',
            'Olahraga & Outdoor',
            'Gadget & Aksesoris',
            'Buku',
            'Alat Musik',
            'Kamera & Fotografi',
            'Otomotif',
            'Makanan & Minuman',
            'Perlengkapan Bayi',
            'Kesehatan',
            'Peralatan Kantor',
            'Dekorasi Rumah',
            'Hobi Kreatif'
        ];

        foreach ($categories as $name) {
            Category::create([
                'name' => $name,
                'slug' => strtolower(str_replace(' ', '-', $name)),
                'is_active' => true,
            ]);
        }
    }
}
