<?php

namespace App\Policies;

use App\Models\LeaveRequest;
use App\Models\User;

class LeaveRequestPolicy
{
    public function create(User $user): bool
    {
        return $user->hasPermission('leave.create');
    }
}