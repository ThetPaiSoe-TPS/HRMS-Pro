<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LeaveType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'days_per_year',
        'is_paid',
        'requires_approval',
        'max_consecutive_days',
        'carry_forward',
        'carry_forward_limit',
        'status',
    ];

    protected $casts = [
        'days_per_year' => 'integer',
        'is_paid' => 'boolean',
        'requires_approval' => 'boolean',
        'max_consecutive_days' => 'integer',
        'carry_forward' => 'boolean',
        'carry_forward_limit' => 'integer',
    ];

    protected $appends = ['used_days', 'available_days'];

    public function leaveRequests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class);
    }

    public function getUsedDaysAttribute()
    {
        return $this->leaveRequests()
            ->where('status', 'approved')
            ->sum('total_days');
    }

    public function getAvailableDaysAttribute()
    {
        return $this->days_per_year - $this->used_days;
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
