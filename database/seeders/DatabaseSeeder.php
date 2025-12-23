<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Buat user test jika belum ada
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'), // jangan lupa bcrypt
                'email_verified_at' => now(),
            ]
        );

        // Jalankan seeder lain berurutan
        $this->call([
            CategorySeeder::class, // buat 20 kategori
            ProductSeeder::class,  // buat 200 produk, terkait kategori
            FlashSaleSeeder::class // buat flash sale dari sebagian produk
        ]);
    }
}
