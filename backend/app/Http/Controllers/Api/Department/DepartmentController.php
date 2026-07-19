<?php

namespace App\Http\Controllers\Api\Department;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DepartmentController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request)
    {
        $query = \App\Models\Department::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $perPage = $request->integer('per_page', 10);
        $departments = $query->paginate($perPage);

        return $this->success($departments, 'Departments retrieved successfully.');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'manager_id' => ['nullable', 'exists:employees,id'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $department = \App\Models\Department::create($validator->validated());

        return $this->created($department, 'Department created successfully.');
    }

    public function show(string $id)
    {
        $department = \App\Models\Department::find($id);

        if (! $department) {
            return $this->notFound('Department not found.');
        }

        return $this->success($department, 'Department retrieved successfully.');
    }

    public function update(Request $request, string $id)
    {
        $department = \App\Models\Department::find($id);

        if (! $department) {
            return $this->notFound('Department not found.');
        }

        $validator = Validator::make($request->all(), [
            'name' => ['sometimes', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'manager_id' => ['nullable', 'exists:employees,id'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $department->update($validator->validated());

        return $this->success($department, 'Department updated successfully.');
    }

    public function destroy(string $id)
    {
        $department = \App\Models\Department::find($id);

        if (! $department) {
            return $this->notFound('Department not found.');
        }

        $department->delete();

        return $this->noContent();
    }
}
