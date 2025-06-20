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
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();
            $table->string('itemName');
            $table->string('itemCode')->unique();
            $table->enum('category', ['food', 'housekeeping', 'equipment', 'amenities', 'maintenance', 'office']);
            $table->float('quantity', 10, 2)->default(0);
            $table->string('unit')->default('pcs');
            $table->float('minStockLevel', 10, 2)->default(0);
            $table->decimal('price', 10, 2);
            $table->string('supplier')->nullable();
            $table->enum('location', ['kitchen', 'restaurant', 'bar', 'storage', 'housekeeping', 'maintenance', 'office'])->default('storage');
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->timestamp('lastRestocked')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventories');
    }
};
