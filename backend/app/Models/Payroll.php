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
        'daily_salary',
        'hourly_salary',
        'total_allowances',
        'total_overtime',
        'total_bonus',
        'gross_salary',
        'total_deductions',
        'tax_amount',
        'loan_deduction',
        'advance_salary',
        'late_deduction',
        'absent_deduction',
        'unpaid_leave_deduction',
        'other_deductions',
        'net_salary',
        'status',
        'payment_date',
        'payment_method',
        'bank_name',
        'bank_account',
        'transaction_number',
        'paid_by',
        'hr_notes',
        'finance_notes',
        'employee_notes',
        'general_notes',
        'created_by',
        'approved_by',
        'approved_at',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'payroll_month' => 'date',
            'payment_date' => 'date',
            'approved_at' => 'datetime',
            'paid_at' => 'datetime',
            'basic_salary' => 'decimal:2',
            'daily_salary' => 'decimal:2',
            'hourly_salary' => 'decimal:2',
            'total_allowances' => 'decimal:2',
            'total_overtime' => 'decimal:2',
            'total_bonus' => 'decimal:2',
            'gross_salary' => 'decimal:2',
            'total_deductions' => 'decimal:2',
            'tax_amount' => 'decimal:2',
            'loan_deduction' => 'decimal:2',
            'advance_salary' => 'decimal:2',
            'late_deduction' => 'decimal:2',
            'absent_deduction' => 'decimal:2',
            'unpaid_leave_deduction' => 'decimal:2',
            'other_deductions' => 'decimal:2',
            'net_salary' => 'decimal:2',
        ];
    }

    // Relationships
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function payer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'paid_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(PayrollItem::class);
    }

    // Scopes
    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopePendingApproval($query)
    {
        return $query->where('status', 'pending_approval');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    public function scopeForMonth($query, $year, $month)
    {
        return $query->whereYear('payroll_month', $year)
            ->whereMonth('payroll_month', $month);
    }

    // Business Rules
    public function canBeEdited(): bool
    {
        return $this->status === 'draft' || $this->status === 'calculated';
    }

    public function canBeApproved(): bool
    {
        return $this->status === 'pending_approval';
    }

    public function canBePaid(): bool
    {
        return $this->status === 'approved';
    }

    public function canBeCancelled(): bool
    {
        return $this->status !== 'paid' && $this->status !== 'cancelled';
    }

    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }
}
