<?php

namespace App\Http\Controllers\Api\Permission;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PermissionController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request)
    {
        $query = \App\Models\Permission::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $perPage = $request->integer('per_page', 10);
        $permissions = $query->paginate($perPage);

        return $this->success($permissions, 'Permissions retrieved successfully.');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255', 'unique:permissions'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:permissions'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $permission = \App\Models\Permission::create($validator->validated());

        return $this->created($permission, 'Permission created successfully.');
    }

    public function show(string $id)
    {
        $permission = \App\Models\Permission::find($id);

        if (! $permission) {
            return $this->notFound('Permission not found.');
        }

        return $this->success($permission, 'Permission retrieved successfully.');
    }

    public function update(Request $request, string $id)
    {
        $permission = \App\Models\Permission::find($id);

        if (! $permission) {
            return $this->notFound('Permission not found.');
        }

        $validator = Validator::make($request->all(), [
            'name' => ['sometimes', 'string', 'max:255', 'unique:permissions,name,' . $id],
            'slug' => ['sometimes', 'string', 'max:255', 'unique:permissions,slug,' . $id],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $permission->update($validator->validated());

        return $this->success($permission, 'Permission updated successfully.');
    }

    public function destroy(string $id)
    {
        $permission = \App\Models\Permission::find($id);

        if (! $permission) {
            return $this->notFound('Permission not found.');
        }

        $permission->delete();

        return $this->noContent();
    }
}
