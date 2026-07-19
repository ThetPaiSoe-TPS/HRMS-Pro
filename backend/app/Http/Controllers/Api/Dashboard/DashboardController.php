<?php

namespace App\Http\Controllers\Api\Dashboard;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    use ApiResponseTrait;

    public function statistics()
    {
        return $this->success([
            'total_employees' => \App\Models\Employee::count(),
            'total_departments' => \App\Models\Department::count(),
            'total_attendance_today' => \App\Models\Attendance::whereDate('check_in', today())->count(),
            'pending_leaves' => \App\Models\LeaveRequest::where('status', 'pending')->count(),
        ], 'Dashboard statistics retrieved successfully.');
    }

    public function charts()
    {
        return $this->success([
            'attendance_by_month' => [],
            'leave_by_month' => [],
        ], 'Dashboard charts retrieved successfully.');
    }

    public function recentActivities()
    {
        return $this->success([], 'Recent activities retrieved successfully.');
    }

    public function upcomingHolidays()
    {
        return $this->success([], 'Upcoming holidays retrieved successfully.');
    }
}
