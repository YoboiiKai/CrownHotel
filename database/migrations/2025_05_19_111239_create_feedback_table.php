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
        Schema::create('feedback', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('feedback_type', ['employee', 'hotel_service']);
            $table->string('employee_name')->nullable();
            $table->unsignedBigInteger('employee_id')->nullable();
            $table->string('service_type');
            $table->unsignedTinyInteger('rating');
            $table->text('comment');
            $table->boolean('anonymous')->default(false);
            $table->enum('status', ['published', 'archived', 'deleted'])->default('published');
            $table->timestamps();
            
            // Add index for faster queries
            $table->index(['user_id', 'feedback_type']);
            $table->index('employee_id');
            $table->index('service_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feedback');
    }
};
