<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Seeder;

class SyncRolePermissionsSeeder extends Seeder
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
            ['name' => 'Update Payroll',       'slug' => 'payroll.update'],
            ['name' => 'Approve Payroll',      'slug' => 'payroll.approve'],
            ['name' => 'Pay Payroll',          'slug' => 'payroll.pay'],
            ['name' => 'View Salary',          'slug' => 'salary.view'],
            ['name' => 'Update Salary',        'slug' => 'salary.update'],
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
            ['name' => 'View Announcements',   'slug' => 'announcement.view'],
            ['name' => 'Create Announcements', 'slug' => 'announcement.create'],
            ['name' => 'Update Announcements', 'slug' => 'announcement.update'],
            ['name' => 'Delete Announcements', 'slug' => 'announcement.delete'],
            ['name' => 'Publish Announcements', 'slug' => 'announcement.publish'],
        ];

        $all = [];
        foreach ($permissions as $p) {
            $all[] = Permission::firstOrCreate(['slug' => $p['slug']], $p);
        }

        $superAdmin = Role::firstOrCreate(['slug' => 'super-admin'], ['name' => 'Super Admin']);
        $hrManager  = Role::firstOrCreate(['slug' => 'hr-manager'],      ['name' => 'HR Manager']);
        $deptMgr    = Role::firstOrCreate(['slug' => 'dept-manager'],    ['name' => 'Department Manager']);
        $employee   = Role::firstOrCreate(['slug' => 'employee'],        ['name' => 'Employee']);

        // ✅ Super Admin gets ALL permissions including announcements
        $superAdmin->permissions()->sync(Permission::all()->pluck('id'));

        // ✅ HR Manager gets announcement permissions
        $hrManager->permissions()->sync(Permission::whereIn('slug', [
            'employee.view',
            'employee.create',
            'employee.update',
            'employee.delete',
            'department.view',
            'position.view',
            'attendance.view',
            'attendance.create',
            'attendance.update',
            'leave.view',
            'leave.create',
            'leave.approve',
            'leave.reject',
            'payroll.view',
            'payroll.generate',
            'salary.view',
            'report.view',
            'user.view',
            'role.view',
            // ✅ Add announcement permissions for HR Manager
            'announcement.view',
            'announcement.create',
            'announcement.update',
            'announcement.publish',
        ])->pluck('id'));

        // ✅ Department Manager gets view permission
        $deptMgr->permissions()->sync(Permission::whereIn('slug', [
            'employee.view',
            'employee.create',
            'employee.update',
            'department.view',
            'position.view',
            'attendance.view',
            'attendance.create',
            'attendance.update',
            'leave.view',
            'leave.create',
            'leave.approve',
            'leave.reject',
            'payroll.view',
            'payroll.generate',
            'report.view',
            'user.view',
            // ✅ Department Manager can view announcements
            'announcement.view',
        ])->pluck('id'));

        // ✅ Employee gets view permission
        $employee->permissions()->sync(Permission::whereIn('slug', [
            'attendance.view',
            'attendance.create',
            'leave.view',
            'leave.create',
            'payroll.view',
            // ✅ Employee can view announcements
            'announcement.view',
        ])->pluck('id'));
    }
}
