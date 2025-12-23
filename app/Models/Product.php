<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Review;
use App\Models\OrderItem;
use App\Models\FlashSale;
use App\Models\Store; // pastikan Store model sudah ada

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'discount_price',
        'stock',
        'sku',
        'weight',
        'dimensions',
        'image',
        'images',
        'category_id',
        'brand_id',
        'store_id', // tambahkan jika ingin relasi ke store
        'is_featured',
        'is_active',
        'meta_title',
        'meta_description',
        'meta_keywords',
    ];

    protected $appends = [
        'final_price',
        'price_formatted',
        'discount_price_formatted',
        'final_price_formatted',
        'discount',
        'is_in_stock',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'images' => 'array',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // =======================
    // RELATIONS
    // =======================
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function flashSales()
    {
        return $this->hasMany(FlashSale::class);
    }

    // =======================
    // ACCESSORS
    // =======================

    public function getFinalPriceAttribute()
    {
        return $this->discount_price ?? $this->price;
    }

    public function getIsInStockAttribute(): bool
    {
        return $this->stock > 0;
    }

    public function getPriceFormattedAttribute(): string
    {
        return number_format($this->price, 0, ',', '.');
    }

    public function getDiscountPriceFormattedAttribute(): ?string
    {
        return $this->discount_price
            ? number_format($this->discount_price, 0, ',', '.')
            : null;
    }

    public function getFinalPriceFormattedAttribute(): string
    {
        return number_format($this->final_price, 0, ',', '.');
    }

    public function getDiscountAttribute(): int
    {
        if ($this->price && $this->discount_price !== null) {
            return (int) round((($this->price - $this->discount_price) / $this->price) * 100);
        }

        return 0;
    }
}
