<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Carbon;

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
        'session_type',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'original_price' => 'decimal:2',
        'discounted_price' => 'decimal:2',
        'is_active' => 'integer', // PENTING
    ];

    protected $appends = [
        'remaining_stock',
        'progress_percentage',
        'is_currently_active',
        'time_left',
    ];

    /* ================= RELATIONS ================= */

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /* ================= ATTRIBUTES ================= */

    protected function remainingStock(): Attribute
    {
        return Attribute::make(
            get: fn() => max(0, (int) $this->stock_limit - (int) $this->sold_count)
        );
    }

    protected function progressPercentage(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->stock_limit > 0
                ? min(100, round(($this->sold_count / $this->stock_limit) * 100))
                : 0
        );
    }

    protected function isCurrentlyActive(): Attribute
    {
        return Attribute::make(
            get: function () {
                if ((int) $this->is_active !== 1) {
                    return false;
                }

                $now = Carbon::now();

                if ($this->start_time && $now->lt($this->start_time)) {
                    return false;
                }

                if ($this->end_time && $now->gt($this->end_time)) {
                    return false;
                }

                return true;
            }
        );
    }

    protected function timeLeft(): Attribute
    {
        return Attribute::make(
            get: fn() =>
            $this->is_currently_active && $this->end_time
                ? max(0, Carbon::now()->diffInSeconds($this->end_time, false))
                : 0
        );
    }

    /* ================= SCOPES ================= */

    /**
     * SAFE ACTIVE SCOPE
     * - Hanya filter status
     * - TIDAK filter waktu
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', 1);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('is_active', 1);
    }

    /* ================= HELPERS ================= */

    public function incrementSoldCount(int $quantity = 1): void
    {
        $this->increment('sold_count', $quantity);
        $this->product?->increment('sold_count', $quantity);
    }

    public function hasStock(int $quantity = 1): bool
    {
        return $this->remaining_stock >= $quantity;
    }

    public function scopeHighDiscountProduct($query, int $min = 25)
    {
        return $query->whereHas('product', function ($q) use ($min) {
            $q->whereNotNull('discount_price')
                ->whereColumn('discount_price', '<', 'price')
                ->whereRaw('((price - discount_price) / price * 100) >= ?', [$min]);
        });
    }
}
