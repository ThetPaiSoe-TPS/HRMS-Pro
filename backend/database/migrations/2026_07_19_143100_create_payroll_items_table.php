<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payroll_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payroll_id')->constrained()->cascadeOnDelete();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();

            $table->enum('item_type', ['allowance', 'deduction', 'earning', 'tax', 'insurance', 'loan']);
            $table->string('category', 50);
            $table->string('description', 255);

            $table->decimal('amount', 15, 2);
            $table->boolean('is_percentage')->default(false);
            $table->decimal('percentage_value', 5, 2)->nullable();

            $table->bigInteger('reference_id')->nullable();
            $table->string('reference_type', 50)->nullable();

            $table->timestamps();

            $table->index(['payroll_id', 'item_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payroll_items');
    }
};