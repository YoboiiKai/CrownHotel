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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('client_name');
            $table->string('event_type');
            $table->date('date');
            $table->string('start_time');
            $table->string('end_time');
            $table->string('venue');
            $table->integer('guest_count');
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending');
            $table->string('contact_number');
            $table->string('email');
            $table->text('special_requests')->nullable();
            $table->string('package_type');
            $table->decimal('total_amount', 10, 2);
            $table->decimal('deposit_amount', 10, 2);
            $table->enum('payment_status', ['unpaid', 'deposit_paid', 'fully_paid'])->default('unpaid');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
