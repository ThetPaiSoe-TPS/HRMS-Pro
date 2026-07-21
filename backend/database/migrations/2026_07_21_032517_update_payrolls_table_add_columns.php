<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Get existing indexes using DB facade
        $indexes = collect(DB::select('SHOW INDEXES FROM payrolls'))
            ->pluck('Key_name')
            ->unique()
            ->toArray();

        Schema::table('payrolls', function (Blueprint $table) use ($indexes) {
            // Drop existing indexes if they exist
            if (in_array('payrolls_employee_id_payroll_month_index', $indexes)) {
                $table->dropIndex(['employee_id', 'payroll_month']);
            }

            if (in_array('payrolls_payment_status_index', $indexes)) {
                $table->dropIndex(['payment_status']);
            }

            // Add all columns with checks
            if (!Schema::hasColumn('payrolls', 'daily_salary')) {
                $table->decimal('daily_salary', 15, 2)->default(0)->after('basic_salary');
            }

            if (!Schema::hasColumn('payrolls', 'hourly_salary')) {
                $table->decimal('hourly_salary', 15, 2)->default(0)->after('daily_salary');
            }

            if (!Schema::hasColumn('payrolls', 'total_allowances')) {
                $table->decimal('total_allowances', 15, 2)->default(0)->after('hourly_salary');
            }

            if (!Schema::hasColumn('payrolls', 'total_overtime')) {
                $table->decimal('total_overtime', 15, 2)->default(0)->after('total_allowances');
            }

            if (!Schema::hasColumn('payrolls', 'total_bonus')) {
                $table->decimal('total_bonus', 15, 2)->default(0)->after('total_overtime');
            }

            if (!Schema::hasColumn('payrolls', 'gross_salary')) {
                $table->decimal('gross_salary', 15, 2)->default(0)->after('total_bonus');
            }

            if (!Schema::hasColumn('payrolls', 'total_deductions')) {
                $table->decimal('total_deductions', 15, 2)->default(0)->after('gross_salary');
            }

            if (!Schema::hasColumn('payrolls', 'tax_amount')) {
                $table->decimal('tax_amount', 15, 2)->default(0)->after('total_deductions');
            }

            if (!Schema::hasColumn('payrolls', 'loan_deduction')) {
                $table->decimal('loan_deduction', 15, 2)->default(0)->after('tax_amount');
            }

            if (!Schema::hasColumn('payrolls', 'advance_salary')) {
                $table->decimal('advance_salary', 15, 2)->default(0)->after('loan_deduction');
            }

            if (!Schema::hasColumn('payrolls', 'late_deduction')) {
                $table->decimal('late_deduction', 15, 2)->default(0)->after('advance_salary');
            }

            if (!Schema::hasColumn('payrolls', 'absent_deduction')) {
                $table->decimal('absent_deduction', 15, 2)->default(0)->after('late_deduction');
            }

            if (!Schema::hasColumn('payrolls', 'unpaid_leave_deduction')) {
                $table->decimal('unpaid_leave_deduction', 15, 2)->default(0)->after('absent_deduction');
            }

            if (!Schema::hasColumn('payrolls', 'other_deductions')) {
                $table->decimal('other_deductions', 15, 2)->default(0)->after('unpaid_leave_deduction');
            }

            // Drop old payment_status and add new status
            if (Schema::hasColumn('payrolls', 'payment_status')) {
                $table->dropColumn('payment_status');
            }

            if (!Schema::hasColumn('payrolls', 'status')) {
                $table->enum('status', ['draft', 'calculated', 'pending_approval', 'approved', 'paid', 'cancelled'])
                    ->default('draft')->after('net_salary');
            }

            // Payment fields
            if (!Schema::hasColumn('payrolls', 'payment_method')) {
                $table->string('payment_method', 50)->nullable()->after('payment_date');
            }

            if (!Schema::hasColumn('payrolls', 'bank_name')) {
                $table->string('bank_name', 100)->nullable()->after('payment_method');
            }

            if (!Schema::hasColumn('payrolls', 'bank_account')) {
                $table->string('bank_account', 50)->nullable()->after('bank_name');
            }

            if (!Schema::hasColumn('payrolls', 'transaction_number')) {
                $table->string('transaction_number', 100)->nullable()->after('bank_account');
            }

            if (!Schema::hasColumn('payrolls', 'paid_by')) {
                $table->foreignId('paid_by')->nullable()->constrained('users')->nullOnDelete()->after('transaction_number');
            }

            // Notes
            if (!Schema::hasColumn('payrolls', 'hr_notes')) {
                $table->text('hr_notes')->nullable()->after('paid_by');
            }

            if (!Schema::hasColumn('payrolls', 'finance_notes')) {
                $table->text('finance_notes')->nullable()->after('hr_notes');
            }

            if (!Schema::hasColumn('payrolls', 'employee_notes')) {
                $table->text('employee_notes')->nullable()->after('finance_notes');
            }

            // Rename notes to general_notes if exists
            if (Schema::hasColumn('payrolls', 'notes') && !Schema::hasColumn('payrolls', 'general_notes')) {
                $table->renameColumn('notes', 'general_notes');
            } elseif (!Schema::hasColumn('payrolls', 'general_notes')) {
                $table->text('general_notes')->nullable()->after('employee_notes');
            }

            // Audit
            if (!Schema::hasColumn('payrolls', 'approved_by')) {
                $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete()->after('created_by');
            }

            if (!Schema::hasColumn('payrolls', 'approved_at')) {
                $table->timestamp('approved_at')->nullable()->after('approved_by');
            }

            if (!Schema::hasColumn('payrolls', 'paid_at')) {
                $table->timestamp('paid_at')->nullable()->after('approved_at');
            }
        });

        // Re-add indexes - ONLY if they don't exist
        $indexes = collect(DB::select('SHOW INDEXES FROM payrolls'))
            ->pluck('Key_name')
            ->unique()
            ->toArray();

        if (!in_array('payrolls_employee_id_payroll_month_unique', $indexes)) {
            Schema::table('payrolls', function (Blueprint $table) {
                $table->unique(['employee_id', 'payroll_month']);
            });
        }

        if (!in_array('payrolls_status_payroll_month_index', $indexes)) {
            Schema::table('payrolls', function (Blueprint $table) {
                $table->index(['status', 'payroll_month']);
            });
        }

        if (!in_array('payrolls_status_index', $indexes)) {
            Schema::table('payrolls', function (Blueprint $table) {
                $table->index('status');
            });
        }
    }

    public function down(): void
    {
        $indexes = collect(DB::select('SHOW INDEXES FROM payrolls'))
            ->pluck('Key_name')
            ->unique()
            ->toArray();

        Schema::table('payrolls', function (Blueprint $table) use ($indexes) {
            if (in_array('payrolls_employee_id_payroll_month_unique', $indexes)) {
                $table->dropUnique(['employee_id', 'payroll_month']);
            }

            if (in_array('payrolls_status_payroll_month_index', $indexes)) {
                $table->dropIndex(['status', 'payroll_month']);
            }

            if (in_array('payrolls_status_index', $indexes)) {
                $table->dropIndex(['status']);
            }

            // Drop columns with checks
            $columnsToDrop = [
                'daily_salary',
                'hourly_salary',
                'total_allowances',
                'total_overtime',
                'total_bonus',
                'gross_salary',
                'total_deductions',
                'tax_amount',
                'loan_deduction',
                'advance_salary',
                'late_deduction',
                'absent_deduction',
                'unpaid_leave_deduction',
                'other_deductions',
                'payment_method',
                'bank_name',
                'bank_account',
                'transaction_number',
                'paid_by',
                'hr_notes',
                'finance_notes',
                'employee_notes',
                'general_notes',
                'approved_by',
                'approved_at',
                'paid_at'
            ];

            foreach ($columnsToDrop as $column) {
                if (Schema::hasColumn('payrolls', $column)) {
                    $table->dropColumn($column);
                }
            }

            if (Schema::hasColumn('payrolls', 'status') && !Schema::hasColumn('payrolls', 'payment_status')) {
                $table->renameColumn('status', 'payment_status');
            }

            if (Schema::hasColumn('payrolls', 'general_notes') && !Schema::hasColumn('payrolls', 'notes')) {
                $table->renameColumn('general_notes', 'notes');
            } elseif (!Schema::hasColumn('payrolls', 'notes')) {
                $table->text('notes')->nullable()->after('payment_date');
            }
        });

        $newIndexes = collect(DB::select('SHOW INDEXES FROM payrolls'))
            ->pluck('Key_name')
            ->unique()
            ->toArray();

        if (!in_array('payrolls_employee_id_payroll_month_index', $newIndexes)) {
            Schema::table('payrolls', function (Blueprint $table) {
                $table->index(['employee_id', 'payroll_month']);
            });
        }

        if (!in_array('payrolls_payment_status_index', $newIndexes)) {
            Schema::table('payrolls', function (Blueprint $table) {
                $table->index('payment_status');
            });
        }
    }
};
