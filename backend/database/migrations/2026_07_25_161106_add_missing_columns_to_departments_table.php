<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            // Add code column if it doesn't exist
            if (!Schema::hasColumn('departments', 'code')) {
                $table->string('code', 50)->nullable()->unique()->after('name');
            }

            // Add description column if it doesn't exist
            if (!Schema::hasColumn('departments', 'description')) {
                $table->text('description')->nullable()->after('code');
            }

            // Add manager_id column if it doesn't exist
            if (!Schema::hasColumn('departments', 'manager_id')) {
                $table->foreignId('manager_id')->nullable()->constrained('employees')->nullOnDelete()->after('description');
            }

            // Add status column if it doesn't exist
            if (!Schema::hasColumn('departments', 'status')) {
                $table->enum('status', ['active', 'inactive'])->default('active')->after('manager_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            $columns = ['code', 'description', 'manager_id', 'status'];
            foreach ($columns as $column) {
                if (Schema::hasColumn('departments', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
