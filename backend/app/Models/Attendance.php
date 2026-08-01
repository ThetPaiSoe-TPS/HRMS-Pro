<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Attendance extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'employee_id',
        'check_in',
        'check_out',
        'status',
        'note',
        'location_in',
        'location_out',
        'work_hours',
        'overtime_hours',
    ];

    protected $casts = [
        'check_in' => 'datetime',
        'check_out' => 'datetime',
        'work_hours' => 'decimal:2',
        'overtime_hours' => 'decimal:2',
    ];

    protected $appends = ['date', 'work_hours', 'overtime_hours'];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    // Accessor for date
    public function getDateAttribute()
    {
        return $this->check_in ? $this->check_in->format('Y-m-d') : null;
    }

    // Calculate work hours
    public function getWorkHoursAttribute()
    {
        if ($this->check_in && $this->check_out) {
            $diff = $this->check_in->diffInMinutes($this->check_out);
            return round($diff / 60, 2);
        }
        return null;
    }

    // Calculate overtime hours (over 8 hours)
    public function getOvertimeHoursAttribute()
    {
        $workHours = $this->getWorkHoursAttribute();
        if ($workHours && $workHours > 8) {
            return round($workHours - 8, 2);
        }
        return 0;
    }
}
