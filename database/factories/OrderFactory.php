<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = $this->faker->numberBetween(50000, 5000000);
        $tax = $subtotal * 0.11; // 11% PPN
        $shippingCost = $this->faker->numberBetween(10000, 50000);
        $total = $subtotal + $tax + $shippingCost;
        
        return [
            'order_number' => 'ORD-' . date('Ymd') . '-' . strtoupper($this->faker->bothify('??????')),
            'user_id' => \App\Models\User::factory(),
            'customer_name' => $this->faker->name(),
            'customer_email' => $this->faker->safeEmail(),
            'customer_phone' => $this->faker->phoneNumber(),
            'customer_address' => $this->faker->address(),
            'customer_city' => $this->faker->city(),
            'customer_province' => $this->faker->state(),
            'customer_postal_code' => $this->faker->postcode(),
            'customer_country' => 'Indonesia',
            'subtotal' => $subtotal,
            'tax' => $tax,
            'shipping_cost' => $shippingCost,
            'total' => $total,
            'status' => $this->faker->randomElement(Order::STATUSES),
            'payment_status' => $this->faker->randomElement(['pending', 'paid', 'failed', 'refunded']),
            'payment_method' => $this->faker->randomElement(['bank_transfer', 'credit_card', 'ewallet', 'cod']),
            'payment_id' => $this->faker->uuid(),
            'notes' => $this->faker->boolean(30) ? $this->faker->sentence() : null,
            'shipping_tracking_number' => $this->faker->boolean(60) ? 'TRK-' . strtoupper($this->faker->bothify('##########')) : null,
            'shipping_carrier' => $this->faker->randomElement(['JNE', 'TIKI', 'POS Indonesia', 'GoSend', 'GrabExpress']),
        ];
    }

    /**
     * Indicate that the order is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'payment_status' => 'pending',
        ]);
    }

    /**
     * Indicate that the order is processing.
     */
    public function processing(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'processing',
            'payment_status' => 'paid',
        ]);
    }

    /**
     * Indicate that the order is shipped.
     */
    public function shipped(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'shipped',
            'payment_status' => 'paid',
            'shipping_tracking_number' => 'TRK-' . strtoupper($this->faker->bothify('##########')),
        ]);
    }

    /**
     * Indicate that the order is delivered.
     */
    public function delivered(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'delivered',
            'payment_status' => 'paid',
        ]);
    }

    /**
     * Indicate that the order is cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
            'payment_status' => $this->faker->randomElement(['pending', 'refunded']),
        ]);
    }

    /**
     * Indicate that the order is COD (Cash on Delivery).
     */
    public function cod(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_method' => 'cod',
            'payment_status' => 'pending',
        ]);
    }

    /**
     * Indicate that the order is from a specific user.
     */
    public function forUser($user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user instanceof \App\Models\User ? $user->id : $user,
        ]);
    }
}