<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionLog extends Model
{
    protected $fillable = [
        'transaction_name',
        'status',
        'operations',
        'error_message',
        'execution_time',
        'is_transactional',
        'user_id',
    ];

    protected $casts = [
        'operations' => 'array',
    ];

    public function scopeSuccess($query)
    {
        return $query->where('status', 'success');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    public function scopeRolledBack($query)
    {
        return $query->where('status', 'rolled_back');
    }
}
