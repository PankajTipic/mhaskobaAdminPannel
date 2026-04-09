<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('mahaprasad_dates', function (Blueprint $table) {
            $table->text('event_details')->nullable()->after('type');
        });
    }

    public function down()
    {
        Schema::table('mahaprasad_dates', function (Blueprint $table) {
            $table->dropColumn('event_details');
        });
    }
};