<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $superAdminRole = Role::firstOrCreate(
            ['slug' => 'super-admin'],
            ['name' => 'Super Admin']
        );

        User::firstOrCreate(
            ['email' => 'name1.admin@hrms.com'],
            [
                'name'     => 'Super Admin',
                'password' => bcrypt('123123123'),
                'role_id'  => $superAdminRole->id,
            ]
        );
    }
}