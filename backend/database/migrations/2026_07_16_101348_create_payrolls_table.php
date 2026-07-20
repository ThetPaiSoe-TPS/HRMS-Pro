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
            $table->decimal('net_salary', 15, 2)->default(0);

            $table->enum('payment_status', ['pending', 'processing', 'paid'])->default('pending');
            $table->date('payment_date')->nullable();

            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();

            $table->index(['employee_id', 'payroll_month']);
            $table->index('payment_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payrolls');
    }
};