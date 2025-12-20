<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;

class FlashSale extends Model
{
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

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get remaining stock
     */
    protected function remainingStock(): Attribute
    {
        return Attribute::make(
            get: fn () => max(0, $this->stock_limit - $this->sold_count)
        );
    }

    /**
     * Get progress percentage
     */
    protected function progressPercentage(): Attribute
    {
        return Attribute::make(
            get: function () {
                if ($this->stock_limit == 0) return 0;
                return min(100, ($this->sold_count / $this->stock_limit) * 100);
            }
        );
    }

    /**
     * Check if flash sale is currently active
     */
    protected function isCurrentlyActive(): Attribute
    {
        return Attribute::make(
            get: function () {
                $now = now();
                return $this->is_active && 
                       $this->start_time && 
                       $this->end_time &&
                       $now->greaterThanOrEqualTo($this->start_time) &&
                       $now->lessThanOrEqualTo($this->end_time);
            }
        );
    }

    /**
     * Get time left in seconds
     */
    protected function timeLeft(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!$this->is_currently_active) return 0;
                return max(0, $this->end_time->diffInSeconds(now()));
            }
        );
    }

    /**
     * Get time left formatted (HH:MM:SS)
     */
    public function getTimeLeftFormattedAttribute()
    {
        $seconds = $this->time_left;
        $hours = floor($seconds / 3600);
        $minutes = floor(($seconds % 3600) / 60);
        $seconds = $seconds % 60;
        
        return sprintf('%02d:%02d:%02d', $hours, $minutes, $seconds);
    }

    /**
     * Scope for active flash sales
     */
    public function scopeActive($query)
    {
        $now = now();
        return $query->where('is_active', true)
                     ->where('start_time', '<=', $now)
                     ->where('end_time', '>=', $now);
    }

    /**
     * Scope for upcoming flash sales
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
    public function incrementSoldCount($quantity = 1)
    {
        $this->increment('sold_count', $quantity);
        
        // Update product sold count as well
        if ($this->product) {
            $this->product->increment('sold_count', $quantity);
        }
    }

    /**
     * Check if there's enough stock
     */
    public function hasStock($quantity = 1)
    {
        return $this->remaining_stock >= $quantity;
    }
}