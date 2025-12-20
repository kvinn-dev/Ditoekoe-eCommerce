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
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('is_flash_sale')->default(false)->after('is_featured');
            $table->timestamp('flash_sale_end')->nullable()->after('is_flash_sale');
            $table->decimal('flash_sale_price', 10, 2)->nullable()->after('flash_sale_end');
            
            $table->index('is_flash_sale');
            $table->index('flash_sale_end');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['is_flash_sale', 'flash_sale_end', 'flash_sale_price']);
        });
    }
};