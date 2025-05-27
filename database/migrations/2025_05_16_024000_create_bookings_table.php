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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
            $table->string('roomNumber'); // Match the column name in rooms table
            $table->string('roomType');
            $table->date('check_in_date');
            $table->date('check_out_date');
            $table->integer('adults')->default(1);
            $table->integer('children')->default(0);
            $table->integer('extra_beds')->default(0);
            $table->decimal('extra_bed_rate', 10, 2)->default(500.00);
            $table->decimal('amount', 10, 2); // Base room amount
            $table->decimal('total_amount', 10, 2); // Total including extras
            $table->enum('status', ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'])->default('pending');
            $table->text('special_requests')->nullable();
            $table->string('booking_reference')->nullable()->unique();
            $table->string('payment_method');
            $table->enum('payment_status', ['pending', 'paid', 'partially_paid', 'cancelled'])->default('pending');
            $table->string('payment_transaction_id')->nullable();
            $table->boolean('terms_accepted')->default(false);
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
