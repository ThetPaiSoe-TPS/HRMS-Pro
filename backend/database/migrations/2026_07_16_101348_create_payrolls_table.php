<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('payrolls');

        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->date('payroll_month');

            $table->decimal('basic_salary', 15, 2)->default(0);
            $table->decimal('hourly_rate', 10, 2)->nullable();

            $table->integer('total_work_days')->default(0);
            $table->integer('present_days')->default(0);
            $table->integer('absent_days')->default(0);
            $table->integer('leave_days')->default(0);
            $table->decimal('overtime_hours', 5, 2)->default(0);
            $table->decimal('overtime_rate', 10, 2)->nullable();
            $table->decimal('overtime_amount', 15, 2)->default(0);

            $table->json('allowances')->nullable();
            $table->decimal('total_allowances', 15, 2)->default(0);

            $table->json('deductions')->nullable();
            $table->decimal('total_deductions', 15, 2)->default(0);

            $table->decimal('gross_salary', 15, 2)->default(0);
            $table->decimal('net_salary', 15, 2)->default(0);

            $table->enum('payment_method', ['bank_transfer', 'cash', 'check'])->default('bank_transfer');
            $table->string('bank_name', 100)->nullable();
            $table->string('bank_account', 50)->nullable();
            $table->date('payment_date')->nullable();
            $table->enum('payment_status', ['pending', 'processing', 'paid', 'failed'])->default('pending');

            $table->string('payslip_path', 255)->nullable();
            $table->timestamp('payslip_generated_at')->nullable();

            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();

            $table->timestamps();

            $table->index(['employee_id', 'payroll_month']);
            $table->index('payment_status');
            $table->index('payroll_month');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payrolls');
    }
};