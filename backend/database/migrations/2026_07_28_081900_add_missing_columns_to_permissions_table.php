<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('permissions', function (Blueprint $table) {
            // Add module if missing
            if (!Schema::hasColumn('permissions', 'module')) {
                $table->string('module')->default('general')->after('name');
            }

            // Add description if missing
            if (!Schema::hasColumn('permissions', 'description')) {
                $table->text('description')->nullable()->after('module');
            }

            // Add guard_name if missing
            if (!Schema::hasColumn('permissions', 'guard_name')) {
                $table->string('guard_name')->default('api')->after('description');
            }
        });
    }

    public function down(): void
    {
        Schema::table('permissions', function (Blueprint $table) {
            if (Schema::hasColumn('permissions', 'module')) {
                $table->dropColumn('module');
            }
            if (Schema::hasColumn('permissions', 'description')) {
                $table->dropColumn('description');
            }
            if (Schema::hasColumn('permissions', 'guard_name')) {
                $table->dropColumn('guard_name');
            }
        });
    }
};
