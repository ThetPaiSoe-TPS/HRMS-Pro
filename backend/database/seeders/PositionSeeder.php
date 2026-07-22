<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PositionSeeder extends Seeder
{
    public function run()
    {
        DB::table('positions')->insert([
            [
                'title' => 'HR Assistant',
                'department_id' => 1, // assumes Human Resources department exists
                'description' => 'Staff recruitment, employee relations, and HR policies.',
                'salary_range' => '400000-500000',
            ],
            [
                'title'         => 'Sales & Marketing Assistant',
                'department_id' => 2, // assumes Sales & Marketing department exists
                'description'   => 'Supports the manager with client outreach, prepares promotional materials, and assists in organizing campaigns.',
                'salary_range'  => '600,000 - 900,000 MMK',
            ],

            [
                'title' => 'Sales & Marketing Manager',
                'department_id' => 2, // assumes Sales & Marketing department exists
                'description' => 'Handles client acquisition, branding campaigns, and promotions.',
                'salary_range' => '1500000- 200000 MMK',
            ],
            [
                'title' => 'Software Engineer',
                'department_id' => 3, // assumes Software Development department exists
                'description' => 'Develops and maintains software applications and systems.',
                'salary_range' => '100000- 1500000 MMK',
            ],

        ]);
    }
}
