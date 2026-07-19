<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_salaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();

            $table->decimal('base_salary', 15, 2);
            $table->decimal('hourly_rate', 10, 2)->nullable();
            $table->decimal('weekly_rate', 10, 2)->nullable();
            $table->decimal('monthly_rate', 15, 2)->nullable();

            $table->json('allowances')->nullable();
            $table->json('deductions')->nullable();

            $table->string('bank_name', 100)->nullable();
            $table->string('bank_account', 50)->nullable();
            $table->string('bank_branch', 100)->nullable();
            $table->string('account_type', 50)->nullable();

            $table->boolean('is_active')->default(true);
            $table->date('effective_date');
            $table->date('end_date')->nullable();

            $table->timestamps();

            $table->index(['employee_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_salaries');
    }
};