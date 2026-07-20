<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaveRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'leave_type',
        'start_date',
        'end_date',
        'reason',
        'status',
        'attachment',
        'attachment_original_name',
        'attachment_mime_type',
        'attachment_size'
    ];

    protected $casts = [
        'date_from' => 'date',
        'date_to' => 'date',
        'attachment_size' => 'integer'
    ];

    public function getAttachmentUrlAttribute()
    {
        if ($this->attachment) {
            return asset('storage/' . $this->attachment);
        }
        return null;
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
