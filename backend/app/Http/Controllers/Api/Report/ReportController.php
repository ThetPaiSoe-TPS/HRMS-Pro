<?php

namespace App\Http\Controllers\Api\Report;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Department;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\Payroll;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    use ApiResponseTrait;

    public function employees(Request $request)
    {
        $query = Employee::with(['department', 'position']);

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('employee_id')) {
            $query->where('id', $request->employee_id);
        }

        if ($request->filled('date_from')) {
            $query->where('hire_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('hire_date', '<=', $request->date_to);
        }

        $employees = $query->get();

        // Calculate stats
        $total = $employees->count();
        $active = $employees->where('status', 'active')->count();
        $inactive = $employees->where('status', 'inactive')->count();
        $resigned = $employees->where('status', 'resigned')->count();
        $terminated = $employees->where('status', 'terminated')->count();

        $byDepartment = $employees->groupBy('department_id')->map(function ($items, $key) {
            $dept = Department::find($key);
            return [
                'department' => $dept ? $dept->name : 'Unknown',
                'total' => $items->count(),
            ];
        })->values();

        // Return data directly in the format frontend expects
        return $this->success([
            'data' => $employees,
            'summary' => [
                'total' => $total,
                'active' => $active,
                'inactive' => $inactive,
                'resigned' => $resigned,
                'terminated' => $terminated,
                'by_department' => $byDepartment,
            ],
        ], 'Employee report retrieved successfully.');
    }

    public function attendance(Request $request)
    {
        $query = Attendance::with(['employee', 'employee.department', 'employee.position']);

        if ($request->filled('date_from')) {
            $query->whereDate('check_in', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('check_in', '<=', $request->date_to);
        }
        if ($request->filled('department_id')) {
            $query->whereHas('employee', function ($q) use ($request) {
                $q->where('department_id', $request->department_id);
            });
        }
        if ($request->filled('employee_id')) {
            $query->where('employee_id', $request->employee_id);
        }

        $attendances = $query->get();

        $total = $attendances->count();
        $present = $attendances->where('status', 'present')->count();
        $absent = $attendances->where('status', 'absent')->count();
        $late = $attendances->where('status', 'late')->count();
        $halfDay = $attendances->where('status', 'half_day')->count();
        $onLeave = $attendances->where('status', 'leave')->count();

        return $this->success([
            'data' => $attendances,
            'summary' => [
                'total' => $total,
                'present' => $present,
                'absent' => $absent,
                'late' => $late,
                'half_day' => $halfDay,
                'on_leave' => $onLeave,
            ],
        ], 'Attendance report retrieved successfully.');
    }

    public function leave(Request $request)
    {
        $query = LeaveRequest::with([
            'employee',
            'employee.department',
            'employee.position',
            'leaveType'  // This loads the full leaveType object
        ]);

        if ($request->filled('date_from')) {
            $query->where('start_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('end_date', '<=', $request->date_to);
        }
        if ($request->filled('department_id')) {
            $query->whereHas('employee', function ($q) use ($request) {
                $q->where('department_id', $request->department_id);
            });
        }
        if ($request->filled('employee_id')) {
            $query->where('employee_id', $request->employee_id);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $leaveRequests = $query->get();

        // Transform data to include leave_type as string name
        $transformedData = $leaveRequests->map(function ($item) {
            return [
                'id' => $item->id,
                'employee_id' => $item->employee_id,
                'employee' => $item->employee ? [
                    'name' => $item->employee->name,
                    'employee_code' => $item->employee->employee_code,
                    'department' => $item->employee->department ? [
                        'name' => $item->employee->department->name,
                    ] : null,
                ] : null,
                'leave_type' => $item->leaveType ? $item->leaveType->name : ($item->leave_type ?? 'N/A'),
                'start_date' => $item->start_date,
                'end_date' => $item->end_date,
                'total_days' => $item->total_days,
                'days' => $item->days,
                'status' => $item->status,
                'reason' => $item->reason,
            ];
        });

        // Calculate by status
        $byStatus = $leaveRequests->groupBy('status')->map(function ($items, $key) {
            return [
                'status' => $key,
                'total' => $items->count(),
                'total_days' => $items->sum('total_days'),
            ];
        })->values();

        // Employee leave summary
        $employeeSummary = $leaveRequests->groupBy('employee_id')->map(function ($items) {
            $employee = $items->first()->employee;

            $annualUsed = 0;
            $sickUsed = 0;
            $personalUsed = 0;
            $totalUsed = 0;

            foreach ($items as $item) {
                $totalUsed += ($item->total_days ?? 1);

                // Get leave type name from relationship
                $leaveTypeName = '';
                if ($item->leaveType) {
                    $leaveTypeName = $item->leaveType->name;
                } elseif ($item->leave_type) {
                    $leaveTypeName = $item->leave_type;
                }

                if (str_contains(strtolower($leaveTypeName), 'annual')) {
                    $annualUsed += ($item->total_days ?? 1);
                } elseif (str_contains(strtolower($leaveTypeName), 'sick')) {
                    $sickUsed += ($item->total_days ?? 1);
                } elseif (str_contains(strtolower($leaveTypeName), 'casual') || str_contains(strtolower($leaveTypeName), 'personal')) {
                    $personalUsed += ($item->total_days ?? 1);
                }
            }

            return [
                'employee_id' => $employee ? $employee->id : 0,
                'employee_name' => $employee ? $employee->name : 'Unknown',
                'employee_code' => $employee ? $employee->employee_code : '',
                'department' => $employee && $employee->department ? $employee->department->name : 'N/A',
                'annual_used' => $annualUsed,
                'annual_balance' => max(0, 12 - $annualUsed),
                'sick_used' => $sickUsed,
                'sick_balance' => max(0, 10 - $sickUsed),
                'personal_used' => $personalUsed,
                'personal_balance' => max(0, 7 - $personalUsed),
                'total_used' => $totalUsed,
                'total_balance' => max(0, 30 - $totalUsed),
            ];
        })->values();

        return $this->success([
            'data' => $transformedData,
            'summary' => $employeeSummary,
            'by_status' => $byStatus,
        ], 'Leave report retrieved successfully.');
    }

    public function payroll(Request $request)
    {
        $query = Payroll::with(['employee', 'employee.department', 'employee.position']);

        if ($request->filled('month')) {
            $query->whereYear('payroll_month', substr($request->month, 0, 4))
                ->whereMonth('payroll_month', substr($request->month, 5, 2));
        }
        if ($request->filled('department_id')) {
            $query->whereHas('employee', function ($q) use ($request) {
                $q->where('department_id', $request->department_id);
            });
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $payrolls = $query->get();

        $departmentSummary = $payrolls->groupBy('employee.department.name')->map(function ($items, $key) {
            return [
                'department' => $key ?: 'Unknown',
                'total_employees' => $items->unique('employee_id')->count(),
                'total_basic' => $items->sum('basic_salary'),
                'total_allowances' => $items->sum('total_allowances'),
                'total_deductions' => $items->sum('total_deductions'),
                'total_overtime' => $items->sum('total_overtime'),
                'total_gross' => $items->sum('gross_salary'),
                'total_net' => $items->sum('net_salary'),
            ];
        })->values();

        return $this->success([
            'data' => $payrolls,
            'summary' => $departmentSummary,
        ], 'Payroll report retrieved successfully.');
    }
}
