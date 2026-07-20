<?php

namespace App\Http\Controllers\Api\Payroll;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\EmployeeSalary;
use App\Models\Payroll;
use App\Models\PayrollSetting;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PayrollController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request)
    {
        $payrolls = Payroll::with('employee:id,name,employee_code');

        if ($request->filled('employee_id')) {
            $payrolls->where('employee_id', $request->employee_id);
        }

        if ($request->filled('month')) {
            $payrolls->whereMonth('payroll_month', $request->month);
        }

        if ($request->filled('year')) {
            $payrolls->whereYear('payroll_month', $request->year);
        }

        if ($request->filled('status')) {
            $payrolls->where('payment_status', $request->status);
        }

        $perPage = $request->integer('per_page', 10);
        $payrolls = $payrolls->orderBy('payroll_month', 'desc')->paginate($perPage);

        return $this->success($payrolls, 'Payrolls retrieved successfully.');
    }

    public function show(Request $request, Payroll $payroll)
    {
        $payroll->load([
            'employee:id,name,employee_code,department_id,position_id',
            'employee.department:id,name',
            'employee.position:id,title',
            'creator:id,name',
        ]);

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

        $generated = [];

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
            $netSalary = $basicSalary;

            $payroll = Payroll::create([
                'employee_id' => $employee->id,
                'payroll_month' => $payrollMonth,
                'basic_salary' => $basicSalary,
                'net_salary' => $netSalary,
                'payment_status' => 'pending',
                'created_by' => $request->user()?->id,
            ]);

            $generated[] = $payroll->load('employee:id,name,employee_code');
        }

        return $this->created($generated, 'Payroll generated successfully.');
    }

    public function update(Request $request, Payroll $payroll)
    {
        $validator = Validator::make($request->all(), [
            'basic_salary' => ['nullable', 'numeric', 'min:0'],
            'net_salary'   => ['nullable', 'numeric', 'min:0'],
            'notes'        => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        // ✅ FIX: Use only() to explicitly pick the fields we want to update
        $payroll->update($request->only([
            'basic_salary',
            'net_salary',
            'notes',
        ]));

        return $this->success(
            $payroll->fresh()->load('employee:id,name,employee_code'),
            'Payroll updated successfully.'
        );
    }

    public function approve(Request $request, Payroll $payroll)
    {
        if ($payroll->payment_status !== 'pending') {
            return $this->error('Only pending payrolls can be approved.');
        }

        $payroll->update([
            'payment_status' => 'processing',
        ]);

        return $this->success($payroll->load('employee:id,name,employee_code'), 'Payroll approved successfully.');
    }

    public function pay(Request $request, Payroll $payroll)
    {
        if ($payroll->payment_status !== 'processing') {
            return $this->error('Only approved payrolls can be processed for payment.');
        }

        $validator = Validator::make($request->all(), [
            'payment_date' => ['nullable', 'date'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $payroll->update([
            'payment_status' => 'paid',
            'payment_date' => $request->payment_date ?? now()->toDateString(),
        ]);

        return $this->success($payroll->load('employee:id,name,employee_code'), 'Payment processed successfully.');
    }

    public function markPaid(Request $request, Payroll $payroll)
    {
        $payroll->update([
            'payment_status' => 'paid',
            'payment_date' => now()->toDateString(),
        ]);

        return $this->success($payroll->load('employee:id,name,employee_code'), 'Payroll marked as paid successfully.');
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

    public function settings(Request $request)
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

        $companyId = \App\Models\CompanySetting::value('id');
        if (!$companyId) {
            return $this->error('No company found. Please set up company settings first.');
        }

        $settings = PayrollSetting::updateOrCreate(
            ['id' => 1],
            array_merge($validator->validated(), ['company_id' => $companyId])
        );

        return $this->success($settings, 'Payroll settings updated successfully.');
    }
}
