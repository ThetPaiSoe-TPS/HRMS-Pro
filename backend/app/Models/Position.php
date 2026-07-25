<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'code',
        'department_id',
        'description',
        'salary_range',    // Keep this
        'min_salary',      // Add this
        'max_salary',      // Add this
        'status',
    ];

    protected $appends = ['employees_count', 'salary_display'];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }

    public function getEmployeesCountAttribute()
    {
        return $this->employees()->count();
    }

    // New accessor for salary display
    public function getSalaryDisplayAttribute()
    {
        if ($this->min_salary && $this->max_salary) {
            return '$' . number_format($this->min_salary) . ' - $' . number_format($this->max_salary);
        } elseif ($this->min_salary) {
            return 'From $' . number_format($this->min_salary);
        } elseif ($this->max_salary) {
            return 'Up to $' . number_format($this->max_salary);
        } elseif ($this->salary_range) {
            return $this->salary_range;
        }
        return 'N/A';
    }
}
