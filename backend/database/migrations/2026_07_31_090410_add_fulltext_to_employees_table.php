<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Check if employees table exists
        if (!Schema::hasTable('employees')) {
            return;
        }

        // Check if columns exist
        $columns = Schema::getColumnListing('employees');
        $fullTextColumns = [];

        // Your actual columns: name, employee_code, email
        $possibleColumns = ['name', 'employee_code', 'email'];
        foreach ($possibleColumns as $column) {
            if (in_array($column, $columns)) {
                $fullTextColumns[] = $column;
            }
        }

        // Only proceed if we have at least 2 columns
        if (count($fullTextColumns) >= 2) {
            try {
                // Check if index already exists
                $indexes = DB::select("SHOW INDEX FROM employees WHERE Key_name = 'employees_fulltext'");
                if (empty($indexes)) {
                    Schema::table('employees', function (Blueprint $table) use ($fullTextColumns) {
                        $table->fullText($fullTextColumns, 'employees_fulltext');
                    });
                    // Use echo or error_log instead of command
                    error_log('✅ Full-text index added to employees table on: ' . implode(', ', $fullTextColumns));
                }
            } catch (\Exception $e) {
                // Silently fail or log
                error_log('⚠️ Could not add fulltext index: ' . $e->getMessage());
            }
        }
    }

    public function down()
    {
        try {
            Schema::table('employees', function (Blueprint $table) {
                $table->dropFullText('employees_fulltext');
            });
        } catch (\Exception $e) {
            // Silently fail
        }
    }
};
