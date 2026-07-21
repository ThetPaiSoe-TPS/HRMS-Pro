<?php

namespace App\Services\Payroll;

use App\Models\Employee;
use App\Models\Payroll;
use App\Models\PayrollItem;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PayrollService
{
    public function generatePayroll(array $employeeIds, int $year, int $month, ?int $createdBy): array
    {
        $generated = [];
        $payrollMonth = Carbon::createFromDate($year, $month, 1)->startOfMonth();

        foreach ($employeeIds as $employeeId) {
            $exists = Payroll::where("employee_id", $employeeId)
                ->whereYear("payroll_month", $year)
                ->whereMonth("payroll_month", $month)
                ->exists();

            if ($exists) {
                continue;
            }

            $employee = Employee::find($employeeId);
            if (!$employee) {
                continue;
            }

            $payroll = Payroll::create([
                "employee_id" => $employeeId,
                "payroll_month" => $payrollMonth,
                "basic_salary" => $employee->basic_salary ?? 0,
                "status" => "draft",
                "created_by" => $createdBy,
            ]);

            $generated[] = $payroll;
        }

        return $generated;
    }

    public function calculatePayroll(Payroll $payroll): Payroll
    {
        $employee = $payroll->employee;
        if (!$employee) {
            throw new \RuntimeException("Employee not found for payroll ID: {$payroll->id}");
        }

        $basicSalary = $payroll->basic_salary;
        $workingDays = $this->getWorkingDays($payroll->payroll_month);
        $dailySalary = $workingDays > 0 ? round($basicSalary / $workingDays, 2) : 0;
        $hourlySalary = $dailySalary > 0 ? round($dailySalary / 8, 2) : 0;

        $totalAllowances = $this->calculateAllowances($employee, $payroll->payroll_month);
        $totalOvertime = $this->calculateOvertime($employee, $payroll->payroll_month);
        $totalBonus = $this->calculateBonuses($employee, $payroll->payroll_month);
        $grossSalary = $basicSalary + $totalAllowances + $totalOvertime + $totalBonus;

        $lateDeduction = $this->calculateLateDeductions($employee, $payroll->payroll_month);
        $absentDeduction = $this->calculateAbsentDeductions($employee, $payroll->payroll_month);
        $unpaidLeaveDeduction = $this->calculateUnpaidLeaveDeductions($employee, $payroll->payroll_month);
        $loanDeduction = $this->calculateLoanDeductions($employee, $payroll->payroll_month);
        $advanceSalary = $this->calculateAdvanceSalary($employee, $payroll->payroll_month);
        $taxAmount = $this->calculateTax($grossSalary, $employee);
        $otherDeductions = $this->calculateOtherDeductions($employee, $payroll->payroll_month);
        $totalDeductions = $lateDeduction + $absentDeduction + $unpaidLeaveDeduction
            + $loanDeduction + $advanceSalary + $taxAmount + $otherDeductions;

        $netSalary = max(0, $grossSalary - $totalDeductions);

        $payroll->update([
            "daily_salary" => $dailySalary,
            "hourly_salary" => $hourlySalary,
            "total_allowances" => $totalAllowances,
            "total_overtime" => $totalOvertime,
            "total_bonus" => $totalBonus,
            "gross_salary" => $grossSalary,
            "total_deductions" => $totalDeductions,
            "tax_amount" => $taxAmount,
            "loan_deduction" => $loanDeduction,
            "advance_salary" => $advanceSalary,
            "late_deduction" => $lateDeduction,
            "absent_deduction" => $absentDeduction,
            "unpaid_leave_deduction" => $unpaidLeaveDeduction,
            "other_deductions" => $otherDeductions,
            "net_salary" => $netSalary,
            "status" => "calculated",
        ]);

        return $payroll->fresh();
    }

    public function submitForApproval(Payroll $payroll): Payroll
    {
        if (!$payroll->canBeEdited()) {
            throw new \RuntimeException("Payroll cannot be submitted for approval in current status.");
        }
        $payroll->update(["status" => "pending_approval"]);
        return $payroll->fresh();
    }

    public function approvePayroll(Payroll $payroll, ?int $userId): Payroll
    {
        if (!$payroll->canBeApproved()) {
            throw new \RuntimeException("Payroll cannot be approved in current status.");
        }
        $payroll->update([
            "status" => "approved",
            "approved_by" => $userId,
            "approved_at" => now(),
        ]);
        return $payroll->fresh();
    }

    public function markAsPaid(Payroll $payroll, array $paymentData, ?int $userId): Payroll
    {
        if (!$payroll->canBePaid()) {
            throw new \RuntimeException("Payroll cannot be marked as paid in current status.");
        }
        $data = array_merge($paymentData, [
            "status" => "paid",
            "paid_by" => $userId,
            "paid_at" => now(),
            "payment_date" => $paymentData["payment_date"] ?? now()->toDateString(),
        ]);
        $payroll->update($data);
        return $payroll->fresh();
    }

    public function cancelPayroll(Payroll $payroll, ?string $reason): Payroll
    {
        if (!$payroll->canBeCancelled()) {
            throw new \RuntimeException("Payroll cannot be cancelled in current status.");
        }
        $payroll->update([
            "status" => "cancelled",
            "general_notes" => $reason ? trim($payroll->general_notes . "\nCancellation: " . $reason) : $payroll->general_notes,
        ]);
        return $payroll->fresh();
    }

    public function getDashboardSummary(int $year, int $month): array
    {
        $payrolls = Payroll::whereYear("payroll_month", $year)
            ->whereMonth("payroll_month", $month);

        return [
            "total_employees" => $payrolls->count(),
            "total_gross_salary" => (float) $payrolls->sum("gross_salary"),
            "total_deductions" => (float) $payrolls->sum("total_deductions"),
            "total_net_salary" => (float) $payrolls->sum("net_salary"),
            "paid_count" => (float) $payrolls->where("status", "paid")->count(),
            "pending_count" => (float) $payrolls->whereIn("status", ["draft", "calculated", "pending_approval", "approved"])->count(),
        ];
    }

    private function getWorkingDays(Carbon $date): int
    {
        $start = $date->copy()->startOfMonth();
        $end = $date->copy()->endOfMonth();
        $workingDays = 0;
        while ($start->lte($end)) {
            if ($start->isWeekday()) {
                $workingDays++;
            }
            $start->addDay();
        }
        return $workingDays;
    }

    private function calculateAllowances(Employee $employee, Carbon $month): float
    {
        return (float) ($employee->total_allowances ?? 0);
    }

    private function calculateOvertime(Employee $employee, Carbon $month): float
    {
        return (float) PayrollItem::where("employee_id", $employee->id)
            ->where("item_type", "earning")
            ->where("category", 'overtime')
            ->sum("amount");
    }

    private function calculateBonuses(Employee $employee, Carbon $month): float
    {
        return (float) PayrollItem::where("employee_id", $employee->id)
            ->where('item_type', 'earning')
            ->where('category', 'bonus')
            ->sum('amount');
    }

    private function calculateLateDeductions(Employee $employee, Carbon $month): float
    {
        return (float) PayrollItem::where("employee_id", $employee->id)
            ->where('item_type', 'deduction')
            ->where('category', 'late')
            ->sum('amount');
    }

    private function calculateAbsentDeductions(Employee $employee, Carbon $month): float
    {
        return (float) PayrollItem::where("employee_id", $employee->id)
            ->where('item_type', 'deduction')
            ->where('category', 'absent')
            ->sum('amount');
    }

    private function calculateUnpaidLeaveDeductions(Employee $employee, Carbon $month): float
    {
        return (float) PayrollItem::where("employee_id", $employee->id)
            ->where('item_type', 'deduction')
            ->where('category', 'unpaid_leave')
            ->sum('amount');
    }

    private function calculateLoanDeductions(Employee $employee, Carbon $month): float
    {
        return (float) PayrollItem::where("employee_id", $employee->id)
            ->where('item_type', 'loan')
            ->sum('amount');
    }

    private function calculateAdvanceSalary(Employee $employee, Carbon $month): float
    {
        return (float) PayrollItem::where("employee_id", $employee->id)
            ->where('item_type', 'deduction')
            ->where('category', 'advance_salary')
            ->sum('amount');
    }

    private function calculateTax(float $grossSalary, Employee $employee): float
    {
        if ($grossSalary <= 0) {
            return 0;
        }

        $annualTaxable = $grossSalary * 12;
        $tax = 0;

        if ($annualTaxable > 20000000) {
            $tax += ($annualTaxable - 20000000) * 0.25;
            $annualTaxable = 20000000;
        }
        if ($annualTaxable > 10000000) {
            $tax += ($annualTaxable - 10000000) * 0.20;
            $annualTaxable = 10000000;
        }
        if ($annualTaxable > 5000000) {
            $tax += ($annualTaxable - 5000000) * 0.15;
            $annualTaxable = 5000000;
        }
        return round($tax / 12, 2);
    }

    private function calculateOtherDeductions(Employee $employee, Carbon $month): float
    {
        return (float) PayrollItem::where("employee_id", $employee->id)
            ->where('item_type', 'deduction')
            ->where('category', 'other')
            ->sum('amount');
    }
}
