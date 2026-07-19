<?php

namespace App\Http\Controllers\Api\Employee;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class EmployeeController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request)
    {
        $query = \App\Models\Employee::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', '%' . $search . '%')
                    ->orWhere('last_name', 'like', '%' . $search . '%')
                    ->orWhere('employee_code', 'like', '%' . $search . '%');
            });
        }

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->filled('position_id')) {
            $query->where('position_id', $request->position_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $perPage = $request->integer('per_page', 10);
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $employees = $query->orderBy($sortBy, $sortOrder)->paginate($perPage);

        return $this->success($employees, 'Employees retrieved successfully.');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_code' => ['required', 'string', 'max:50', 'unique:employees'],
            'name' => ['required', 'string', 'max:255'],
            'department_id' => ['required', 'exists:departments,id'],
            'position_id' => ['required', 'exists:positions,id'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'hire_date' => ['nullable', 'date'],
            'status' => ['nullable', 'string', 'in:active,inactive'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $employee = \App\Models\Employee::create($validator->validated());

        return $this->created($employee, 'Employee created successfully.');
    }

    public function show(string $id)
    {
        $employee = \App\Models\Employee::find($id);

        if (! $employee) {
            return $this->notFound('Employee not found.');
        }

        return $this->success($employee, 'Employee retrieved successfully.');
    }

    public function update(Request $request, string $id)
    {
        $employee = \App\Models\Employee::find($id);

        if (! $employee) {
            return $this->notFound('Employee not found.');
        }

        $validator = Validator::make($request->all(), [
            'employee_code' => ['sometimes', 'string', 'max:50', 'unique:employees,employee_code,' . $id],
            'first_name' => ['sometimes', 'string', 'max:255'],
            'last_name' => ['sometimes', 'string', 'max:255'],
            'department_id' => ['sometimes', 'exists:departments,id'],
            'position_id' => ['sometimes', 'exists:positions,id'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'hire_date' => ['nullable', 'date'],
            'status' => ['nullable', 'string', 'in:active,inactive'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $employee->update($validator->validated());

        return $this->success($employee, 'Employee updated successfully.');
    }

    public function destroy(string $id)
    {
        $employee = \App\Models\Employee::find($id);

        if (! $employee) {
            return $this->notFound('Employee not found.');
        }

        $employee->delete();

        return $this->noContent();
    }

    public function uploadPhoto(Request $request, string $id)
    {
        $employee = \App\Models\Employee::find($id);

        if (! $employee) {
            return $this->notFound('Employee not found.');
        }

        $request->validate([
            'photo' => ['required', 'image', 'max:2048'],
        ]);

        if ($employee->photo) {
            Storage::disk('public')->delete($employee->photo);
        }

        $path = $request->file('photo')->store('employees', 'public');
        $employee->update(['photo' => $path]);

        return $this->success(['photo' => $path], 'Photo uploaded successfully.');
    }

    public function deletePhoto(string $id)
    {
        $employee = \App\Models\Employee::find($id);

        if (! $employee) {
            return $this->notFound('Employee not found.');
        }

        if (! $employee->photo) {
            return $this->notFound('No photo to delete.');
        }

        Storage::disk('public')->delete($employee->photo);
        $employee->update(['photo' => null]);

        return $this->success(null, 'Photo deleted successfully.');
    }
}
