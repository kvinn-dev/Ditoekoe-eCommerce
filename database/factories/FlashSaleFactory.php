<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Product;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FlashSale>
 */
class FlashSaleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Ambil product existing atau buat product baru
        return [
            'product_id' => Product::factory(), // otomatis buat product baru
            'discount_percentage' => $this->faker->numberBetween(10, 50),
            'stock_limit' => $this->faker->numberBetween(5, 100),
            'sold_count' => 0,
            'start_time' => now()->subDays($this->faker->numberBetween(0, 2)), // mulai 0-2 hari lalu
            'end_time' => now()->addDays($this->faker->numberBetween(1, 5)), // berakhir 1-5 hari ke depan
            'is_active' => $this->faker->boolean(90), // 90% chance aktif
        ];
    }

    /**
     * State untuk Flash Sale aktif.
     */
    public function active(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * State untuk Flash Sale non-aktif.
     */
    public function inactive(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_active' => false,
        ]);
    }
}
