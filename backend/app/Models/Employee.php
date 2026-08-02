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
    ];

    // ============================================
    // ✅ RELATIONSHIPS - ADD THESE!
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

    /**
     * ✅ Employee has many Payrolls
     */
    public function payrolls()
    {
        return $this->hasMany(Payroll::class);
    }

    /**
     * ✅ Employee has many Leaves
     */
    public function leaves()
    {
        return $this->hasMany(LeaveRequest::class);
    }

    /**
     * ✅ Employee has many Attendances
     */
    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    /**
     * ✅ Employee has many Salary Records
     */
    public function salaries()
    {
        return $this->hasMany(EmployeeSalary::class);
    }

    // ============================================
    // ✅ SCOPES
    // ============================================

    /**
     * Full-text search using MySQL MATCH...AGAINST
     */
    public function scopeSearchFullText(Builder $query, string $searchTerm): Builder
    {
        return $query->whereRaw(
            "MATCH(name, employee_code, email) AGAINST(? IN BOOLEAN MODE)",
            [$this->formatSearchTerm($searchTerm)]
        );
    }

    /**
     * Natural language full-text search
     */
    public function scopeSearchNatural(Builder $query, string $searchTerm): Builder
    {
        return $query->whereRaw(
            "MATCH(name, employee_code, email) AGAINST(? IN NATURAL LANGUAGE MODE)",
            [$searchTerm]
        );
    }

    /**
     * Traditional LIKE search for comparison
     */
    public function scopeSearchLike(Builder $query, string $searchTerm): Builder
    {
        return $query->where(function ($q) use ($searchTerm) {
            $q->where('name', 'LIKE', "%{$searchTerm}%")
                ->orWhere('employee_code', 'LIKE', "%{$searchTerm}%")
                ->orWhere('email', 'LIKE', "%{$searchTerm}%");
        });
    }

    /**
     * Get relevance score
     */
    public function scopeWithRelevance(Builder $query, string $searchTerm): Builder
    {
        return $query->selectRaw(
            "*, MATCH(name, employee_code, email) AGAINST(? IN BOOLEAN MODE) as relevance",
            [$this->formatSearchTerm($searchTerm)]
        )->orderBy('relevance', 'desc');
    }

    /**
     * Format search term for boolean mode
     */
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
    // ✅ ATTRIBUTES (Accessors)
    // ============================================

    // ✅ These accessors need actual columns
    // In your table: name (single field), not first_name + last_name
    public function getFullNameAttribute()
    {
        return $this->name;  // Use 'name' since you have a single name field
    }

    public function getTotalEarningsAttribute()
    {
        return $this->payrolls()->sum('net_salary');
    }

    public function getIsSeniorAttribute()
    {
        // Calculate years of experience from hire_date
        if ($this->hire_date) {
            $years = now()->diffInYears($this->hire_date);
            return $years > 5;
        }
        return false;
    }

    public function getSalaryGradeAttribute()
    {
        // You need a 'salary' column, or calculate from payrolls
        $avgSalary = $this->payrolls()->avg('net_salary') ?? 0;

        if ($avgSalary > 80000) return 'A';
        if ($avgSalary > 50000) return 'B';
        return 'C';
    }

    // ✅ Which attributes to append
    protected $appends = ['full_name', 'total_earnings', 'is_senior', 'salary_grade'];


}
