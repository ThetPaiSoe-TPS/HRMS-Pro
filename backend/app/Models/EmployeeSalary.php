<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EmployeeSalary extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'base_salary',
        'hourly_rate',
        'weekly_rate',
        'monthly_rate',
        'allowances',
        'deductions',
        'bank_name',
        'bank_account',
        'bank_branch',
        'account_type',
        'is_active',
        'effective_date',
        'end_date',
        'date_of_birth',
        'gender',
    ];

    protected function casts(): array
    {
        return [
            'allowances' => 'array',
            'deductions' => 'array',
            'effective_date' => 'date',
            'end_date' => 'date',
            'is_active' => 'boolean',
             'date_of_birth' => 'date',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function payrolls(): HasMany
    {
        return $this->hasMany(Payroll::class, 'employee_id', 'employee_id');
    }

    public function getGenderLabelAttribute()
    {
        return ucfirst($this->gender);
    }

    public function getAgeAttribute()
    {
        if ($this->date_of_birth) {
            return $this->date_of_birth->age;
        }
        return null;
    }
}
