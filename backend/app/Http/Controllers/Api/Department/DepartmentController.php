<?php

namespace App\Http\Controllers\Api\Department;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DepartmentController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request)
    {
        $query = Department::with(['manager']);

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('code', 'like', '%' . $request->search . '%');
        }

        $perPage = $request->integer('per_page', 10);
        $departments = $query->paginate($perPage);

        // Add employees_count to each department
        $departments->getCollection()->transform(function ($department) {
            $department->employees_count = $department->employees()->count();
            return $department;
        });

        return $this->success($departments, 'Departments retrieved successfully.');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50', 'unique:departments'],
            'description' => ['nullable', 'string'],
            'manager_id' => ['nullable', 'exists:employees,id'],
            'status' => ['nullable', 'in:active,inactive'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $department = Department::create($validator->validated());
        $department->load(['manager']);
        $department->employees_count = $department->employees()->count();

        return $this->created($department, 'Department created successfully.');
    }

    public function show(string $id)
    {
        $department = Department::with(['manager'])->find($id);

        if (! $department) {
            return $this->notFound('Department not found.');
        }

        $department->employees_count = $department->employees()->count();

        return $this->success($department, 'Department retrieved successfully.');
    }

    public function update(Request $request, string $id)
    {
        $department = Department::find($id);

        if (! $department) {
            return $this->notFound('Department not found.');
        }

        $validator = Validator::make($request->all(), [
            'name' => ['sometimes', 'string', 'max:255'],
            'code' => ['sometimes', 'string', 'max:50', 'unique:departments,code,' . $id],
            'description' => ['nullable', 'string'],
            'manager_id' => ['nullable', 'exists:employees,id'],
            'status' => ['nullable', 'in:active,inactive'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $department->update($validator->validated());
        $department->load(['manager']);
        $department->employees_count = $department->employees()->count();

        return $this->success($department, 'Department updated successfully.');
    }

    public function destroy(string $id)
    {
        $department = Department::find($id);

        if (! $department) {
            return $this->notFound('Department not found.');
        }

        // Check if department has employees
        if ($department->employees()->count() > 0) {
            return $this->error('Cannot delete department with assigned employees.', null, 422);
        }

        $department->delete();

        return $this->noContent();
    }
}
