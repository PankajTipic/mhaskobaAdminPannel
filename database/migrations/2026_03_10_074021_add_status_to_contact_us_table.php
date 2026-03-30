<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::table('contact_us', function (Blueprint $table) {
        $table->boolean('is_read')->default(false)->after('message');
        $table->timestamp('read_at')->nullable()->after('is_read');
    });
}

public function down()
{
    Schema::table('contact_us', function (Blueprint $table) {
        $table->dropColumn(['is_read', 'read_at']);
    });
}
};
