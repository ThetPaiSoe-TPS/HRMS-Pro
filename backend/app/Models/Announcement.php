<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Announcement extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'content',
        'summary',
        'type',
        'priority',
        'status',
        'is_pinned',
        'is_important',
        'target_type',
        'target_id',
        'start_date',
        'end_date',
        'created_by',
        'published_at',
    ];

    protected $casts = [
        'is_pinned' => 'boolean',
        'is_important' => 'boolean',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'published_at' => 'datetime',
    ];

    protected $appends = ['view_count', 'can_edit', 'can_delete'];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function attachments()
    {
        return $this->hasMany(AnnouncementAttachment::class);
    }

    public function views()
    {
        return $this->hasMany(AnnouncementView::class);
    }

    public function notifications()
    {
        return $this->hasMany(AnnouncementNotification::class);
    }

    public function getViewCountAttribute()
    {
        return $this->views()->count();
    }

    public function getCanEditAttribute()
    {
        return $this->status !== 'published' && $this->status !== 'archived';
    }

    public function getCanDeleteAttribute()
    {
        return $this->status !== 'archived';
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published')
            ->where(function ($q) {
                $q->whereNull('start_date')
                    ->orWhere('start_date', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>=', now());
            });
    }

    public function scopePinned($query)
    {
        return $query->where('is_pinned', true);
    }

    public function scopeImportant($query)
    {
        return $query->where('is_important', true);
    }

    public function scopeTargetedTo($query, $user)
    {
        return $query->where(function ($q) use ($user) {
            $q->where('target_type', 'all')
                ->orWhere(function ($q) use ($user) {
                    $q->where('target_type', 'department')
                        ->where('target_id', $user->employee?->department_id);
                })
                ->orWhere(function ($q) use ($user) {
                    $q->where('target_type', 'role')
                        ->where('target_id', $user->role_id);
                })
                ->orWhere(function ($q) use ($user) {
                    $q->where('target_type', 'specific')
                        ->where('target_id', $user->id);
                });
        });
    }
}
