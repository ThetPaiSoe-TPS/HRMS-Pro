File 19: Data Migration Strategy
1. Migration Overview
Migration Types
text
┌─────────────────────────────────────────────────────┐
│                  Migration Types                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. Schema Migration                                 │
│     ├── New Tables                                  │
│     ├── Table Modifications                         │
│     ├── Index Creation                              │
│     └── Constraint Updates                          │
│                                                     │
│  2. Data Migration                                  │
│     ├── CSV Import                                  │
│     ├── Excel Import                                │
│     ├── Database Migration                          │
│     └── API Data Sync                               │
│                                                     │
│  3. Rollback Strategy                               │
│     ├── Schema Rollback                             │
│     ├── Data Rollback                               │
│     └── Version Management                          │
│                                                     │
└─────────────────────────────────────────────────────┘
2. Migration Files
Schema Migrations
php
// 2024_01_01_000001_create_employees_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('employee_code')->unique();
            $table->foreignId('user_id')->nullable()->constrained();
            $table->foreignId('department_id')->constrained();
            $table->foreignId('position_id')->constrained();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->enum('gender', ['male', 'female', 'other']);
            $table->date('date_of_birth');
            $table->date('hire_date');
            $table->enum('employment_status', ['active', 'resigned', 'terminated'])->default('active');
            $table->softDeletes();
            $table->timestamps();
            
            $table->index(['employee_code', 'email']);
            $table->index(['department_id', 'position_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('employees');
    }
};

// 2024_01_01_000002_create_attendance_records_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('attendance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->time('check_in')->nullable();
            $table->time('check_out')->nullable();
            $table->enum('status', ['present', 'absent', 'late', 'half_day'])->default('present');
            $table->integer('work_hours')->nullable();
            $table->integer('overtime_hours')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->unique(['employee_id', 'date']);
            $table->index('date');
            $table->index('status');
        });
    }

    public function down()
    {
        Schema::dropIfExists('attendance_records');
    }
};
Data Seeding
php
// DatabaseSeeder.php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use App\Models\Department;
use App\Models\Position;
use App\Models\Employee;
use App\Models\CompanySetting;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            // Basic Data
            RolesAndPermissionsSeeder::class,
            CompanySettingsSeeder::class,
            
            // Master Data
            DepartmentsSeeder::class,
            PositionsSeeder::class,
            HolidaySeeder::class,
            
            // Demo Data
            AdminUserSeeder::class,
            EmployeeSeeder::class,
            AttendanceSeeder::class,
            LeaveSeeder::class,
            PayrollSeeder::class,
        ]);
    }
}

// RolesAndPermissionsSeeder.php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        // Create permissions
        $permissions = [
            'employee.view', 'employee.create', 'employee.update', 'employee.delete',
            'department.view', 'department.create', 'department.update', 'department.delete',
            'position.view', 'position.create', 'position.update', 'position.delete',
            'attendance.view', 'attendance.create', 'attendance.update',
            'leave.view', 'leave.create', 'leave.approve', 'leave.reject',
            'payroll.view', 'payroll.generate',
            'report.view',
            'user.view', 'user.create', 'user.update', 'user.delete',
            'role.view', 'role.create', 'role.update', 'role.delete',
            'setting.update',
        ];
        
        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'api']);
        }
        
        // Create roles and assign permissions
        $adminRole = Role::create(['name' => 'super_admin', 'guard_name' => 'api']);
        $adminRole->givePermissionTo(Permission::all());
        
        $hrRole = Role::create(['name' => 'hr_manager', 'guard_name' => 'api']);
        $hrRole->givePermissionTo([
            'employee.view', 'employee.create', 'employee.update',
            'department.view',
            'position.view',
            'attendance.view', 'attendance.create', 'attendance.update',
            'leave.view', 'leave.approve', 'leave.reject',
            'payroll.view', 'payroll.generate',
            'report.view',
        ]);
        
        // Continue for other roles...
    }
}
3. CSV Import/Export
Import Functionality
php
<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Department;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\EmployeeImport;

class DataImportService
{
    public function importEmployees($file)
    {
        $import = new EmployeeImport();
        Excel::import($import, $file);
        
        return [
            'success' => true,
            'message' => 'Employees imported successfully',
            'imported' => $import->getImportedCount(),
            'errors' => $import->getErrors()
        ];
    }
    
    public function validateImportData($data)
    {
        $rules = [
            'employee_code' => 'required|unique:employees,employee_code',
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'email' => 'required|email|unique:employees,email',
            'department' => 'required|exists:departments,name',
            'position' => 'required|exists:positions,name',
            'hire_date' => 'required|date',
            'basic_salary' => 'required|numeric|min:0',
        ];
        
        $validator = Validator::make($data, $rules);
        
        if ($validator->fails()) {
            return ['errors' => $validator->errors()];
        }
        
        return ['valid' => true];
    }
}
CSV Template
csv
employee_code,first_name,last_name,email,phone,gender,date_of_birth,hire_date,department,position,basic_salary
EMP001,John,Doe,john@company.com,1234567890,Male,1990-01-15,2020-01-01,Engineering,Senior Developer,50000
EMP002,Jane,Smith,jane@company.com,0987654321,Female,1992-03-20,2020-06-15,Engineering,Developer,40000
4. Migration Process
Migration Workflow
text
┌─────────────────────────────────────────────────────┐
│              Migration Process Flow                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. Backup Current Data                             │
│     ↓                                              │
│  2. Run Migrations                                 │
│     ↓                                              │
│  3. Seed Data                                      │
│     ↓                                              │
│  4. Validate Migration                             │
│     ↓                                              │
│  5. Test Application                               │
│     ↓                                              │
│  6. Deploy Update                                  │
│     ↓                                              │
│  7. Monitor Performance                            │
│                                                     │
└─────────────────────────────────────────────────────┘
Deployment Script
bash
#!/bin/bash

# deploy.sh
echo "Starting deployment..."

# Enter maintenance mode
php artisan down

# Pull latest changes
git pull origin main

# Install dependencies
composer install --no-interaction --no-dev --optimize-autoloader
npm install
npm run build

# Run migrations
php artisan migrate --force

# Clear and cache
php artisan optimize:clear
php artisan optimize

# Exit maintenance mode
php artisan up

echo "Deployment completed!"