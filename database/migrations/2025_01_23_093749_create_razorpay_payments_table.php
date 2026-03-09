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
        Schema::create('razorpay_payments', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->string('name'); // Name of the payer
            $table->string('mobile'); // Mobile number of the payer
            $table->string('type'); // Payment type (e.g., subscription, one-time, etc.)
            $table->decimal('amount', 10, 2); // Payment amount
            $table->string('transaction_id')->unique(); // Transaction ID (unique for every payment)
            $table->string('receipt')->nullable(); // Receipt ID or number
            $table->string('payment_id')->unique(); // Razorpay Payment ID
            $table->string('order_id'); // Razorpay Order ID
            $table->string('status'); // Payment status (e.g., successful, failed)
            $table->string('currency', 10)->default('INR'); // Currency
            $table->string('method')->nullable(); // Payment method (e.g., card, UPI)
            $table->json('response')->nullable(); // Raw response from Razorpay
            $table->timestamps(); // Created and Updated timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('razorpay_payments');
    }
};
