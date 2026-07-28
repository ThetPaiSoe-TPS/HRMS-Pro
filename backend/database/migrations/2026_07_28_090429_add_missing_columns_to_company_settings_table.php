<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('company_settings', function (Blueprint $table) {
            // Company Info
            if (!Schema::hasColumn('company_settings', 'company_code')) {
                $table->string('company_code', 50)->nullable()->after('company_name');
            }
            if (!Schema::hasColumn('company_settings', 'company_city')) {
                $table->string('company_city', 100)->nullable()->after('company_address');
            }
            if (!Schema::hasColumn('company_settings', 'company_state')) {
                $table->string('company_state', 100)->nullable()->after('company_city');
            }
            if (!Schema::hasColumn('company_settings', 'company_country')) {
                $table->string('company_country', 100)->nullable()->after('company_state');
            }
            if (!Schema::hasColumn('company_settings', 'company_zip')) {
                $table->string('company_zip', 20)->nullable()->after('company_country');
            }
            if (!Schema::hasColumn('company_settings', 'company_website')) {
                $table->string('company_website', 255)->nullable()->after('company_zip');
            }
            if (!Schema::hasColumn('company_settings', 'company_logo')) {
                $table->string('company_logo', 255)->nullable()->after('company_website');
            }

            // Tax & Registration
            if (!Schema::hasColumn('company_settings', 'tax_id')) {
                $table->string('tax_id', 50)->nullable()->after('company_logo');
            }
            if (!Schema::hasColumn('company_settings', 'registration_number')) {
                $table->string('registration_number', 50)->nullable()->after('tax_id');
            }

            // Localization
            if (!Schema::hasColumn('company_settings', 'timezone')) {
                $table->string('timezone', 50)->default('UTC')->after('registration_number');
            }
            if (!Schema::hasColumn('company_settings', 'date_format')) {
                $table->string('date_format', 20)->default('YYYY-MM-DD')->after('timezone');
            }
            if (!Schema::hasColumn('company_settings', 'time_format')) {
                $table->string('time_format', 20)->default('HH:mm')->after('date_format');
            }
            if (!Schema::hasColumn('company_settings', 'currency')) {
                $table->string('currency', 10)->default('USD')->after('time_format');
            }
            if (!Schema::hasColumn('company_settings', 'currency_symbol')) {
                $table->string('currency_symbol', 10)->default('$')->after('currency');
            }

            // Fiscal Year
            if (!Schema::hasColumn('company_settings', 'fiscal_year_start')) {
                $table->date('fiscal_year_start')->nullable()->after('currency_symbol');
            }
            if (!Schema::hasColumn('company_settings', 'fiscal_year_end')) {
                $table->date('fiscal_year_end')->nullable()->after('fiscal_year_start');
            }
            if (!Schema::hasColumn('company_settings', 'week_start_day')) {
                $table->string('week_start_day', 20)->default('Monday')->after('fiscal_year_end');
            }
        });
    }

    public function down(): void
    {
        Schema::table('company_settings', function (Blueprint $table) {
            $columns = [
                'company_code',
                'company_city',
                'company_state',
                'company_country',
                'company_zip',
                'company_website',
                'company_logo',
                'tax_id',
                'registration_number',
                'timezone',
                'date_format',
                'time_format',
                'currency',
                'currency_symbol',
                'fiscal_year_start',
                'fiscal_year_end',
                'week_start_day',
            ];
            foreach ($columns as $column) {
                if (Schema::hasColumn('company_settings', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
