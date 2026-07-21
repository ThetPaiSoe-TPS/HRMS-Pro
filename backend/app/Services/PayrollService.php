<?php

namespace App\Services\Payroll;

use App\Models\Employee;
use App\Models\EmployeeSalary;
use App\Models\Payroll;
use App\Models\PayrollItem;
use App\Models\PayrollSetting;
use Carbon\Carbon;

class PayrollCalculator
{
    protected $settings;
    protected $workingDays;
    protected $workingHours;
    protected $monthYear;

    public function __construct()
    {
        $this->settings = PayrollSetting::first();
        $this->workingDays = 26; // Default, should come from settings
        $this->workingHours = 8; // Default, should come from settings
    }

    public function calculate(Employee $employee, int $year, int $month): Payroll
    {
        $payrollMonth = Carbon::createFromDate($year, $month, 1)->startOfMonth();

        // Check if payroll already exists
        $payroll = Payroll::where('employee_id', $employee->id)
            ->whereYear('payroll_month', $year)
            ->whereMonth('payroll_month', $month)
            ->first();

        if (!$payroll) {
            $payroll = new Payroll();
            $payroll->employee_id = $employee->id;
            $payroll->payroll_month = $payrollMonth;
        }

        // 1. Get Basic Salary
        $basicSalary = $this->getBasicSalary($employee);
        $dailySalary = $basicSalary / $this->workingDays;
        $hourlySalary = $dailySalary / $this->workingHours;

        $payroll->basic_salary = $basicSalary;
        $payroll->daily_salary = $dailySalary;
        $payroll->hourly_salary = $hourlySalary;

        // 2. Get Attendance Summary
        $attendance = $this->getAttendanceSummary($employee, $year, $month);

        // 3. Get Approved Leaves
        $leaves = $this->getApprovedLeaves($employee, $year, $month);

        // 4. Get Approved Overtime
        $overtime = $this->getApprovedOvertime($employee, $year, $month);

        // 5. Calculate Overtime Pay
        $overtimePay = $this->calculateOvertimePay($overtime, $hourlySalary);
        $payroll->total_overtime = $overtimePay;

        // 6. Get Allowances
        $allowances = $this->getActiveAllowances($employee);
        $totalAllowances = $this->calculateAllowances($allowances);
        $payroll->total_allowances = $totalAllowances;

        // 7. Get Bonuses
        $bonuses = $this->getBonuses($employee, $year, $month);
        $totalBonuses = $this->calculateBonuses($bonuses);
        $payroll->total_bonus = $totalBonuses;

        // 8. Calculate Deductions
        $deductions = $this->calculateDeductions($employee, $attendance, $leaves, $basicSalary, $dailySalary);
        $payroll->late_deduction = $deductions['late'];
        $payroll->absent_deduction = $deductions['absent'];
        $payroll->unpaid_leave_deduction = $deductions['unpaid_leave'];
        $payroll->other_deductions = $deductions['other'];

        // 9. Calculate Loan Deduction
        $loanDeduction = $this->calculateLoanDeduction($employee);
        $payroll->loan_deduction = $loanDeduction;

        // 10. Calculate Advance Salary Deduction
        $advanceSalary = $this->calculateAdvanceSalary($employee);
        $payroll->advance_salary = $advanceSalary;

        // 11. Calculate Gross Salary
        $grossSalary = $basicSalary + $totalAllowances + $overtimePay + $totalBonuses;
        $payroll->gross_salary = $grossSalary;

        // 12. Calculate Tax
        $taxableIncome = $grossSalary - $deductions['total'] - $loanDeduction - $advanceSalary;
        $taxAmount = $this->calculateTax($taxableIncome);
        $payroll->tax_amount = $taxAmount;

        // 13. Calculate Total Deductions
        $totalDeductions = $deductions['total'] + $loanDeduction + $advanceSalary + $taxAmount;
        $payroll->total_deductions = $totalDeductions;

        // 14. Calculate Net Salary
        $netSalary = $grossSalary - $totalDeductions;
        $payroll->net_salary = max(0, $netSalary);

        // 15. Set status
        $payroll->status = 'calculated';

        // Save payroll
        $payroll->save();

        // 16. Save Payroll Items
        $this->savePayrollItems($payroll, $allowances, $bonuses, $deductions, $overtime);

        return $payroll;
    }

    protected function getBasicSalary(Employee $employee): float
    {
        $salary = EmployeeSalary::where('employee_id', $employee->id)
            ->where('is_active', true)
            ->first();

        return $salary ? (float) $salary->base_salary : 0;
    }

    protected function getAttendanceSummary(Employee $employee, int $year, int $month): array
    {
        // Implement attendance summary logic
        // This should fetch from your attendance module
        return [
            'working_days' => $this->workingDays,
            'present_days' => 0,
            'late_days' => 0,
            'absent_days' => 0,
            'paid_leave' => 0,
            'unpaid_leave' => 0,
            'holiday' => 0,
            'weekend' => 0,
        ];
    }

    protected function getApprovedLeaves(Employee $employee, int $year, int $month): array
    {
        // Implement approved leave logic
        // Only fetch leaves with status 'approved'
        return [];
    }

    protected function getApprovedOvertime(Employee $employee, int $year, int $month): array
    {
        // Implement approved overtime logic
        // Only fetch overtime with status 'approved'
        return [];
    }

    protected function calculateOvertimePay(array $overtime, float $hourlySalary): float
    {
        $total = 0;
        $settings = $this->settings;

        foreach ($overtime as $ot) {
            $rate = $hourlySalary;
            switch ($ot['type']) {
                case 'normal':
                    $rate *= $settings->overtime_rate_multiplier ?? 1.5;
                    break;
                case 'weekend':
                    $rate *= $settings->overtime_rate_multiplier ?? 2.0;
                    break;
                case 'holiday':
                    $rate *= $settings->holiday_rate_multiplier ?? 2.5;
                    break;
            }
            $total += $ot['hours'] * $rate;
        }

        return $total;
    }

    protected function getActiveAllowances(Employee $employee): array
    {
        // Implement active allowances logic
        // Fetch from your allowance module
        return [];
    }

    protected function calculateAllowances(array $allowances): float
    {
        return array_sum(array_column($allowances, 'amount'));
    }

    protected function getBonuses(Employee $employee, int $year, int $month): array
    {
        // Implement bonus logic
        return [];
    }

    protected function calculateBonuses(array $bonuses): float
    {
        return array_sum(array_column($bonuses, 'amount'));
    }

    protected function calculateDeductions(
        Employee $employee,
        array $attendance,
        array $leaves,
        float $basicSalary,
        float $dailySalary
    ): array {
        $lateDeduction = $attendance['late_days'] * ($dailySalary * 0.5); // Example: half day for late
        $absentDeduction = $attendance['absent_days'] * $dailySalary;
        $unpaidLeaveDeduction = $attendance['unpaid_leave'] * $dailySalary;

        // Other deductions from employee settings
        $otherDeductions = 0;

        return [
            'late' => $lateDeduction,
            'absent' => $absentDeduction,
            'unpaid_leave' => $unpaidLeaveDeduction,
            'other' => $otherDeductions,
            'total' => $lateDeduction + $absentDeduction + $unpaidLeaveDeduction + $otherDeductions,
        ];
    }

    protected function calculateLoanDeduction(Employee $employee): float
    {
        // Implement loan deduction logic
        return 0;
    }

    protected function calculateAdvanceSalary(Employee $employee): float
    {
        // Implement advance salary logic
        return 0;
    }

    protected function calculateTax(float $taxableIncome): float
    {
        // Implement tax calculation based on tax regime
        // Default tax rates for Myanmar
        $taxBrackets = [
            ['min' => 0, 'max' => 2000000, 'rate' => 0],
            ['min' => 2000000, 'max' => 5000000, 'rate' => 5],
            ['min' => 5000000, 'max' => 10000000, 'rate' => 10],
            ['min' => 10000000, 'max' => 20000000, 'rate' => 15],
            ['min' => 20000000, 'max' => 30000000, 'rate' => 20],
            ['min' => 30000000, 'max' => PHP_FLOAT_MAX, 'rate' => 25],
        ];

        $tax = 0;
        foreach ($taxBrackets as $bracket) {
            if ($taxableIncome > $bracket['min']) {
                $amountInBracket = min($taxableIncome, $bracket['max']) - $bracket['min'];
                $tax += $amountInBracket * ($bracket['rate'] / 100);
            }
        }

        return $tax;
    }

    protected function savePayrollItems(Payroll $payroll, array $allowances, array $bonuses, array $deductions, array $overtime): void
    {
        // Save allowances
        foreach ($allowances as $allowance) {
            PayrollItem::create([
                'payroll_id' => $payroll->id,
                'employee_id' => $payroll->employee_id,
                'item_type' => 'allowance',
                'category' => $allowance['category'] ?? 'other',
                'description' => $allowance['description'] ?? 'Allowance',
                'amount' => $allowance['amount'],
                'is_percentage' => false,
                'reference_id' => $allowance['id'] ?? null,
                'reference_type' => 'allowance',
            ]);
        }

        // Save bonuses
        foreach ($bonuses as $bonus) {
            PayrollItem::create([
                'payroll_id' => $payroll->id,
                'employee_id' => $payroll->employee_id,
                'item_type' => 'earning',
                'category' => 'bonus',
                'description' => $bonus['description'] ?? 'Bonus',
                'amount' => $bonus['amount'],
                'is_percentage' => false,
                'reference_id' => $bonus['id'] ?? null,
                'reference_type' => 'bonus',
            ]);
        }

        // Save overtime as earning
        if ($payroll->total_overtime > 0) {
            PayrollItem::create([
                'payroll_id' => $payroll->id,
                'employee_id' => $payroll->employee_id,
                'item_type' => 'earning',
                'category' => 'overtime',
                'description' => 'Overtime Pay',
                'amount' => $payroll->total_overtime,
                'is_percentage' => false,
            ]);
        }

        // Save deductions
        $deductionItems = [
            ['category' => 'late', 'amount' => $payroll->late_deduction, 'description' => 'Late Deduction'],
            ['category' => 'absent', 'amount' => $payroll->absent_deduction, 'description' => 'Absent Deduction'],
            ['category' => 'unpaid_leave', 'amount' => $payroll->unpaid_leave_deduction, 'description' => 'Unpaid Leave'],
            ['category' => 'other', 'amount' => $payroll->other_deductions, 'description' => 'Other Deductions'],
        ];

        foreach ($deductionItems as $item) {
            if ($item['amount'] > 0) {
                PayrollItem::create([
                    'payroll_id' => $payroll->id,
                    'employee_id' => $payroll->employee_id,
                    'item_type' => 'deduction',
                    'category' => $item['category'],
                    'description' => $item['description'],
                    'amount' => $item['amount'],
                    'is_percentage' => false,
                ]);
            }
        }

        // Save tax as deduction
        if ($payroll->tax_amount > 0) {
            PayrollItem::create([
                'payroll_id' => $payroll->id,
                'employee_id' => $payroll->employee_id,
                'item_type' => 'tax',
                'category' => 'tax',
                'description' => 'Income Tax',
                'amount' => $payroll->tax_amount,
                'is_percentage' => true,
                'percentage_value' => 5, // Example
            ]);
        }

        // Save loan deduction
        if ($payroll->loan_deduction > 0) {
            PayrollItem::create([
                'payroll_id' => $payroll->id,
                'employee_id' => $payroll->employee_id,
                'item_type' => 'loan',
                'category' => 'loan',
                'description' => 'Loan Installment',
                'amount' => $payroll->loan_deduction,
                'is_percentage' => false,
            ]);
        }
    }
}
