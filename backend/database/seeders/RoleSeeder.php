<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'HR Junior',
                'slug' => Str::slug('HR Junior'),
            ],
            [
                'name' => 'Sale & Marketing Manager',
                'slug' => Str::slug('Sale & Marketing Manager'),
            ],
            [
                'name' => 'Software Junior',
                'slug' => Str::slug('Software Junior'),
            ],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
