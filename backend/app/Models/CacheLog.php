<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CacheLog extends Model
{
    protected $fillable = [
        'key',
        'query',
        'without_cache_time',
        'with_cache_time',
        'result_count',
        'cache_hit',
        'user_id',
    ];

    protected $casts = [
        'without_cache_time' => 'decimal:4',
        'with_cache_time' => 'decimal:4',
        'cache_hit' => 'boolean',
    ];

    public function scopeHits($query)
    {
        return $query->where('cache_hit', true);
    }

    public function scopeMisses($query)
    {
        return $query->where('cache_hit', false);
    }
}
