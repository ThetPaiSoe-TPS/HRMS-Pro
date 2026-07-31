<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class SearchDemoRecord extends Model
{
    protected $fillable = [
        'title',
        'content',
        'category',
    ];

    public function scopeSearchFullText(Builder $query, string $searchTerm): Builder
    {
        return $query->whereRaw(
            "MATCH(title, content) AGAINST(? IN BOOLEAN MODE)",
            [$this->formatSearchTerm($searchTerm)]
        );
    }

    public function scopeSearchLike(Builder $query, string $searchTerm): Builder
    {
        return $query->where(function ($q) use ($searchTerm) {
            $q->where('title', 'LIKE', "%{$searchTerm}%")
                ->orWhere('content', 'LIKE', "%{$searchTerm}%");
        });
    }

    private function formatSearchTerm(string $term): string
    {
        // Split terms and format for boolean mode
        $terms = preg_split('/\s+/', trim($term));
        $formatted = '';
        foreach ($terms as $word) {
            if (strlen($word) > 0) {
                $formatted .= '+' . $word . ' ';
            }
        }
        return trim($formatted);
    }

    public function scopeWithRelevance(Builder $query, string $searchTerm): Builder
    {
        return $query->selectRaw(
            "*, MATCH(title, content) AGAINST(? IN BOOLEAN MODE) as relevance",
            [$this->formatSearchTerm($searchTerm)]
        )->orderBy('relevance', 'desc');
    }
}
