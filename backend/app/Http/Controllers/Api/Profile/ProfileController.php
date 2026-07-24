<?php

namespace App\Http\Controllers\Api\Profile;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ProfileController extends Controller
{
    use ApiResponseTrait;

    public function show(Request $request)
    {
        return $this->success($request->user(), 'Profile retrieved successfully.');
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $user->update($validator->validated());

        return $this->success($user, 'Profile updated successfully.');
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = $request->user();

        if (! Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The current password is incorrect.'],
            ]);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return $this->success(null, 'Password changed successfully.');
    }

    public function activities(Request $request)
    {
        $user = Auth::user();
        $limit = $request->integer('limit', 10);

        $activities = ActivityLog::forUser($user->id)
            ->recent($limit)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'action' => $log->action,
                    'description' => $log->description,
                    'time' => $log->formatted_time,
                    'icon' => $log->icon,
                    'color' => $log->color,
                    'ip' => $log->ip_address,
                    'created_at' => $log->created_at,
                ];
            });

        return $this->success($activities, 'Activities retrieved successfully.');
    }
}
