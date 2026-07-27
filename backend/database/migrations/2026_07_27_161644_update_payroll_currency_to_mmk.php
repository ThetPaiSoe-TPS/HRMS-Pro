<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // No database changes needed for currency, just frontend display
        // But you can add a currency column if needed
        Schema::table('payrolls', function (Blueprint $table) {
            if (!Schema::hasColumn('payrolls', 'currency')) {
                $table->string('currency', 10)->default('MMK')->after('net_salary');
            }
        });
    }

    public function down(): void
    {
        Schema::table('payrolls', function (Blueprint $table) {
            if (Schema::hasColumn('payrolls', 'currency')) {
                $table->dropColumn('currency');
            }
        });
    }
};
