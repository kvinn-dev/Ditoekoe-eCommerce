<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ViewProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'price',
        'final_price',
        'discount_price',
        'discount',
        'sold',
        'stock',
        'min_order',
        'weight',
        'dimensions',
        'description',
        'condition',
        'is_featured',
        'is_flash_sale',
        'category_id',
        'brand_id',
        'image',
        'images', // bisa json
        'features_custom', // json string
        'specifications_json', // json string
        'meta_title',
        'meta_description',
        'meta_keywords',
        'views',
        'is_active',
        'product_id',
        'user_id',
        'viewed_at'
    ];

    protected $casts = [
        'images' => 'array',
        'features_custom' => 'array',
        'specifications_json' => 'array',
        'is_featured' => 'boolean',
        'is_flash_sale' => 'boolean',
        'views' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Relasi ke kategori
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Relasi ke brand
     */
    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    /**
     * Relasi ke review
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Relasi ke view product (tracking user views)
     */
    public function viewsTracked(): HasMany
    {
        return $this->hasMany(ViewProduct::class);
    }

    /**
     * Mendapatkan harga diskon final
     */
    public function getFinalPriceAttribute(): float
    {
        if ($this->discount_price) {
            return $this->discount_price;
        }

        if ($this->discount) {
            return $this->price - ($this->price * ($this->discount / 100));
        }

        return $this->price;
    }

    /**
     * Mendapatkan rating produk
     */
    public function getRatingAttribute(): float
    {
        $approvedReviews = $this->reviews->where('is_approved', true);
        if ($approvedReviews->count() === 0) return 0;
        return round($approvedReviews->avg('rating'), 1);
    }
}
