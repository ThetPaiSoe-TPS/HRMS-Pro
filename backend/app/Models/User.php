<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable; // ✅ Notifiable is here

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role_id',
        'employee_id',
        'avatar',
        'department',
        'position',
        'join_date',
        'address',
        'bio',
        'years_experience',
        'total_projects',
        'last_login_at',
        'last_login_ip',
        'notification_settings',
    ];

    // ✅ REMOVE 'notification_settings' from $appends if you don't need it
    // Or keep it but add the accessor
    protected $appends = ['role_name', 'role_slug'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'notification_settings' => 'array',
        ];
    }

    // ✅ Relationships
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }

    public function getUnreadNotificationsCount()
    {
        try {
            return $this->unreadNotifications()->count();
        } catch (\Exception $e) {
            return 0;
        }
    }

    // ✅ Permission check
    public function hasPermission(string $permission): bool
    {
        return $this->role
            ? $this->role->permissions->contains('slug', $permission)
            : false;
    }

    public function getRoleNameAttribute(): ?string
    {
        return $this->role?->name;
    }

    public function getRoleSlugAttribute(): ?string
    {
        return $this->role?->slug;
    }

    // ✅ Notification settings

}
