<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('flash_sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')
                  ->constrained()
                  ->onDelete('cascade');

            $table->decimal('original_price', 12, 2); // Harga asli produk
            $table->decimal('discounted_price', 12, 2); // Harga setelah diskon
            $table->integer('discount_percentage'); // Persentase diskon

            $table->integer('stock_limit'); // Limit stok untuk flash sale
            $table->integer('sold_count')->default(0); // Jumlah yang sudah terjual

            $table->timestamp('start_time'); // Waktu mulai flash sale
            $table->timestamp('end_time');   // Waktu berakhir flash sale

            $table->boolean('is_active')->default(true); // Status aktif

            $table->timestamps();

            // Indexes
            $table->index('start_time');
            $table->index('end_time');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flash_sales');
    }
};
