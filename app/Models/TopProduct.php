<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;

class TopProduct extends Model
{
    protected $fillable = [
        'product_id',
        'discount_percentage',
        'original_price',
        'discounted_price',
        'stock_limit',
        'sold_count',
    ];

    protected $casts = [
        'original_price' => 'decimal:2',
        'discounted_price' => 'decimal:2',
    ];

    protected $appends = [
        'remaining_stock',
        'progress_percentage',
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