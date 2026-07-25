<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'manager_id',
        'status',
    ];

    protected $appends = ['employees_count'];

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }

    public function positions()
    {
        return $this->hasMany(Position::class);
    }

    public function manager()
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }

    public function getEmployeesCountAttribute()
    {
        return $this->employees()->count();
    }
}
