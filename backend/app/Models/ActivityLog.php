<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id',
        'action',
        'description',
        'data',
        'ip_address',
        'user_agent',
        'url',
        'method',
    ];

    protected $casts = [
        'data' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scope for recent activities
    public function scopeRecent($query, $limit = 10)
    {
        return $query->orderBy('created_at', 'desc')->limit($limit);
    }

    // Scope for a specific user
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    // Get formatted time
    public function getFormattedTimeAttribute()
    {
        return $this->created_at->diffForHumans();
    }

    // Get activity icon based on action
    public function getIconAttribute()
    {
        $icons = [
            'login' => '🔑',
            'logout' => '🚪',
            'profile_update' => '✏️',
            'password_change' => '🔒',
            'employee_create' => '👤',
            'employee_update' => '✏️',
            'leave_create' => '📅',
            'leave_approve' => '✅',
            'payroll_generate' => '💰',
        ];
        return $icons[$this->action] ?? '📌';
    }

    // Get activity color based on action
    public function getColorAttribute()
    {
        $colors = [
            'login' => 'blue',
            'logout' => 'gray',
            'profile_update' => 'green',
            'password_change' => 'red',
            'employee_create' => 'blue',
            'employee_update' => 'green',
            'leave_create' => 'yellow',
            'leave_approve' => 'green',
            'payroll_generate' => 'purple',
        ];
        return $colors[$this->action] ?? 'gray';
    }
}
