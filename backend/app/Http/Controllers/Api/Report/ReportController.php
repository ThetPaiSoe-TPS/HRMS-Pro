<?php

namespace App\Http\Controllers\Api\Report;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    use ApiResponseTrait;

    public function employees(Request $request)
    {
        $total = \App\Models\Employee::count();
        $active = \App\Models\Employee::where('status', 'active')->count();
        $byDepartment = \App\Models\Employee::selectRaw('department_id, count(*) as total')
            ->groupBy('department_id')->get();

        return $this->success([
            'total' => $total,
            'active' => $active,
            'by_department' => $byDepartment,
        ], 'Employee report retrieved successfully.');
    }

    public function attendance(Request $request)
    {
        $total = \App\Models\Attendance::count();
        $present = \App\Models\Attendance::where('status', 'present')->count();

        return $this->success([
            'total' => $total,
            'present' => $present,
        ], 'Attendance report retrieved successfully.');
    }

    public function leave(Request $request)
    {
        $byStatus = \App\Models\LeaveRequest::selectRaw('status, count(*) as total')
            ->groupBy('status')->get();

        return $this->success([
            'by_status' => $byStatus,
        ], 'Leave report retrieved successfully.');
    }

    public function payroll(Request $request)
    {
        $total = \App\Models\Payroll::sum('net_salary');

        return $this->success([
            'total_net_salary' => $total,
        ], 'Payroll report retrieved successfully.');
    }
}
