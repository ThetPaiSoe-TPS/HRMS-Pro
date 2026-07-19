<?php

namespace App\Http\Controllers\Api\Employee;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class EmployeeExportController extends Controller
{
    use ApiResponseTrait;

    public function export(Request $request)
    {
        $employees = \App\Models\Employee::query()
            ->when($request->filled('department_id'), fn ($q) => $q->where('department_id', $request->department_id))
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->status))
            ->get();

        return $this->success($employees, 'Employees exported successfully.');
    }
}
