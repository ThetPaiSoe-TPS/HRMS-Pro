<?php

namespace App\Http\Controllers\Api\Payroll;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Payroll;
use App\Services\Payroll\PayrollService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PayrollController extends Controller
{
    use ApiResponseTrait;

    protected $payrollService;

    public function __construct(PayrollService $payrollService)
    {
        $this->payrollService = $payrollService;
    }

    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => ['nullable', 'exists:employees,id'],
            'month' => ['nullable', 'integer', 'between:1,12'],
            'year' => ['nullable', 'integer', 'min:2000'],
            'status' => ['nullable', 'in:draft,calculated,pending_approval,approved,paid,cancelled'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $payrolls = Payroll::with([
            'employee:id,name,employee_code,department_id',
            'employee.department:id,name',
            'creator:id,name',
        ]);

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
            $payrolls->where('status', $request->status);
        }

        $perPage = $request->integer('per_page', 10);
        $payrolls = $payrolls->orderBy('payroll_month', 'desc')
            ->orderBy('id', 'desc')
            ->paginate($perPage);

        return $this->success($payrolls, 'Payrolls retrieved successfully.');
    }

    public function show(Request $request, $id)
    {
        $payroll = Payroll::find($id);

        if (!$payroll) {
            return $this->notFound('Payroll not found.');
        }

        $payroll->load([
            'employee:id,name,employee_code,department_id,position_id',
            'employee.department:id,name',
            'employee.position:id,title',
            'creator:id,name',
            'approver:id,name',
            'payer:id,name',
            'items',
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
        $createdBy = $request->user()?->id;

        // Get employees to generate payroll for
        $employees = Employee::query();
        if ($request->filled('employee_ids')) {
            $employees->whereIn('id', $request->employee_ids);
        }
        $employees = $employees->get();

        if ($employees->isEmpty()) {
            return $this->error('No employees found to generate payroll.', 422);
        }

        try {
            $generated = $this->payrollService->generatePayroll(
                $employees->pluck('id')->toArray(),
                $year,
                $month,
                $createdBy
            );

            if (empty($generated)) {
                return $this->error('No new payroll records generated. They may already exist.', 422);
            }

            return $this->created($generated, 'Payroll generated successfully.');
        } catch (\Exception $e) {
            return $this->error('Failed to generate payroll: ' . $e->getMessage(), 500);
        }
    }

    public function calculate(Request $request, Payroll $payroll)
    {
        if (!$payroll->canBeEdited()) {
            return $this->error('Payroll cannot be calculated in current status.', 422);
        }

        try {
            $calculated = $this->payrollService->calculatePayroll($payroll);
            return $this->success($calculated, 'Payroll calculated successfully.');
        } catch (\Exception $e) {
            return $this->error('Failed to calculate payroll: ' . $e->getMessage(), 500);
        }
    }

    public function submitForApproval(Request $request, Payroll $payroll)
    {
        try {
            $submitted = $this->payrollService->submitForApproval($payroll);
            return $this->success($submitted, 'Payroll submitted for approval successfully.');
        } catch (\Exception $e) {
            return $this->error('Failed to submit for approval: ' . $e->getMessage(), 422);
        }
    }

    public function approve(Request $request, Payroll $payroll)
    {
        try {
            $approved = $this->payrollService->approvePayroll($payroll, $request->user()?->id);
            return $this->success($approved, 'Payroll approved successfully.');
        } catch (\Exception $e) {
            return $this->error('Failed to approve payroll: ' . $e->getMessage(), 422);
        }
    }

    public function markAsPaid(Request $request, Payroll $payroll)
    {
        $validator = Validator::make($request->all(), [
            'payment_date' => ['nullable', 'date'],
            'payment_method' => ['nullable', 'string', 'in:bank_transfer,cash,cheque,other'],
            'bank_name' => ['nullable', 'string', 'max:100'],
            'bank_account' => ['nullable', 'string', 'max:50'],
            'transaction_number' => ['nullable', 'string', 'max:100'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        try {
            $paid = $this->payrollService->markAsPaid(
                $payroll,
                $request->only(['payment_date', 'payment_method', 'bank_name', 'bank_account', 'transaction_number']),
                $request->user()?->id
            );
            return $this->success($paid, 'Payroll marked as paid successfully.');
        } catch (\Exception $e) {
            return $this->error('Failed to mark as paid: ' . $e->getMessage(), 422);
        }
    }

    public function cancel(Request $request, Payroll $payroll)
    {
        $validator = Validator::make($request->all(), [
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        try {
            $cancelled = $this->payrollService->cancelPayroll($payroll, $request->reason);
            return $this->success($cancelled, 'Payroll cancelled successfully.');
        } catch (\Exception $e) {
            return $this->error('Failed to cancel payroll: ' . $e->getMessage(), 422);
        }
    }

    public function dashboard(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'month' => ['nullable', 'integer', 'between:1,12'],
            'year' => ['nullable', 'integer', 'min:2000'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $month = $request->integer('month', now()->month);
        $year = $request->integer('year', now()->year);

        $summary = $this->payrollService->getDashboardSummary($year, $month);

        // Get department breakdown
        $departmentCost = Payroll::with('employee.department')
            ->whereYear('payroll_month', $year)
            ->whereMonth('payroll_month', $month)
            ->where('status', 'paid')
            ->get()
            ->groupBy('employee.department.name')
            ->map(function ($items) {
                return [
                    'total_salary' => $items->sum('net_salary'),
                    'employee_count' => $items->count(),
                ];
            });

        return $this->success([
            'summary' => $summary,
            'department_breakdown' => $departmentCost,
        ], 'Dashboard data retrieved successfully.');
    }

    public function employeeSalary(Request $request, Employee $employee)
    {
        $payroll = Payroll::where('employee_id', $employee->id)
            ->with(['employee:id,name,employee_code', 'items'])
            ->latest('payroll_month')
            ->first();

        if (!$payroll) {
            return $this->error('No payroll found for this employee.', 404);
        }

        return $this->success($payroll, 'Employee salary retrieved successfully.');
    }
}
