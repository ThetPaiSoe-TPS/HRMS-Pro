<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = [
            [
                'employee_code' => 'EMP001',
                'name' => 'Aung Kyaw',
                'department_id' => 1, // Human Resources
                'position_id' => 1,   // HR Manager
                'phone' => '09450012345',
                'email' => 'aungkyaw.hr@hrms.com',
                'hire_date' => '2024-01-15',
                'status' => 'active',
            ],
            [
                'employee_code' => 'EMP002',
                'name' => 'Mya Mya',
                'department_id' => 2, // Sales & Marketing
                'position_id' => 2,   // Sales & Marketing Executive
                'phone' => '09510067890',
                'email' => 'myamya.sales@hrms.com',
                'hire_date' => '2025-03-10',
                'status' => 'active',
            ],
            [
                'employee_code' => 'EMP003',
                'name' => 'Ko Ko',
                'department_id' => 3, // Software Development
                'position_id' => 3,   // Software Engineer
                'phone' => '09790045678',
                'email' => 'koko.dev@hrms.com',
                'hire_date' => '2023-05-20',
                'status' => 'inactive',
            ],
        ];

        foreach ($employees as $employee) {
            DB::table('employees')->updateOrInsert(
                ['employee_code' => $employee['employee_code']],
                $employee
            );
        }
    }
}
