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
            $table->enum('service_type', ['room', 'table'])->default('room');
            $table->string('room_number')->nullable();
            $table->string('table_number')->nullable();
            $table->string('customerName')->default('Guest');
            
            // Store multiple items as JSON
            $table->json('items')->comment('JSON array of order items containing menu_id, quantity, price, subtotal');
            
            // Store images for order items
            $table->json('images')->nullable()->comment('JSON array of image paths corresponding to order items');
            
            // Order totals
            $table->decimal('subtotal', 10, 2);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('total', 10, 2);
            
            // Additional information
            $table->text('notes')->nullable();
            $table->boolean('is_senior_citizen')->default(false);
            $table->enum('payment_method', ['cash', 'card', 'mobile'])->default('cash');
            $table->enum('payment_status', ['pending', 'processing', 'completed', 'failed'])->nullable();
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
