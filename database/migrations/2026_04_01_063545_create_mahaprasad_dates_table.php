<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('mahaprasad_dates', function (Blueprint $table) {
            $table->id();
            $table->date('event_date')->unique();
            $table->integer('max_limit')->default(10);
            $table->integer('booked_count')->default(0);
            $table->enum('type', ['sunday', 'event'])->default('sunday');
            $table->enum('status', ['open', 'closed'])->default('open');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('mahaprasad_dates');
    }
};