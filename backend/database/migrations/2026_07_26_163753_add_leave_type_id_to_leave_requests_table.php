<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leave_requests', function (Blueprint $table) {
            // Add leave_type_id column
            if (!Schema::hasColumn('leave_requests', 'leave_type_id')) {
                $table->foreignId('leave_type_id')->nullable()->after('employee_id')
                    ->constrained('leave_types')->nullOnDelete();
            }

            // Add total_days if missing
            if (!Schema::hasColumn('leave_requests', 'total_days')) {
                $table->integer('total_days')->default(0)->after('end_date');
            }

            // Add rejection_reason if missing
            if (!Schema::hasColumn('leave_requests', 'rejection_reason')) {
                $table->text('rejection_reason')->nullable()->after('reason');
            }

            // Add approved_at if missing
            if (!Schema::hasColumn('leave_requests', 'approved_at')) {
                $table->timestamp('approved_at')->nullable()->after('rejection_reason');
            }

            // Add approved_by if missing
            if (!Schema::hasColumn('leave_requests', 'approved_by')) {
                $table->foreignId('approved_by')->nullable()->after('approved_at')
                    ->constrained('users')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('leave_requests', function (Blueprint $table) {
            if (Schema::hasColumn('leave_requests', 'leave_type_id')) {
                $table->dropForeign(['leave_type_id']);
                $table->dropColumn('leave_type_id');
            }
            if (Schema::hasColumn('leave_requests', 'total_days')) {
                $table->dropColumn('total_days');
            }
            if (Schema::hasColumn('leave_requests', 'rejection_reason')) {
                $table->dropColumn('rejection_reason');
            }
            if (Schema::hasColumn('leave_requests', 'approved_at')) {
                $table->dropColumn('approved_at');
            }
            if (Schema::hasColumn('leave_requests', 'approved_by')) {
                $table->dropForeign(['approved_by']);
                $table->dropColumn('approved_by');
            }
        });
    }
};
