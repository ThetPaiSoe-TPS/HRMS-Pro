<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

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
    ];

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
}
