<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Payroll extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'payroll_month',
        'basic_salary',
        'hourly_rate',
        'total_work_days',
        'present_days',
        'absent_days',
        'leave_days',
        'overtime_hours',
        'overtime_rate',
        'overtime_amount',
        'allowances',
        'total_allowances',
        'deductions',
        'total_deductions',
        'gross_salary',
        'net_salary',
        'payment_method',
        'bank_name',
        'bank_account',
        'payment_date',
        'payment_status',
        'payslip_path',
        'payslip_generated_at',
        'notes',
        'created_by',
        'approved_by',
        'approved_at',
    ];

    protected function casts(): array
    {
        return [
            'allowances' => 'array',
            'deductions' => 'array',
            'payroll_month' => 'date',
            'payment_date' => 'date',
            'payslip_generated_at' => 'datetime',
            'approved_at' => 'datetime',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(PayrollItem::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}