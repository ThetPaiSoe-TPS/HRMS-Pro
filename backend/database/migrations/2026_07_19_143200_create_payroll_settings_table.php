<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payroll_settings', function (Blueprint $table) {
            $table->id();

            $table->enum('payroll_cycle', ['monthly', 'bi_weekly', 'weekly'])->default('monthly');
            $table->integer('payroll_day')->default(25);
            $table->integer('pay_day')->default(30);

            $table->string('tax_regime', 50)->default('standard');
            $table->json('tax_tables')->nullable();

            $table->decimal('insurance_employee_rate', 5, 2)->default(0);
            $table->decimal('insurance_employer_rate', 5, 2)->default(0);

            $table->decimal('overtime_rate_multiplier', 3, 2)->default(1.50);
            $table->decimal('holiday_rate_multiplier', 3, 2)->default(2.00);
            $table->decimal('night_shift_rate_multiplier', 3, 2)->default(1.25);

            $table->decimal('max_loan_percentage', 5, 2)->default(30.00);
            $table->decimal('min_loan_amount', 15, 2)->default(1000.00);

            $table->json('default_allowances')->nullable();
            $table->json('default_deductions')->nullable();

            $table->foreignId('company_id')->constrained('company_settings')->cascadeOnDelete();
            $table->timestamps();

            $table->unique('company_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payroll_settings');
    }
};