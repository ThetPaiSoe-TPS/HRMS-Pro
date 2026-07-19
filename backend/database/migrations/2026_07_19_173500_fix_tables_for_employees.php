<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::dropIfExists('employees');
        Schema::dropIfExists('positions');

        Schema::create('positions', function (Blueprint $table) {
            $table->id();
            $table->string('title', 255);
            $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
            $table->text('description')->nullable();
            $table->string('salary_range', 100)->nullable();
            $table->timestamps();
        });

        Schema::table('departments', function (Blueprint $table) {
            if (!Schema::hasColumn('departments', 'name')) {
                $table->string('name', 255);
            }
            if (!Schema::hasColumn('departments', 'code')) {
                $table->string('code', 50)->nullable()->unique();
            }
            if (!Schema::hasColumn('departments', 'description')) {
                $table->text('description')->nullable();
            }
            if (!Schema::hasColumn('departments', 'manager_id')) {
                $table->foreignId('manager_id')->nullable()->constrained('employees')->nullOnDelete();
            }
        });

        Schema::enableForeignKeyConstraints();
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::dropIfExists('positions');

        Schema::table('departments', function (Blueprint $table) {
            $columns = ['name', 'code', 'description', 'manager_id'];
            foreach ($columns as $column) {
                if (Schema::hasColumn('departments', $column)) {
                    $table->dropColumn($column);
                }
            }
        });

        Schema::enableForeignKeyConstraints();
    }
};