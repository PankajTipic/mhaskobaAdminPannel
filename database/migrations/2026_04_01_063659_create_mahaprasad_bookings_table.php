<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('mahaprasad_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahaprasad_date_id')->constrained('mahaprasad_dates')->onDelete('cascade');
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->enum('status', ['confirmed', 'shifted', 'cancelled'])->default('confirmed');
            $table->foreignId('shifted_to_date_id')->nullable()->constrained('mahaprasad_dates');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('mahaprasad_bookings');
    }
};