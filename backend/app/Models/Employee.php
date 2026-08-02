<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'employee_code',
        'name',
        'department_id',
        'position_id',
        'phone',
        'email',
        'date_of_birth',
        'gender',
        'hire_date',
        'status',
        'photo',
    ];

    protected $casts = [
        'hire_date' => 'date',
        'date_of_birth' => 'date',
        'deleted_at' => 'datetime',
        'status' => 'string',
    ];

    // ============================================
    // ✅ RELATIONSHIPS
    // ============================================

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function position()
    {
        return $this->belongsTo(Position::class);
    }

    public function payrolls()
    {
        return $this->hasMany(Payroll::class);
    }

    public function leaves()
    {
        return $this->hasMany(LeaveRequest::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function salaries()
    {
        return $this->hasMany(EmployeeSalary::class);
    }

    // ============================================
    // ✅ ACCESSORS - Format when reading
    // ============================================

    /**
     * Get full name (using 'name' field)
     */
    public function getFullNameAttribute()
    {
        return $this->name;
    }

    /**
     * Get status as badge text
     */
    public function getStatusBadgeAttribute()
    {
        return $this->status === 'active' ? 'Active' : 'Inactive';
    }

    /**
     * Get experience in years from hire date
     */
    public function getExperienceYearsAttribute()
    {
        if ($this->hire_date) {
            return now()->diffInYears($this->hire_date);
        }
        return 0;
    }

    /**
     * Get initials from name
     */
    public function getInitialsAttribute()
    {
        $words = explode(' ', trim($this->name));
        $initials = '';
        foreach ($words as $word) {
            if (!empty($word)) {
                $initials .= strtoupper($word[0]);
            }
        }
        return $initials ?: 'U';
    }

    /**
     * Get age from date of birth
     */
    public function getAgeAttribute()
    {
        if ($this->date_of_birth) {
            return now()->diffInYears($this->date_of_birth);
        }
        return null;
    }

    /**
     * Get uppercase name
     */
    public function getUppercaseNameAttribute()
    {
        return strtoupper($this->name);
    }

    /**
     * Get formatted employee code
     */
    public function getFormattedEmployeeCodeAttribute()
    {
        return 'EMP-' . $this->employee_code;
    }

    /**
     * Get total earnings from payrolls
     */
    public function getTotalEarningsAttribute()
    {
        return $this->payrolls()->sum('net_salary') ?? 0;
    }

    /**
     * Check if employee is senior (5+ years)
     */
    public function getIsSeniorAttribute()
    {
        if ($this->hire_date) {
            return now()->diffInYears($this->hire_date) >= 5;
        }
        return false;
    }

    /**
     * Get salary grade based on average payroll
     */
    public function getSalaryGradeAttribute()
    {
        $avgSalary = $this->payrolls()->avg('net_salary') ?? 0;

        if ($avgSalary > 80000) return 'A';
        if ($avgSalary > 50000) return 'B';
        if ($avgSalary > 30000) return 'C';
        return 'D';
    }

    // ============================================
    // ✅ MUTATORS - Format when saving
    // ============================================

    /**
     * Set name (trim and capitalize)
     */
    public function setNameAttribute($value)
    {
        $this->attributes['name'] = ucwords(strtolower(trim($value)));
    }

    /**
     * Set email (lowercase)
     */
    public function setEmailAttribute($value)
    {
        $this->attributes['email'] = strtolower(trim($value));
    }

    /**
     * Set phone (remove non-numeric)
     */
    public function setPhoneAttribute($value)
    {
        $this->attributes['phone'] = preg_replace('/[^0-9]/', '', trim($value));
    }

    /**
     * Set employee code (uppercase)
     */
    public function setEmployeeCodeAttribute($value)
    {
        $this->attributes['employee_code'] = strtoupper(trim($value));
    }

    /**
     * Set status (ensure valid)
     */
    public function setStatusAttribute($value)
    {
        $this->attributes['status'] = in_array($value, ['active', 'inactive']) ? $value : 'active';
    }

    // ============================================
    // ✅ APPEND - Include accessors in JSON
    // ============================================
    protected $appends = [
        'full_name',
        'status_badge',
        'experience_years',
        'initials',
        'age',
        'uppercase_name',
        'formatted_employee_code',
        'total_earnings',
        'is_senior',
        'salary_grade',
    ];

    // ============================================
    // ✅ FULL-TEXT SEARCH SCOPES
    // ============================================

    public function scopeSearchFullText(Builder $query, string $searchTerm): Builder
    {
        return $query->whereRaw(
            "MATCH(name, employee_code, email) AGAINST(? IN BOOLEAN MODE)",
            [$this->formatSearchTerm($searchTerm)]
        );
    }

    public function scopeSearchNatural(Builder $query, string $searchTerm): Builder
    {
        return $query->whereRaw(
            "MATCH(name, employee_code, email) AGAINST(? IN NATURAL LANGUAGE MODE)",
            [$searchTerm]
        );
    }

    public function scopeSearchLike(Builder $query, string $searchTerm): Builder
    {
        return $query->where(function ($q) use ($searchTerm) {
            $q->where('name', 'LIKE', "%{$searchTerm}%")
                ->orWhere('employee_code', 'LIKE', "%{$searchTerm}%")
                ->orWhere('email', 'LIKE', "%{$searchTerm}%");
        });
    }

    public function scopeWithRelevance(Builder $query, string $searchTerm): Builder
    {
        return $query->selectRaw(
            "*, MATCH(name, employee_code, email) AGAINST(? IN BOOLEAN MODE) as relevance",
            [$this->formatSearchTerm($searchTerm)]
        )->orderBy('relevance', 'desc');
    }

    private function formatSearchTerm(string $term): string
    {
        $terms = preg_split('/\s+/', trim($term));
        $formatted = '';
        foreach ($terms as $word) {
            if (strlen($word) > 0) {
                $formatted .= '+' . $word . ' ';
            }
        }
        return trim($formatted);
    }

     // ============================================
    // ✅ LOCAL SCOPES - Reusable queries
    // ============================================

    /**
     * Scope: Get only active employees
     */
    public function scopeActive(Builder $query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope: Get only inactive employees
     */
    public function scopeInactive(Builder $query)
    {
        return $query->where('status', 'inactive');
    }

    /**
     * Scope: Get senior employees (5+ years)
     */
    public function scopeSenior(Builder $query)
    {
        $fiveYearsAgo = now()->subYears(5);
        return $query->where('hire_date', '<=', $fiveYearsAgo);
    }

    /**
     * Scope: Get employees by department
     */
    public function scopeByDepartment(Builder $query, $departmentId)
    {
        return $query->where('department_id', $departmentId);
    }

    /**
     * Scope: Get employees with salary greater than
     */
    public function scopeSalaryGreaterThan(Builder $query, $amount)
    {
        return $query->where('salary', '>', $amount);
    }

    /**
     * Scope: Get employees hired after date
     */
    public function scopeHiredAfter(Builder $query, $date)
    {
        return $query->where('hire_date', '>=', $date);
    }

    /**
     * Scope: Get employees hired before date
     */
    public function scopeHiredBefore(Builder $query, $date)
    {
        return $query->where('hire_date', '<=', $date);
    }

    /**
     * Scope: Search by name
     */
    public function scopeSearchByName(Builder $query, $search)
    {
        return $query->where('name', 'LIKE', "%{$search}%");
    }

    /**
     * Scope: Get employees who have payrolls
     */
    public function scopeWithPayrolls(Builder $query)
    {
        return $query->has('payrolls');
    }

    /**
     * Scope: Get employees without payrolls
     */
    public function scopeWithoutPayrolls(Builder $query)
    {
        return $query->doesntHave('payrolls');
    }

    /**
     * Scope: Get employees with high salary (avg payroll > 50000)
     */
    public function scopeHighSalary(Builder $query)
    {
        return $query->whereHas('payrolls', function ($q) {
            $q->where('net_salary', '>', 50000);
        });
    }

    /**
     * Scope: Get employees with payroll count > N
     */
    public function scopeWithPayrollCountGreaterThan(Builder $query, $count)
    {
        return $query->has('payrolls', '>', $count);
    }

    /**
     * Scope: Get active senior employees (combined)
     */
    public function scopeActiveSenior(Builder $query)
    {
        return $query->active()->senior();
    }

    /**
     * Scope: Get employees by salary range
     */
    public function scopeSalaryBetween(Builder $query, $min, $max)
    {
        return $query->whereBetween('salary', [$min, $max]);
    }

    /**
     * Scope: Get employees hired this year
     */
    public function scopeHiredThisYear(Builder $query)
    {
        return $query->whereYear('hire_date', now()->year);
    }

    /**
     * Scope: Get employees by multiple departments
     */
    public function scopeInDepartments(Builder $query, array $departmentIds)
    {
        return $query->whereIn('department_id', $departmentIds);
    }

    /**
     * Scope: Get employees with eager loaded relationships
     */
    public function scopeWithDepartmentAndPosition(Builder $query)
    {
        return $query->with(['department', 'position']);
    }

    /**
     * Scope: Get employees ordered by name
     */
    public function scopeOrderByName(Builder $query)
    {
        return $query->orderBy('name', 'asc');
    }

    /**
     * Scope: Get employees with optional filter
     */
    public function scopeFilterByStatus(Builder $query, $status = null)
    {
        if ($status) {
            return $query->where('status', $status);
        }
        return $query;
    }

    // ============================================
    // ✅ GLOBAL SCOPES - Applied to ALL queries
    // ============================================

    protected static function booted()
    {
        // 1️⃣ Always order by name (default ordering)
        static::addGlobalScope('ordered', function (Builder $builder) {
            $builder->orderBy('name', 'asc');
        });

        // 2️⃣ Always show active employees (comment out if not needed)
        // static::addGlobalScope('active', function (Builder $builder) {
        //     $builder->where('status', 'active');
        // });

        // 3️⃣ Always exclude soft-deleted (built-in SoftDeletes handles this)
        // static::addGlobalScope('not_deleted', function (Builder $builder) {
        //     $builder->whereNull('deleted_at');
        // });

        // 4️⃣ Always eager load department (optional)
        // static::addGlobalScope('with_department', function (Builder $builder) {
        //     $builder->with('department');
        // });

        // 5️⃣ Always filter by tenant (multi-tenant app)
        // static::addGlobalScope('tenant', function (Builder $builder) {
        //     $builder->where('company_id', auth()->user()->company_id);
        // });
    }

    // ============================================
    // ✅ REMOVE GLOBAL SCOPES
    // ============================================

    /**
     * Remove the ordered scope
     */
    public function scopeWithoutOrderedScope(Builder $query)
    {
        return $query->withoutGlobalScope('ordered');
    }

    /**
     * Remove the active scope (if used)
     */
    public function scopeWithoutActiveScope(Builder $query)
    {
        return $query->withoutGlobalScope('active');
    }

    /**
     * Remove all global scopes
     */
    public function scopeWithoutAllScopes(Builder $query)
    {
        return $query->withoutGlobalScopes();
    }

    /**
     * Remove specific global scope by name
     */
    public function scopeWithoutScope(Builder $query, $scopeName)
    {
        return $query->withoutGlobalScope($scopeName);
    }
}
