<?php

namespace App\Http\Controllers\Api\Payroll;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\EmployeeSalary;
use App\Models\Payroll;
use App\Models\PayrollItem;
use App\Models\PayrollSetting;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PayrollController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request)
    {
        $query = Payroll::with('employee:id,name,employee_code');

        if ($request->filled('employee_id')) {
            $query->where('employee_id', $request->employee_id);
        }

        if ($request->filled('month')) {
            $query->whereMonth('payroll_month', $request->month);
        }

        if ($request->filled('year')) {
            $query->whereYear('payroll_month', $request->year);
        }

        if ($request->filled('status')) {
            $query->where('payment_status', $request->status);
        }

        $perPage = $request->integer('per_page', 10);
        $payrolls = $query->orderBy('payroll_month', 'desc')->paginate($perPage);

        return $this->success($payrolls, 'Payrolls retrieved successfully.');
    }

    public function show(string $id)
    {
        $payroll = Payroll::with([
            'employee:id,name,employee_code,department_id,position_id',
            'employee.department:id,name',
            'employee.position:id,title',
            'items',
            'creator:id,name',
            'approver:id,name',
        ])->find($id);

        if (!$payroll) {
            return $this->notFound('Payroll not found.');
        }

        return $this->success($payroll, 'Payroll retrieved successfully.');
    }

    public function generate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'month' => ['required', 'integer', 'between:1,12'],
            'year' => ['required', 'integer', 'min:2000'],
            'employee_ids' => ['nullable', 'array'],
            'employee_ids.*' => ['exists:employees,id'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $month = $request->integer('month');
        $year = $request->integer('year');
        $payrollMonth = now()->setYear($year)->setMonth($month)->startOfMonth();

        $employees = Employee::query();
        if ($request->filled('employee_ids')) {
            $employees->whereIn('id', $request->employee_ids);
        }
        $employees = $employees->get();

        if ($employees->isEmpty()) {
            return $this->error('No employees found to generate payroll.');
        }

        $settings = PayrollSetting::first();
        $generated = [];

        DB::beginTransaction();
        try {
            foreach ($employees as $employee) {
                $exists = Payroll::where('employee_id', $employee->id)
                    ->whereYear('payroll_month', $year)
                    ->whereMonth('payroll_month', $month)
                    ->exists();

                if ($exists) {
                    continue;
                }

                $salary = EmployeeSalary::where('employee_id', $employee->id)
                    ->where('is_active', true)
                    ->first();

                $basicSalary = $salary ? $salary->base_salary : 0;
                $hourlyRate = $salary ? $salary->hourly_rate : ($basicSalary / (22 * 8));

                $workDays = 22;
                $overtimeHours = 0;
                $overtimeAmount = 0;
                $presentDays = $workDays;
                $absentDays = 0;
                $leaveDays = 0;

                $totalAllowances = 0;
                $allowances = [];
                if ($salary && $salary->allowances) {
                    $allowances = $salary->allowances;
                    $totalAllowances = collect((array)$salary->allowances)->sum();
                } elseif ($settings && $settings->default_allowances) {
                    $allowances = $settings->default_allowances;
                    $totalAllowances = collect((array)$settings->default_allowances)->sum();
                }

                $totalDeductions = 0;
                $deductions = [];
                if ($salary && $salary->deductions) {
                    $deductions = $salary->deductions;
                    $totalDeductions = collect((array)$salary->deductions)->sum();
                } elseif ($settings && $settings->default_deductions) {
                    $deductions = $settings->default_deductions;
                    $totalDeductions = collect((array)$settings->default_deductions)->sum();
                }

                $tax = $this->calculateTax(($basicSalary + $totalAllowances) * 12);
                $monthlyTax = round($tax / 12, 2);
                $totalDeductions += $monthlyTax;

                $grossSalary = $basicSalary + $totalAllowances + $overtimeAmount;
                $netSalary = $grossSalary - $totalDeductions;

                $payroll = Payroll::create([
                    'employee_id' => $employee->id,
                    'payroll_month' => $payrollMonth,
                    'basic_salary' => $basicSalary,
                    'hourly_rate' => $hourlyRate,
                    'total_work_days' => $workDays,
                    'present_days' => $presentDays,
                    'absent_days' => $absentDays,
                    'leave_days' => $leaveDays,
                    'overtime_hours' => $overtimeHours,
                    'overtime_rate' => $settings ? $settings->overtime_rate_multiplier : 1.5,
                    'overtime_amount' => $overtimeAmount,
                    'allowances' => $allowances ?: null,
                    'total_allowances' => $totalAllowances,
                    'deductions' => $deductions ?: null,
                    'total_deductions' => $totalDeductions,
                    'gross_salary' => $grossSalary,
                    'net_salary' => $netSalary,
                    'payment_status' => 'pending',
                    'created_by' => $request->user()?->id,
                ]);

                if ($monthlyTax > 0) {
                    PayrollItem::create([
                        'payroll_id' => $payroll->id,
                        'employee_id' => $employee->id,
                        'item_type' => 'tax',
                        'category' => 'income_tax',
                        'description' => 'Monthly Income Tax',
                        'amount' => $monthlyTax,
                        'is_percentage' => false,
                    ]);
                }

                $generated[] = $payroll->load('employee:id,name,employee_code');
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Failed to generate payroll: ' . $e->getMessage());
        }

        return $this->created($generated, 'Payroll generated successfully.');
    }

    public function update(Request $request, string $id)
    {
        $payroll = Payroll::find($id);

        if (!$payroll) {
            return $this->notFound('Payroll not found.');
        }

        $validator = Validator::make($request->all(), [
            'allowances' => ['nullable', 'array'],
            'allowances.*' => ['numeric', 'min:0'],
            'deductions' => ['nullable', 'array'],
            'deductions.*' => ['numeric', 'min:0'],
            'overtime_hours' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $data = $validator->validated();

        if (isset($data['allowances'])) {
            $data['total_allowances'] = collect($data['allowances'])->sum();
        }

        if (isset($data['deductions'])) {
            $data['total_deductions'] = collect($data['deductions'])->sum();
        }

        if (isset($data['overtime_hours'])) {
            $hourlyRate = $payroll->hourly_rate ?: ($payroll->basic_salary / (22 * 8));
            $multiplier = $payroll->overtime_rate ?: 1.5;
            $data['overtime_amount'] = $data['overtime_hours'] * $hourlyRate * $multiplier;
        }

        $payroll->fill($data);
        $payroll->gross_salary = $payroll->basic_salary + ($payroll->total_allowables ?? $payroll->total_allowances) + $payroll->overtime_amount;
        $payroll->net_salary = $payroll->gross_salary - $payroll->total_deductions;
        $payroll->save();

        return $this->success($payroll->fresh()->load('employee:id,name,employee_code'), 'Payroll updated successfully.');
    }

    public function approve(string $id)
    {
        $payroll = Payroll::find($id);

        if (!$payroll) {
            return $this->notFound('Payroll not found.');
        }

        if ($payroll->payment_status !== 'pending') {
            return $this->error('Only pending payrolls can be approved.');
        }

        $payroll->update([
            'payment_status' => 'processing',
            'approved_by' => request()->user()?->id,
            'approved_at' => now(),
        ]);

        return $this->success($payroll->load('employee:id,name,employee_code'), 'Payroll approved successfully.');
    }

    public function pay(Request $request, string $id)
    {
        $payroll = Payroll::find($id);

        if (!$payroll) {
            return $this->notFound('Payroll not found.');
        }

        if ($payroll->payment_status !== 'processing') {
            return $this->error('Only approved payrolls can be processed for payment.');
        }

        $validator = Validator::make($request->all(), [
            'payment_method' => ['nullable', 'string', 'in:bank_transfer,cash,check'],
            'bank_name' => ['nullable', 'string', 'max:100'],
            'bank_account' => ['nullable', 'string', 'max:50'],
            'payment_date' => ['nullable', 'date'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $payroll->update(array_merge($validator->validated(), [
            'payment_status' => 'paid',
            'payment_date' => $request->payment_date ?? now()->toDateString(),
        ]));

        return $this->success($payroll->load('employee:id,name,employee_code'), 'Payment processed successfully.');
    }

    public function markPaid(string $id)
    {
        $payroll = Payroll::find($id);

        if (!$payroll) {
            return $this->notFound('Payroll not found.');
        }

        $payroll->update([
            'payment_status' => 'paid',
            'payment_date' => now()->toDateString(),
        ]);

        return $this->success($payroll->load('employee:id,name,employee_code'), 'Payroll marked as paid successfully.');
    }

    public function download(string $id)
    {
        $payroll = Payroll::with([
            'employee:id,name,employee_code,department_id,position_id',
            'employee.department:id,name',
            'employee.position:id,title',
            'items',
        ])->find($id);

        if (!$payroll) {
            return $this->notFound('Payroll not found.');
        }

        return $this->success([
            'payroll' => $payroll,
            'payslip' => $this->formatPayslip($payroll),
        ], 'Payslip retrieved successfully.');
    }

    public function employeeSalary(Request $request, string $employeeId)
    {
        $salary = EmployeeSalary::where('employee_id', $employeeId)
            ->where('is_active', true)
            ->first();

        if (!$salary) {
            return $this->notFound('Salary record not found for this employee.');
        }

        return $this->success($salary, 'Employee salary retrieved successfully.');
    }

    public function updateEmployeeSalary(Request $request, string $employeeId)
    {
        $validator = Validator::make($request->all(), [
            'base_salary' => ['required', 'numeric', 'min:0'],
            'allowances' => ['nullable', 'array'],
            'allowances.*' => ['numeric', 'min:0'],
            'deductions' => ['nullable', 'array'],
            'deductions.*' => ['numeric', 'min:0'],
            'bank_name' => ['nullable', 'string', 'max:100'],
            'bank_account' => ['nullable', 'string', 'max:50'],
            'effective_date' => ['nullable', 'date'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $data = $validator->validated();
        $data['employee_id'] = $employeeId;
        $data['monthly_rate'] = $data['base_salary'];
        $data['effective_date'] = $data['effective_date'] ?? now()->toDateString();

        EmployeeSalary::where('employee_id', $employeeId)->update(['is_active' => false]);

        $salary = EmployeeSalary::create($data);

        return $this->success($salary, 'Employee salary updated successfully.');
    }

    public function settings()
    {
        $settings = PayrollSetting::first();

        if (!$settings) {
            return $this->notFound('Payroll settings not found.');
        }

        return $this->success($settings, 'Payroll settings retrieved successfully.');
    }

    public function updateSettings(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'payroll_cycle' => ['sometimes', 'string', 'in:monthly,bi_weekly,weekly'],
            'payroll_day' => ['sometimes', 'integer', 'between:1,28'],
            'pay_day' => ['sometimes', 'integer', 'between:1,28'],
            'overtime_rate_multiplier' => ['sometimes', 'numeric', 'min:1'],
            'holiday_rate_multiplier' => ['sometimes', 'numeric', 'min:1'],
            'night_shift_rate_multiplier' => ['sometimes', 'numeric', 'min:1'],
            'insurance_employee_rate' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'insurance_employer_rate' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'max_loan_percentage' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'min_loan_amount' => ['sometimes', 'numeric', 'min:0'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $companyId = CompanySetting::value('id');
        if (!$companyId) {
            return $this->error('No company found. Please set up company settings first.');
        }

        $settings = PayrollSetting::updateOrCreate(
            ['id' => 1],
            array_merge($validator->validated(), ['company_id' => $companyId])
        );

        return $this->success($settings, 'Payroll settings updated successfully.');
    }

    private function calculateTax(float $annualSalary): float
    {
        $brackets = [
            ['min' => 0, 'max' => 300000, 'rate' => 0],
            ['min' => 300001, 'max' => 600000, 'rate' => 5],
            ['min' => 600001, 'max' => 1000000, 'rate' => 10],
            ['min' => 1000001, 'max' => 2000000, 'rate' => 15],
            ['min' => 2000001, 'max' => PHP_INT_MAX, 'rate' => 20],
        ];

        $settings = PayrollSetting::first();
        if ($settings && $settings->tax_tables) {
            $brackets = $settings->tax_tables;
        }

        $tax = 0;
        foreach ($brackets as $bracket) {
            if ($annualSalary > $bracket['min']) {
                $taxable = min($annualSalary, $bracket['max']) - $bracket['min'];
                $tax += $taxable * ($bracket['rate'] / 100);
            }
        }

        return round($tax, 2);
    }

    private function formatPayslip(Payroll $payroll): array
    {
        $employee = $payroll->employee;

        return [
            'employee_name' => $employee?->name ?? 'N/A',
            'employee_code' => $employee?->employee_code ?? 'N/A',
            'department' => $employee?->department?->name ?? 'N/A',
            'position' => $employee?->position?->title ?? 'N/A',
            'payroll_month' => $payroll->payroll_month->format('F Y'),
            'basic_salary' => (float) $payroll->basic_salary,
            'allowances' => $payroll->allowances,
            'total_allowances' => (float) $payroll->total_allowances,
            'overtime_hours' => (float) $payroll->overtime_hours,
            'overtime_amount' => (float) $payroll->overtime_amount,
            'gross_salary' => (float) $payroll->gross_salary,
            'deductions' => $payroll->deductions,
            'total_deductions' => (float) $payroll->total_deductions,
            'net_salary' => (float) $payroll->net_salary,
            'payment_method' => $payroll->payment_method,
            'payment_status' => $payroll->payment_status,
            'payment_date' => $payroll->payment_date?->format('Y-m-d'),
        ];
    }
}
