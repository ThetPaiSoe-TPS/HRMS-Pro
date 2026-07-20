<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $superAdminRole = Role::firstOrCreate(
            ['slug' => 'super-admin'],
            ['name' => 'Super Admin']
        );

        $users = [
            [
                'name' => 'Super Admin',
                'email' => 'name1.admin@hrms.com',
                'password' => '123123123',
                'role' => 'super-admin', // Using role slug for lookup
            ],
            [
                'name' => 'Alice Department Manager',
                'email' => 'alice.manager@example.com',
                'password' => '123123123',
                'role' => 'department-manager',
            ],
            [
                'name' => 'Diana HR Manager',
                'email' => 'diana.hr@example.com',
                'password' => '123123123',
                'role' => 'hr-manager',
            ],
            [
                'name' => 'Bob Employee',
                'email' => 'bob.employee@example.com',
                'password' => '123123123',
                'role' => 'employee',
            ],
            [
                'name' => 'Charlie Employee',
                'email' => 'charlie.employee@example.com',
                'password' => '123123123',
                'role' => 'employee',
            ],
        ];

        foreach ($users as $userData) {
            // Find the role by slug
            $role = Role::where('slug', $userData['role'])->first();

            if (!$role) {
                // If role doesn't exist, create it
                $role = Role::create([
                    'name' => ucwords(str_replace('-', ' ', $userData['role'])),
                    'slug' => $userData['role'],
                ]);
            }

            User::updateOrCreate(
                ['email' => $userData['email']], // Search criteria
                [
                    'name' => $userData['name'],
                    'password' => Hash::make($userData['password']),
                    'role_id' => $role->id,
                    'email_verified_at' => now(), // Optional: auto-verify
                ]
            );
        }
    }
}
