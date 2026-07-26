<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeaveRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'leave_type_id',
        'start_date',
        'end_date',
        'total_days',
        'reason',
        'status',
        'attachment',
        'attachment_original_name',
        'attachment_mime_type',
        'attachment_size',
        'rejection_reason',
        'approved_at',
        'approved_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'total_days' => 'integer',
        'approved_at' => 'datetime',
        'attachment_size' => 'integer',
    ];

    protected $appends = ['days', 'attachment_url'];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_id')
            ->select(['id', 'name', 'employee_code', 'photo', 'department_id', 'position_id'])
            ->with(['department', 'position']);
    }

    public function leaveType(): BelongsTo
    {
        return $this->belongsTo(LeaveType::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function getDaysAttribute()
    {
        if ($this->start_date && $this->end_date) {
            return $this->start_date->diffInDays($this->end_date) + 1;
        }
        return $this->total_days ?? 1;
    }

    public function getAttachmentUrlAttribute()
    {
        if ($this->attachment) {
            return asset('storage/' . $this->attachment);
        }
        return null;
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    public function scopeForEmployee($query, $employeeId)
    {
        return $query->where('employee_id', $employeeId);
    }
}
