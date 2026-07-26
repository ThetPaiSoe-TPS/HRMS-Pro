<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leave_requests', function (Blueprint $table) {
            // Drop the old leave_type column if it exists
            if (Schema::hasColumn('leave_requests', 'leave_type')) {
                $table->dropColumn('leave_type');
            }
        });
    }

    public function down(): void
    {
        Schema::table('leave_requests', function (Blueprint $table) {
            // Re-add the leave_type column if rolling back
            if (!Schema::hasColumn('leave_requests', 'leave_type')) {
                $table->string('leave_type')->nullable()->after('employee_id');
            }
        });
    }
};
