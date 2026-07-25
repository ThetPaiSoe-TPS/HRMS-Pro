<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('positions', function (Blueprint $table) {
            if (!Schema::hasColumn('positions', 'code')) {
                $table->string('code', 50)->nullable()->unique()->after('title');
            }
            if (!Schema::hasColumn('positions', 'min_salary')) {
                $table->decimal('min_salary', 15, 2)->nullable()->after('description');
            }
            if (!Schema::hasColumn('positions', 'max_salary')) {
                $table->decimal('max_salary', 15, 2)->nullable()->after('min_salary');
            }
            if (!Schema::hasColumn('positions', 'status')) {
                $table->enum('status', ['active', 'inactive'])->default('active')->after('max_salary');
            }
        });
    }

    public function down(): void
    {
        Schema::table('positions', function (Blueprint $table) {
            $columns = ['code', 'min_salary', 'max_salary', 'status'];
            foreach ($columns as $column) {
                if (Schema::hasColumn('positions', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
