<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('donations', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->decimal('amount', 10, 2)->default(0.00);     // in rupees
            $table->string('purpose')->default('general');
            $table->text('message')->nullable();
            $table->string('transaction_id')->unique()->nullable();
            $table->string('order_id')->nullable();
            $table->string('status')->default('pending');        // pending, success, failed
            $table->string('payment_method')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};