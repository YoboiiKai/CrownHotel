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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('roomNumber');
            $table->string('customerName')->default('Guest');
            
            // Store multiple items as JSON
            $table->json('items')->comment('JSON array of order items containing menuItemId, name, quantity, price');
            
            // Order totals
            $table->decimal('subtotal', 10, 2);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('total', 10, 2);
            
            // Additional information
            $table->text('notes')->nullable();
            $table->boolean('isSeniorCitizen')->default(false);
            $table->enum('status', ['pending', 'processing', 'completed', 'cancelled'])->default('pending');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
