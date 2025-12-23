<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;

class FlashSale extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'discount_percentage',
        'original_price',
        'discounted_price',
        'stock_limit',
        'sold_count',
        'start_time',
        'end_time',
        'is_active',
        'session_type', // 'morning', 'afternoon', 'evening'
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'is_active' => 'boolean',
        'original_price' => 'decimal:2',
        'discounted_price' => 'decimal:2',
    ];

    protected $appends = [
        'remaining_stock',
        'progress_percentage',
        'is_currently_active',
        'time_left',
    ];

    /**
     * Relasi ke Product
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Remaining stock
     */
    protected function remainingStock(): Attribute
    {
        return Attribute::make(
            get: fn() => max(0, $this->stock_limit - $this->sold_count)
        );
    }

    /**
     * Progress percentage
     */
    protected function progressPercentage(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->stock_limit == 0 ? 0 : min(100, ($this->sold_count / $this->stock_limit) * 100)
        );
    }

    /**
     * Is currently active
     */
    protected function isCurrentlyActive(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->is_active &&
                $this->start_time &&
                $this->end_time &&
                now()->between($this->start_time, $this->end_time)
        );
    }

    /**
     * Time left in seconds
     */
    protected function timeLeft(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->is_currently_active ? max(0, $this->end_time->diffInSeconds(now())) : 0
        );
    }

    /**
     * Time left formatted (HH:MM:SS)
     */
    public function getTimeLeftFormattedAttribute(): string
    {
        $seconds = $this->time_left;
        $hours = floor($seconds / 3600);
        $minutes = floor(($seconds % 3600) / 60);
        $seconds = $seconds % 60;
        return sprintf('%02d:%02d:%02d', $hours, $minutes, $seconds);
    }

    /**
     * Scope active flash sales
     */
    public function scopeActive($query)
    {
        $now = now();
        return $query->where('is_active', true)
            ->where('start_time', '<=', $now)
            ->where('end_time', '>=', $now);
    }

    /**
     * Scope upcoming flash sales
     */
    public function scopeUpcoming($query)
    {
        $now = now();
        return $query->where('is_active', true)
            ->where('start_time', '>', $now);
    }

    /**
     * Increment sold count
     */
    public function incrementSoldCount(int $quantity = 1): void
    {
        $this->increment('sold_count', $quantity);
        $this->product?->increment('sold_count', $quantity); // null-safe operator
    }

    /**
     * Check stock availability
     */
    public function hasStock(int $quantity = 1): bool
    {
        return $this->remaining_stock >= $quantity;
    }
}
