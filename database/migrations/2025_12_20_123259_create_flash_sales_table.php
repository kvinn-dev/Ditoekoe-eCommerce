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
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->integer('discount_percentage');
            $table->integer('stock_limit');
            $table->integer('sold_count')->default(0);
            $table->timestamp('start_time');
            $table->timestamp('end_time');
            $table->boolean('is_active')->default(true);
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