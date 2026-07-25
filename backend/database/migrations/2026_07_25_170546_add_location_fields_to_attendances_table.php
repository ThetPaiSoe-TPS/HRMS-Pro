<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            if (!Schema::hasColumn('attendances', 'location_in')) {
                $table->string('location_in', 255)->nullable()->after('note');
            }
            if (!Schema::hasColumn('attendances', 'location_out')) {
                $table->string('location_out', 255)->nullable()->after('location_in');
            }
            if (!Schema::hasColumn('attendances', 'status')) {
                $table->enum('status', ['present', 'absent', 'late', 'half_day', 'leave'])->default('present')->after('check_out');
            }
            if (!Schema::hasColumn('attendances', 'note')) {
                $table->text('note')->nullable()->after('status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $columns = ['location_in', 'location_out', 'status', 'note'];
            foreach ($columns as $column) {
                if (Schema::hasColumn('attendances', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
