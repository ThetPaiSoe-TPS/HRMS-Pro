<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request)
    {
        $query = \App\Models\User::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('email', 'like', '%' . $request->search . '%');
        }

        $perPage = $request->integer('per_page', 10);
        $users = $query->paginate($perPage);

        return $this->success($users, 'Users retrieved successfully.');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'role_id' => ['nullable', 'exists:roles,id'],
            'employee_id' => ['nullable', 'exists:employees,id'],

        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $data = $validator->validated();
        $data['password'] = Hash::make($data['password']);
        $user = \App\Models\User::create($data);

        return $this->created($user, 'User created successfully.');
    }

    public function show(string $id)
    {
        $user = \App\Models\User::find($id);

        if (! $user) {
            return $this->notFound('User not found.');
        }

        return $this->success($user, 'User retrieved successfully.');
    }

    public function update(Request $request, User $user)
    {
        // Debug: Check what's coming in
        Log::info('Update request data:', $request->all());

        $validator = Validator::make($request->all(), [
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password' => ['sometimes', 'string', 'min:8'],
            'role_id' => ['nullable', 'exists:roles,id'],
            'employee_id' => ['nullable', 'exists:employees,id'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $data = $validator->validated();

        // Debug: Check validated data
        Log::info('Validated data:', $data);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $updated = $user->update($data);

        // Debug: Check if update was successful
        Log::info('Update result:', ['success' => $updated, 'user' => $user->fresh()->toArray()]);

        $user->refresh();

        return $this->success($user, 'User updated successfully.');
    }

    public function destroy(string $id)
    {
        $user = \App\Models\User::find($id);

        if (! $user) {
            return $this->notFound('User not found.');
        }

        $user->delete();

        return $this->noContent();
    }
}
