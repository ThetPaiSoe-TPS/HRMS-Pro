<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class LogActivity
{
    public function handle($request, Closure $next)
    {
        $response = $next($request);

        // Log only for authenticated users and non-GET requests
        if (Auth::check() && !$request->isMethod('get')) {
            $action = $this->getActionFromRoute($request);
            if ($action) {
                ActivityLog::create([
                    'user_id' => Auth::id(),
                    'action' => $action,
                    'description' => $this->getDescription($request, $action),
                    'data' => $request->except(['password', 'password_confirmation']),
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'url' => $request->fullUrl(),
                    'method' => $request->method(),
                ]);
            }
        }

        return $response;
    }

    private function getActionFromRoute($request)
    {
        $route = $request->route();
        if (!$route) return null;

        $name = $route->getName();
        if (!$name) return null;

        // Map route names to actions
        $actionMap = [
            'profile.update' => 'profile_update',
            'password.update' => 'password_change',
            'employees.store' => 'employee_create',
            'employees.update' => 'employee_update',
            'employees.destroy' => 'employee_delete',
            'leaves.store' => 'leave_create',
            'leaves.approve' => 'leave_approve',
            'leaves.reject' => 'leave_reject',
            'payroll.generate' => 'payroll_generate',
            'payroll.approve' => 'payroll_approve',
        ];

        return $actionMap[$name] ?? null;
    }

    private function getDescription($request, $action)
    {
        $descriptions = [
            'profile_update' => 'Updated profile information',
            'password_change' => 'Changed password',
            'employee_create' => 'Created new employee',
            'employee_update' => 'Updated employee information',
            'employee_delete' => 'Deleted employee',
            'leave_create' => 'Submitted leave request',
            'leave_approve' => 'Approved leave request',
            'leave_reject' => 'Rejected leave request',
            'payroll_generate' => 'Generated payroll',
            'payroll_approve' => 'Approved payroll',
        ];

        return $descriptions[$action] ?? 'Performed an action';
    }
}
