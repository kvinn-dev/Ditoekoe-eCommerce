<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Category;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $skuCounter = 1; // counter SKU agar unik saat generate banyak data

        $name = $this->faker->unique()->words(3, true);
        $price = $this->faker->numberBetween(10000, 5000000);
        $hasDiscount = $this->faker->boolean(30); // 30% chance of having discount

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => $this->faker->paragraphs(3, true),
            'price' => $price,
            'discount_price' => $hasDiscount ? round($price * $this->faker->randomFloat(2, 0.5, 0.9), 2) : null,
            'stock' => $this->faker->numberBetween(0, 500),
            'sku' => 'PROD-' . str_pad($skuCounter++, 5, '0', STR_PAD_LEFT),
            'weight' => $this->faker->randomFloat(2, 0.1, 20),
            'dimensions' => $this->faker->randomElement(['10x5x2', '15x10x5', '20x15x10', '30x20x15']),
            'image' => $this->faker->imageUrl(600, 600, 'product'),
            'images' => json_encode([
                $this->faker->imageUrl(600, 600, 'product'),
                $this->faker->imageUrl(600, 600, 'product'),
                $this->faker->imageUrl(600, 600, 'product'),
            ]),
            'category_id' => Category::factory(),
            'is_featured' => $this->faker->boolean(20),
            'is_active' => $this->faker->boolean(90),
            'meta_title' => $this->faker->sentence(),
            'meta_description' => $this->faker->paragraph(),
            'meta_keywords' => implode(', ', $this->faker->words(5)),
        ];
    }

    /**
     * Indicate that the product is featured.
     */
    public function featured(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_featured' => true,
        ]);
    }

    /**
     * Indicate that the product is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the product is out of stock.
     */
    public function outOfStock(): static
    {
        return $this->state(fn(array $attributes) => [
            'stock' => 0,
        ]);
    }

    /**
     * Indicate that the product has no discount.
     */
    public function withoutDiscount(): static
    {
        return $this->state(fn(array $attributes) => [
            'discount_price' => null,
        ]);
    }

    /**
     * Indicate that the product has high stock.
     */
    public function highStock(): static
    {
        return $this->state(fn(array $attributes) => [
            'stock' => $this->faker->numberBetween(100, 1000),
        ]);
    }

    /**
     * Indicate that the product has a specific category.
     */
    public function forCategory($category): static
    {
        return $this->state(fn(array $attributes) => [
            'category_id' => $category instanceof Category ? $category->id : $category,
        ]);
    }
}
