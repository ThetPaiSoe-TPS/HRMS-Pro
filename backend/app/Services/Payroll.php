<?php

namespace App\Services\Payroll;

use App\Models\Employee;
use App\Models\Payroll;
use App\Models\PayrollSetting;
use App\Services\Payroll\PayrollCalculator;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PayrollService
{
    protected $calculator;

    public function __construct(PayrollCalculator $calculator)
    {
        $this->calculator = $calculator;
    }

    /**
     * Generate payroll for employees
     */
    public function generatePayroll(array $employeeIds, int $year, int $month, int $createdBy): array
    {
        $employees = Employee::whereIn('id', $employeeIds)->get();
        $generated = [];

        foreach ($employees as $employee) {
            try {
                DB::beginTransaction();

                // Check if payroll already exists
                $exists = Payroll::where('employee_id', $employee->id)
                    ->whereYear('payroll_month', $year)
                    ->whereMonth('payroll_month', $month)
                    ->exists();

                if ($exists) {
                    DB::rollBack();
                    continue;
                }

                // Calculate payroll
                $payroll = $this->calculator->calculate($employee, $year, $month);
                $payroll->created_by = $createdBy;
                $payroll->status = 'draft';
                $payroll->save();

                $generated[] = $payroll->load('employee:id,name,employee_code');

                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
                Log::error("Payroll generation failed for employee {$employee->id}: " . $e->getMessage());
                throw $e;
            }
        }

        return $generated;
    }

    /**
     * Calculate a single payroll (update from draft)
     */
    public function calculatePayroll(Payroll $payroll): Payroll
    {
        if (!$payroll->canBeEdited()) {
            throw new \Exception('Payroll cannot be edited in current status.');
        }

        $employee = $payroll->employee;
        $year = $payroll->payroll_month->year;
        $month = $payroll->payroll_month->month;

        return $this->calculator->calculate($employee, $year, $month);
    }

    /**
     * Submit payroll for approval
     */
    public function submitForApproval(Payroll $payroll): Payroll
    {
        if ($payroll->status !== 'calculated') {
            throw new \Exception('Payroll must be calculated before approval.');
        }

        $payroll->status = 'pending_approval';
        $payroll->save();

        return $payroll;
    }

    /**
     * Approve payroll
     */
    public function approvePayroll(Payroll $payroll, int $approvedBy): Payroll
    {
        if (!$payroll->canBeApproved()) {
            throw new \Exception('Only pending approval payrolls can be approved.');
        }

        $payroll->status = 'approved';
        $payroll->approved_by = $approvedBy;
        $payroll->approved_at = now();
        $payroll->save();

        return $payroll;
    }

    /**
     * Mark payroll as paid
     */
    public function markAsPaid(Payroll $payroll, array $paymentData, int $paidBy): Payroll
    {
        if (!$payroll->canBePaid()) {
            throw new \Exception('Only approved payrolls can be marked as paid.');
        }

        $payroll->status = 'paid';
        $payroll->payment_date = $paymentData['payment_date'] ?? now()->toDateString();
        $payroll->payment_method = $paymentData['payment_method'] ?? 'bank_transfer';
        $payroll->bank_name = $paymentData['bank_name'] ?? null;
        $payroll->bank_account = $paymentData['bank_account'] ?? null;
        $payroll->transaction_number = $paymentData['transaction_number'] ?? null;
        $payroll->paid_by = $paidBy;
        $payroll->paid_at = now();
        $payroll->save();

        return $payroll;
    }

    /**
     * Cancel payroll
     */
    public function cancelPayroll(Payroll $payroll, string $reason = null): Payroll
    {
        if (!$payroll->canBeCancelled()) {
            throw new \Exception('Paid payrolls cannot be cancelled.');
        }

        $payroll->status = 'cancelled';
        $payroll->general_notes = ($payroll->general_notes ? $payroll->general_notes . "\n" : '') 
            . "Cancelled: " . ($reason ?? 'No reason provided');
        $payroll->save();

        return $payroll;
    }

    /**
     * Get payroll summary for dashboard
     */
    public function getDashboardSummary(int $year, int $month): array
    {
        $monthStart = Carbon::createFromDate($year, $month, 1)->startOfMonth();
        $monthEnd = Carbon::createFromDate($year, $month, 1)->endOfMonth();

        $payrolls = Payroll::whereBetween('payroll_month', [$monthStart, $monthEnd]);

        return [
            'total_generated' => (clone $payrolls)->count(),
            'pending_approval' => (clone $payrolls)->where('status', 'pending_approval')->count(),
            'approved' => (clone $payrolls)->where('status', 'approved')->count(),
            'paid' => (clone $payrolls)->where('status', 'paid')->count(),
            'total_payroll_cost' => (clone $payrolls)->sum('net_salary'),
            'average_salary' => (clone $payrolls)->avg('net_salary') ?? 0,
        ];
    }
}