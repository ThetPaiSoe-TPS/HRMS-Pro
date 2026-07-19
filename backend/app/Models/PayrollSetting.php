<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayrollSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'payroll_cycle',
        'payroll_day',
        'pay_day',
        'tax_regime',
        'tax_tables',
        'insurance_employee_rate',
        'insurance_employer_rate',
        'overtime_rate_multiplier',
        'holiday_rate_multiplier',
        'night_shift_rate_multiplier',
        'max_loan_percentage',
        'min_loan_amount',
        'default_allowances',
        'default_deductions',
        'company_id',
    ];

    protected function casts(): array
    {
        return [
            'tax_tables' => 'array',
            'default_allowances' => 'array',
            'default_deductions' => 'array',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(CompanySetting::class, 'company_id');
    }
}