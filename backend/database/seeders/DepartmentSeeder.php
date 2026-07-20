<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            [
                'name' => 'Human Resources',
                'code' => 'HR001',
                'description' => 'Handles recruitment, employee relations, and payroll.',
            ],
            [
                'name' => 'Sales & Marketing',
                'code' => 'SM002',
                'description' => 'Focuses on customer acquisition, branding, and promotions.',
            ],
            [
                'name' => 'Software Development',
                'code' => 'SW003',
                'description' => 'Responsible for building and maintaining applications.',
            ],
        ];

        foreach ($departments as $department) {
            DB::table('departments')->updateOrInsert(
                ['code' => $department['code']],
                $department
            );
        }
    }
}
