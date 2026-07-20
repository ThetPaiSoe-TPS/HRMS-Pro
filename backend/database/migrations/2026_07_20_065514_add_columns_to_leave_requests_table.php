<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('leave_requests', function (Blueprint $table) {
            if (!Schema::hasColumn('leave_requests', 'employee_id')) {
                $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            }
            if (!Schema::hasColumn('leave_requests', 'leave_type')) {
                $table->string('leave_type', 100);
            }
            if (!Schema::hasColumn('leave_requests', 'start_date')) {
                $table->date('start_date');
            }
            if (!Schema::hasColumn('leave_requests', 'end_date')) {
                $table->date('end_date');
            }
            if (!Schema::hasColumn('leave_requests', 'reason')) {
                $table->text('reason')->nullable();
            }
            if (!Schema::hasColumn('leave_requests', 'status')) {
                $table->enum('status', ['pending', 'approved', 'rejected', 'cancelled'])->default('pending');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leave_requests', function (Blueprint $table) {
            //
        });
    }
};
