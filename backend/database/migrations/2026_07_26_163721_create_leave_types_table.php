<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('leave_types')) {
            Schema::create('leave_types', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('code')->unique();
                $table->text('description')->nullable();
                $table->integer('days_per_year')->default(0);
                $table->boolean('is_paid')->default(true);
                $table->boolean('requires_approval')->default(true);
                $table->integer('max_consecutive_days')->nullable();
                $table->boolean('carry_forward')->default(false);
                $table->integer('carry_forward_limit')->nullable();
                $table->enum('status', ['active', 'inactive'])->default('active');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('leave_types');
    }
};
