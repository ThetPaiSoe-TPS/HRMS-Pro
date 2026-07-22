<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Seeder;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            ['name' => 'View Employees',       'slug' => 'employee.view'],
            ['name' => 'Create Employees',     'slug' => 'employee.create'],
            ['name' => 'Update Employees',     'slug' => 'employee.update'],
            ['name' => 'Delete Employees',     'slug' => 'employee.delete'],
            ['name' => 'View Departments',     'slug' => 'department.view'],
            ['name' => 'Create Departments',   'slug' => 'department.create'],
            ['name' => 'Update Departments',   'slug' => 'department.update'],
            ['name' => 'Delete Departments',   'slug' => 'department.delete'],
            ['name' => 'View Positions',       'slug' => 'position.view'],
            ['name' => 'Create Positions',     'slug' => 'position.create'],
            ['name' => 'Update Positions',     'slug' => 'position.update'],
            ['name' => 'Delete Positions',     'slug' => 'position.delete'],
            ['name' => 'View Attendance',      'slug' => 'attendance.view'],
            ['name' => 'Create Attendance',    'slug' => 'attendance.create'],
            ['name' => 'Update Attendance',    'slug' => 'attendance.update'],
            ['name' => 'View Leave',           'slug' => 'leave.view'],
            ['name' => 'Create Leave',         'slug' => 'leave.create'],
            ['name' => 'Approve Leave',        'slug' => 'leave.approve'],
            ['name' => 'Reject Leave',         'slug' => 'leave.reject'],
            ['name' => 'View Payroll',         'slug' => 'payroll.view'],
            ['name' => 'Generate Payroll',     'slug' => 'payroll.generate'],
            ['name' => 'View Reports',         'slug' => 'report.view'],
            ['name' => 'View Users',           'slug' => 'user.view'],
            ['name' => 'Create Users',         'slug' => 'user.create'],
            ['name' => 'Update Users',         'slug' => 'user.update'],
            ['name' => 'Delete Users',         'slug' => 'user.delete'],
            ['name' => 'View Roles',           'slug' => 'role.view'],
            ['name' => 'Create Roles',         'slug' => 'role.create'],
            ['name' => 'Update Roles',         'slug' => 'role.update'],
            ['name' => 'Delete Roles',         'slug' => 'role.delete'],
            ['name' => 'Update Settings',      'slug' => 'setting.update'],
        ];

        foreach ($permissions as $p) {
            Permission::firstOrCreate(['slug'=> $p['slug']], $p);
        }

        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin', 'slug' => 'super-admin']);
        $hrManager  = Role::firstOrCreate(['name' => 'HR Manager',  'slug' => 'hr-manager']);
        $deptMgr    = Role::firstOrCreate(['name' => 'Department Manager', 'slug' => 'dept-manager']);
        $employee   = Role::firstOrCreate(['name' => 'Employee',    'slug' => 'employee']);

        $superAdmin->permissions()->attach(Permission::all());

        $hrManager->permissions()->attach(Permission::whereIn('slug', [
            'employee.view', 'employee.create', 'employee.update',
            'department.view',
            'position.view',
            'attendance.view', 'attendance.create',
            'leave.view', 'leave.create', 'leave.approve', 'leave.reject',
            'payroll.view', 'payroll.generate',
            'report.view',
            'user.view',
            'role.view',
        ])->get());

        $deptMgr->permissions()->attach(Permission::whereIn('slug', [
            'employee.view',
            'attendance.view',
            'leave.view', 'leave.create', 'leave.approve',
            'report.view',
        ])->get());

        $employee->permissions()->attach(Permission::whereIn('slug', [
            'employee.view', 'generate',
            'attendance.view', 'attendance.create',
            'leave.view', 'leave.create',
            'profile.view', 'payroll.view', 'salary.view'
        ])->get());
    }
}
