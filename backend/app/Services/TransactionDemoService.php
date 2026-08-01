<?php

namespace App\Services;

use App\Models\TransactionLog;
use App\Models\Employee;
use App\Models\Payroll;
use Illuminate\Support\Facades\DB;

class TransactionDemoService
{
    private const DEMO_EMPLOYEE_CODE = 'DEMO001';

    /**
     * Get (or create) the single persistent demo employee.
     * Uses a fixed employee_code so the same record is always returned.
     */
    private function getDemoEmployeeId(): int
    {
        $employee = Employee::where('employee_code', self::DEMO_EMPLOYEE_CODE)->first();
        if (!$employee) {
            $employee = Employee::create([
                'name'         => 'Demo Employee',
                'employee_code'=> self::DEMO_EMPLOYEE_CODE,
                'email'        => 'demo@company.com',
                'department_id'=> 1,
                'position_id'  => 1,
                'hire_date'    => now(),
                'status'       => 'active',
            ]);
        }
        return $employee->id;
    }

    /**
     * Get a truly unique day (1-31) within the current month for the demo employee.
     *
     * Queries only the demo employee's existing payrolls for the current month/year
     * so the returned day is guaranteed not to collide with that employee's
     * existing (employee_id, payroll_month) pair.
     */
    private function getUniqueMonth(int $employeeId): string
    {
        $year  = now()->year;
        $month = now()->month;

        $existingDays = DB::table('payrolls')
            ->where('employee_id', $employeeId)
            ->whereYear('payroll_month', $year)
            ->whereMonth('payroll_month', $month)
            ->pluck(DB::raw('DAY(payroll_month)'))
            ->toArray();

        $daysInMonth = (int) now()->setMonth($month)->setDay(1)->endOfMonth()->day;
        $day = 1;
        while (in_array($day, $existingDays, true) && $day <= $daysInMonth) {
            $day++;
        }

        if ($day > $daysInMonth) {
            $day = $daysInMonth;
        }

        return $year . '-' . str_pad((string) $month, 2, '0', STR_PAD_LEFT) . '-' . str_pad((string) $day, 2, '0', STR_PAD_LEFT);
    }

    /**
     * Force clean ALL demo data before running a demo.
     *
     * This is a more aggressive cleanup that should be called before
     * each demo execution to guarantee a clean state. It removes:
     *  1. All payroll_items for demo employees.
     *  2. All payrolls for demo employees.
     *  3. All transaction logs related to demo runs.
     *
     * Returns the number of payrolls deleted.
     */
    public function forceCleanDemoData(): int
    {
        $demoEmployeeIds = Employee::where('employee_code', 'like', 'DEMO%')
            ->orWhere('name', 'like', '%Demo%')
            ->orWhere('email', 'like', '%demo%')
            ->pluck('id')
            ->all();

        if (empty($demoEmployeeIds)) {
            return 0;
        }

        $payrollIds = DB::table('payrolls')
            ->whereIn('employee_id', $demoEmployeeIds)
            ->pluck('id')
            ->toArray();

        if (!empty($payrollIds)) {
            DB::table('payroll_items')->whereIn('payroll_id', $payrollIds)->delete();
            DB::table('payrolls')->whereIn('id', $payrollIds)->delete();
        }

        TransactionLog::where('transaction_name', 'like', 'payroll_generation%')->delete();

        return count($payrollIds);
    }

    /**
     * Demo: Successful Transaction (WITH Transaction)
     */
    public function successfulTransaction(): array
    {
        $startTime = microtime(true);
        $operations = [];

        $validEmployeeId = $this->getDemoEmployeeId();
        $this->forceCleanDemoData();
        $uniqueMonth = $this->getUniqueMonth($validEmployeeId);

        DB::beginTransaction();

        try {
            $operations[] = ['query' => 'INSERT INTO payrolls', 'status' => 'running'];
            $payroll = Payroll::create([
                'employee_id'    => $validEmployeeId,
                'payroll_month'  => $uniqueMonth,
                'basic_salary'   => 50000,
                'net_salary'     => 45000,
                'created_by'     => auth()->id(),
            ]);
            $operations[] = ['query' => 'INSERT INTO payrolls', 'status' => 'success', 'id' => $payroll->id];

            $operations[] = ['query' => 'INSERT INTO payroll_items', 'status' => 'running'];
            DB::table('payroll_items')->insert([
                'payroll_id'    => $payroll->id,
                'employee_id'   => $validEmployeeId,
                'item_type'     => 'allowance',
                'category'      => 'housing',
                'description'   => 'Housing Allowance',
                'amount'        => 5000,
                'created_at'    => now(),
                'updated_at'    => now(),
            ]);
            $operations[] = ['query' => 'INSERT INTO payroll_items', 'status' => 'success'];

            $operations[] = ['query' => 'UPDATE employees', 'status' => 'running'];
            Employee::where('id', $validEmployeeId)->update(['updated_at' => now()]);
            $operations[] = ['query' => 'UPDATE employees', 'status' => 'success'];

            DB::commit();
            $executionTime = microtime(true) - $startTime;

            $this->logTransaction('payroll_generation_success', 'success', $operations, null, $executionTime);

            return [
                'success'         => true,
                'message'         => '✅ Transaction completed successfully',
                'operations'      => $operations,
                'execution_time'  => round($executionTime * 1000, 2) . 'ms',
                'is_transactional'=> true,
                'employee_id_used'=> $validEmployeeId,
                'month_used'      => $uniqueMonth,
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            $executionTime = microtime(true) - $startTime;

            $this->logTransaction('payroll_generation_success', 'failed', $operations, $e->getMessage(), $executionTime);

            return [
                'success'         => false,
                'message'         => '❌ Transaction failed: ' . $e->getMessage(),
                'operations'      => $operations,
                'execution_time'  => round($executionTime * 1000, 2) . 'ms',
                'is_transactional'=> true,
                'employee_id_used'=> $validEmployeeId,
                'month_used'      => $uniqueMonth,
            ];
        }
    }

    /**
     * Demo: Failed Transaction (WITH Transaction - Rolls Back)
     */
    public function failedTransaction(): array
    {
        $startTime = microtime(true);
        $operations = [];

        $validEmployeeId = $this->getDemoEmployeeId();
        $this->forceCleanDemoData();
        $uniqueMonth = $this->getUniqueMonth($validEmployeeId);

        DB::beginTransaction();

        try {
            $operations[] = ['query' => 'INSERT INTO payrolls', 'status' => 'running'];
            $payroll = Payroll::create([
                'employee_id'    => $validEmployeeId,
                'payroll_month'  => $uniqueMonth,
                'basic_salary'   => 50000,
                'net_salary'     => 45000,
                'created_by'     => auth()->id(),
            ]);
            $operations[] = ['query' => 'INSERT INTO payrolls', 'status' => 'success', 'id' => $payroll->id];

            $operations[] = ['query' => 'INSERT INTO payrolls (DUPLICATE - should fail)', 'status' => 'running'];
            Payroll::create([
                'employee_id'    => $validEmployeeId,
                'payroll_month'  => $uniqueMonth,
                'basic_salary'   => 50000,
                'net_salary'     => 45000,
                'created_by'     => auth()->id(),
            ]);
            $operations[] = ['query' => 'INSERT INTO payrolls', 'status' => 'failed'];

            DB::commit();

            return [
                'success'         => true,
                'message'         => 'Should not reach here',
                'operations'      => $operations,
                'is_transactional'=> true,
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            $executionTime = microtime(true) - $startTime;

            $operations[] = ['query' => '🔄 ROLLBACK executed',          'status' => 'rolled_back'];
            $operations[] = ['query' => '✅ ALL operations undone',       'status' => 'rolled_back'];

            $this->logTransaction('payroll_generation_failed', 'rolled_back', $operations, $e->getMessage(), $executionTime);

            return [
                'success'          => false,
                'message'          => '✅ Transaction rolled back! No data was saved.',
                'operations'       => $operations,
                'execution_time'   => round($executionTime * 1000, 2) . 'ms',
                'is_transactional' => true,
                'error'            => 'Duplicate payroll entry for the same employee and month — all operations were rolled back.',
                'valid_employee_id'=> $validEmployeeId,
                'month_used'       => $uniqueMonth,
            ];
        }
    }

    /**
     * Demo: Without Transaction (Data Inconsistency Demo)
     */
    public function withoutTransaction(): array
    {
        $startTime = microtime(true);
        $operations = [];

        $validEmployeeId = $this->getDemoEmployeeId();
        $this->forceCleanDemoData();
        $uniqueMonth = $this->getUniqueMonth($validEmployeeId);

        try {
            $operations[] = ['query' => 'INSERT INTO payrolls (NO TRANSACTION)', 'status' => 'running'];
            $payroll = Payroll::create([
                'employee_id'    => $validEmployeeId,
                'payroll_month'  => $uniqueMonth,
                'basic_salary'   => 50000,
                'net_salary'     => 45000,
                'created_by'     => auth()->id(),
            ]);
            $operations[] = ['query' => 'INSERT INTO payrolls', 'status' => 'success', 'id' => $payroll->id];

            $operations[] = ['query' => 'INSERT INTO payrolls (DUPLICATE - should fail)', 'status' => 'running'];
            Payroll::create([
                'employee_id'    => $validEmployeeId,
                'payroll_month'  => $uniqueMonth,
                'basic_salary'   => 50000,
                'net_salary'     => 45000,
                'created_by'     => auth()->id(),
            ]);
            $operations[] = ['query' => 'INSERT INTO payrolls', 'status' => 'failed'];

            return [
                'success'         => true,
                'message'         => 'Should not reach here',
                'operations'      => $operations,
                'is_transactional'=> false,
            ];

        } catch (\Exception $e) {
            $executionTime = microtime(true) - $startTime;

            $operations[] = ['query' => '❌ Partial data in database!',             'status' => 'inconsistent'];
            $operations[] = ['query' => '⚠️ First payroll saved but duplicate failed!','status' => 'inconsistent'];

            $this->logTransaction('payroll_generation_no_transaction', 'inconsistent', $operations, $e->getMessage(), $executionTime);

            return [
                'success'          => false,
                'message'          => '⚠️ Partial failure! First payroll was saved but the duplicate insert failed.',
                'operations'       => $operations,
                'execution_time'   => round($executionTime * 1000, 2) . 'ms',
                'is_transactional' => false,
                'warning'          => '⚠️ Data inconsistency detected! First payroll record committed without the second being rolled back.',
                'error'            => 'Duplicate payroll entry for the same employee and month — first payroll was committed but the second was not.',
                'valid_employee_id'=> $validEmployeeId,
                'month_used'       => $uniqueMonth,
            ];
        }
    }

    /**
     * Demo: With Transaction (Handles Failure Gracefully)
     */
    public function withTransaction(): array
    {
        $startTime = microtime(true);
        $operations = [];

        $validEmployeeId = $this->getDemoEmployeeId();
        $this->forceCleanDemoData();
        $uniqueMonth = $this->getUniqueMonth($validEmployeeId);

        DB::beginTransaction();

        try {
            $operations[] = ['query' => 'INSERT INTO payrolls (WITH TRANSACTION)', 'status' => 'running'];
            $payroll = Payroll::create([
                'employee_id'    => $validEmployeeId,
                'payroll_month'  => $uniqueMonth,
                'basic_salary'   => 50000,
                'net_salary'     => 45000,
                'created_by'     => auth()->id(),
            ]);
            $operations[] = ['query' => 'INSERT INTO payrolls', 'status' => 'success', 'id' => $payroll->id];

            $operations[] = ['query' => 'INSERT INTO payrolls (DUPLICATE - should fail)', 'status' => 'running'];
            Payroll::create([
                'employee_id'    => $validEmployeeId,
                'payroll_month'  => $uniqueMonth,
                'basic_salary'   => 50000,
                'net_salary'     => 45000,
                'created_by'     => auth()->id(),
            ]);
            $operations[] = ['query' => 'INSERT INTO payrolls', 'status' => 'failed'];

            DB::commit();

            return [
                'success'         => true,
                'message'         => 'Should not reach here',
                'operations'      => $operations,
                'is_transactional'=> true,
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            $executionTime = microtime(true) - $startTime;

            $operations[] = ['query' => '🔄 ROLLBACK executed',           'status' => 'rolled_back'];
            $operations[] = ['query' => '✅ ALL operations undone',        'status' => 'rolled_back'];
            $operations[] = ['query' => '🔍 No data saved - database clean','status' => 'rolled_back'];

            $this->logTransaction('payroll_generation_with_transaction', 'rolled_back', $operations, $e->getMessage(), $executionTime);

            return [
                'success'           => false,
                'message'           => '✅ Transaction rolled back! No data was saved.',
                'operations'        => $operations,
                'execution_time'    => round($executionTime * 1000, 2) . 'ms',
                'is_transactional'  => true,
                'error'             => 'Duplicate payroll entry for the same employee and month — all operations were rolled back.',
                'valid_employee_id' => $validEmployeeId,
                'month_used'        => $uniqueMonth,
            ];
        }
    }

    /**
     * Get transaction history
     */
    public function getTransactionHistory(): array
    {
        $logs = TransactionLog::orderBy('created_at', 'desc')
            ->limit(50)
            ->get()
            ->map(function ($log) {
                return [
                    'id'              => $log->id,
                    'name'            => $log->transaction_name,
                    'status'          => $log->status,
                    'operations'      => $log->operations,
                    'error_message'   => $log->error_message,
                    'execution_time'  => round($log->execution_time, 2) . 'ms',
                    'is_transactional'=> $log->is_transactional,
                    'created_at'      => $log->created_at->diffForHumans(),
                ];
            });

        $stats = [
            'total'       => TransactionLog::count(),
            'success'     => TransactionLog::where('status', 'success')->count(),
            'failed'      => TransactionLog::where('status', 'failed')->count(),
            'rolled_back' => TransactionLog::where('status', 'rolled_back')->count(),
            'inconsistent'=> TransactionLog::where('status', 'inconsistent')->count(),
        ];

        return [
            'logs'  => $logs,
            'stats' => $stats,
        ];
    }

    private function logTransaction(string $name, string $status, array $operations, ?string $error, float $time): void
    {
        try {
            TransactionLog::create([
                'transaction_name' => $name,
                'status'           => $status,
                'operations'       => $operations,
                'error_message'    => $error,
                'execution_time'   => $time,
                'is_transactional' => true,
                'user_id'          => auth()->id(),
            ]);
        } catch (\Exception $e) {
            // Silently fail
        }
    }
}
