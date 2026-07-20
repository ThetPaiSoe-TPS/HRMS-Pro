<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('permissions', 'name')) {
            Schema::table('permissions', function (Blueprint $table) {
                $table->string('name')->after('id');
                $table->string('slug')->unique()->after('name');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('permissions', 'name')) {
            Schema::table('permissions', function (Blueprint $table) {
                $table->dropColumn(['name', 'slug']);
            });
        }
    }
};
