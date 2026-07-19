<?php

namespace App\Http\Controllers\Api\Role;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RoleController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request)
    {
        $query = \App\Models\Role::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $perPage = $request->integer('per_page', 10);
        $roles = $query->paginate($perPage);

        return $this->success($roles, 'Roles retrieved successfully.');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255', 'unique:roles'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:roles'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $role = \App\Models\Role::create($validator->validated());

        return $this->created($role, 'Role created successfully.');
    }

    public function show(string $id)
    {
        $role = \App\Models\Role::find($id);

        if (! $role) {
            return $this->notFound('Role not found.');
        }

        return $this->success($role, 'Role retrieved successfully.');
    }

    public function update(Request $request, string $id)
    {
        $role = \App\Models\Role::find($id);

        if (! $role) {
            return $this->notFound('Role not found.');
        }

        $validator = Validator::make($request->all(), [
            'name' => ['sometimes', 'string', 'max:255', 'unique:roles,name,' . $id],
            'slug' => ['sometimes', 'string', 'max:255', 'unique:roles,slug,' . $id],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $role->update($validator->validated());

        return $this->success($role, 'Role updated successfully.');
    }

    public function destroy(string $id)
    {
        $role = \App\Models\Role::find($id);

        if (! $role) {
            return $this->notFound('Role not found.');
        }

        $role->delete();

        return $this->noContent();
    }
}
