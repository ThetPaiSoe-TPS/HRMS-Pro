<?php

use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\LogoutController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Auth\ProfileController;
use App\Http\Controllers\Api\User\UserController;
use App\Http\Controllers\Api\Role\RoleController;
use App\Http\Controllers\Api\Permission\PermissionController;
use App\Http\Controllers\Api\Department\DepartmentController;
use App\Http\Controllers\Api\Position\PositionController;
use App\Http\Controllers\Api\Employee\EmployeeController;
use App\Http\Controllers\Api\Employee\EmployeeExportController;
use App\Http\Controllers\Api\Attendance\AttendanceController;
use App\Http\Controllers\Api\Leave\LeaveController;
use App\Http\Controllers\Api\Payroll\PayrollController;
use App\Http\Controllers\Api\Report\ReportController;
use App\Http\Controllers\Api\Setting\CompanySettingController;
use App\Http\Controllers\Api\Profile\ProfileController as UserProfileController;
use App\Http\Controllers\Api\Dashboard\DashboardController;
use App\Http\Controllers\Api\ExplainController;
use App\Http\Controllers\Api\IndexingController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\TransactionDemoController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Base URL: /api/v1
| Auth: Laravel Sanctum (Authorization: Bearer TOKEN)
| Standard response: { success, message, data | errors }
|
*/

Route::prefix('v1')->group(function () {

    /*
    |------------------------------------------------------------------
    | Sprint 1: Authentication / Users / Roles / Permissions
    |------------------------------------------------------------------
    */
    Route::prefix('auth')->group(function () {
        Route::post('login', [LoginController::class, 'login']);
        Route::post('register', [RegisterController::class, 'register']);
        Route::post('logout', [LogoutController::class, 'logout'])->middleware('auth:sanctum');
        Route::get('profile', [ProfileController::class, 'show'])->middleware('auth:sanctum');
        Route::put('profile', [ProfileController::class, 'update'])->middleware(['auth:sanctum', 'log.activity'])->name('profile.update');
        Route::post('profile/avatar', [ProfileController::class, 'uploadAvatar'])->middleware('auth:sanctum');
        Route::get('profile/activities', [\App\Http\Controllers\Api\Profile\ProfileController::class, 'activities'])->middleware('auth:sanctum');
        Route::put('change-password', [ProfileController::class, 'changePassword'])->middleware(['auth:sanctum', 'log.activity'])->name('password.update');
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('users', [UserController::class, 'index'])->middleware('permission:user.view');
        Route::post('users', [UserController::class, 'store'])->middleware('permission:user.create');
        Route::get('users/{user}', [UserController::class, 'show'])->middleware('permission:user.view');
        Route::put('users/{user}', [UserController::class, 'update'])->middleware('permission:user.update');
        Route::delete('users/{user}', [UserController::class, 'destroy'])->middleware('permission:user.delete');

        Route::get('roles', [RoleController::class, 'index'])->middleware('permission:role.view');
        Route::post('roles', [RoleController::class, 'store'])->middleware('permission:role.create');
        Route::get('roles/{role}', [RoleController::class, 'show'])->middleware('permission:role.view');
        Route::put('roles/{role}', [RoleController::class, 'update'])->middleware('permission:role.update');
        Route::delete('roles/{role}', [RoleController::class, 'destroy'])->middleware('permission:role.delete');

        Route::get('permissions', [PermissionController::class, 'index'])->middleware('permission:role.view');
        Route::post('permissions', [PermissionController::class, 'store'])->middleware('permission:role.create');
        Route::get('permissions/{permission}', [PermissionController::class, 'show'])->middleware('permission:role.view');
        Route::put('permissions/{permission}', [PermissionController::class, 'update'])->middleware('permission:role.update');
        Route::delete('permissions/{permission}', [PermissionController::class, 'destroy'])->middleware('permission:role.delete');

        /*
        |------------------------------------------------------------------
        | Sprint 2: Departments / Positions
        |------------------------------------------------------------------
        */
        Route::get('departments', [DepartmentController::class, 'index'])->middleware('permission:department.view');
        Route::post('departments', [DepartmentController::class, 'store'])->middleware('permission:department.create');
        Route::get('departments/{department}', [DepartmentController::class, 'show'])->middleware('permission:department.view');
        Route::put('departments/{department}', [DepartmentController::class, 'update'])->middleware('permission:department.update');
        Route::delete('departments/{department}', [DepartmentController::class, 'destroy'])->middleware('permission:department.delete');

        Route::get('positions', [PositionController::class, 'index'])->middleware('permission:position.view');
        Route::post('positions', [PositionController::class, 'store'])->middleware('permission:position.create');
        Route::get('positions/{position}', [PositionController::class, 'show'])->middleware('permission:position.view');
        Route::put('positions/{position}', [PositionController::class, 'update'])->middleware('permission:position.update');
        Route::delete('positions/{position}', [PositionController::class, 'destroy'])->middleware('permission:position.delete');

        /*
        |------------------------------------------------------------------
        | Sprint 3: Employees
        |------------------------------------------------------------------
        */
        Route::get('employees/export', [EmployeeExportController::class, 'export'])->middleware('permission:employee.view');
        Route::get('employees/generate-code', [EmployeeController::class, 'generateCode']); // <-- ADD THIS LINE
        Route::get('employees/trash', [EmployeeController::class, 'trash'])->middleware('permission:employee.view');
        Route::get('employees/trash-count', [EmployeeController::class, 'trashCount'])->middleware('permission:employee.view');
        Route::post('employees/{employee}/restore', [EmployeeController::class, 'restore'])->middleware('permission:employee.update');
        Route::delete('employees/{employee}/force', [EmployeeController::class, 'forceDelete'])->middleware('permission:employee.delete');
        Route::get('employees', [EmployeeController::class, 'index'])->middleware('permission:employee.view');
        Route::post('employees', [EmployeeController::class, 'store'])->middleware('permission:employee.create');
        Route::get('employees/{employee}', [EmployeeController::class, 'show'])->middleware('permission:employee.view');
        Route::put('employees/{employee}', [EmployeeController::class, 'update'])->middleware('permission:employee.update');
        Route::delete('employees/{employee}', [EmployeeController::class, 'destroy'])->middleware('permission:employee.delete');
        Route::post('employees/{employee}/photo', [EmployeeController::class, 'uploadPhoto'])->middleware('permission:employee.update');
        Route::delete('employees/{employee}/photo', [EmployeeController::class, 'deletePhoto'])->middleware('permission:employee.update');
    });

    /*
    |------------------------------------------------------------------
    | Sprint 4: Attendance
    |------------------------------------------------------------------
    */
    Route::prefix('attendance')->middleware(['auth:sanctum', 'permission:attendance.view'])->group(function () {
        Route::get('/', [AttendanceController::class, 'index']);
        Route::get('summary', [AttendanceController::class, 'summary'])->middleware('permission:attendance.view');
        Route::post('check-in', [AttendanceController::class, 'checkIn'])->withoutMiddleware('permission:attendance.view')->middleware('permission:attendance.create');
        Route::post('check-out', [AttendanceController::class, 'checkOut'])->withoutMiddleware('permission:attendance.view')->middleware('permission:attendance.create');
        Route::get('{attendance}', [AttendanceController::class, 'show']);
        Route::put('{attendance}', [AttendanceController::class, 'update'])->withoutMiddleware('permission:attendance.view')->middleware('permission:attendance.update');
        Route::delete('{attendance}', [AttendanceController::class, 'destroy'])->withoutMiddleware('permission:attendance.view')->middleware('permission:attendance.update');
    });

    /*
    |------------------------------------------------------------------
    | Sprint 5: Leave
    |------------------------------------------------------------------
    */
    Route::middleware(['auth:sanctum'])->group(function () {
        // Leave Types
        Route::get('leave-types/active', [\App\Http\Controllers\Api\Leave\LeaveTypeController::class, 'getActiveTypes']);
        Route::get('leave-types', [\App\Http\Controllers\Api\Leave\LeaveTypeController::class, 'index'])->middleware('permission:leave.view');
        Route::post('leave-types', [\App\Http\Controllers\Api\Leave\LeaveTypeController::class, 'store'])->middleware('permission:leave.create');
        Route::get('leave-types/{leave_type}', [\App\Http\Controllers\Api\Leave\LeaveTypeController::class, 'show'])->middleware('permission:leave.view');
        Route::put('leave-types/{leave_type}', [\App\Http\Controllers\Api\Leave\LeaveTypeController::class, 'update'])->middleware('permission:leave.update');
        Route::delete('leave-types/{leave_type}', [\App\Http\Controllers\Api\Leave\LeaveTypeController::class, 'destroy'])->middleware('permission:leave.delete');

        // Leave Requests
        Route::get('leave-requests/balance', [\App\Http\Controllers\Api\Leave\LeaveController::class, 'getBalance']);
        Route::get('leave-requests', [\App\Http\Controllers\Api\Leave\LeaveController::class, 'index'])->middleware('permission:leave.view');
        Route::post('leave-requests', [\App\Http\Controllers\Api\Leave\LeaveController::class, 'store'])->middleware('permission:leave.create');
        Route::get('leave-requests/{leave_request}', [\App\Http\Controllers\Api\Leave\LeaveController::class, 'show'])->middleware('permission:leave.view');
        Route::put('leave-requests/{leave_request}', [\App\Http\Controllers\Api\Leave\LeaveController::class, 'update'])->middleware('permission:leave.update');
        Route::delete('leave-requests/{leave_request}', [\App\Http\Controllers\Api\Leave\LeaveController::class, 'destroy'])->middleware('permission:leave.delete');
        Route::post('leave-requests/{leave_request}/approve', [\App\Http\Controllers\Api\Leave\LeaveController::class, 'approve'])->middleware('permission:leave.approve');
        Route::post('leave-requests/{leave_request}/reject', [\App\Http\Controllers\Api\Leave\LeaveController::class, 'reject'])->middleware('permission:leave.reject');
        Route::post('leave-requests/{leave_request}/attachment', [\App\Http\Controllers\Api\Leave\LeaveController::class, 'uploadAttachment'])->middleware('permission:leave.create');
    });

    /*
    |------------------------------------------------------------------
    | Sprint 6: Payroll
    |------------------------------------------------------------------
    */
    Route::prefix('payrolls')->middleware('auth:sanctum')->group(function () {
        // Main payroll endpoints
        Route::get('/', [PayrollController::class, 'index'])->middleware('permission:payroll.view');
        Route::get('/dashboard', [PayrollController::class, 'dashboard'])->middleware('permission:payroll.view');
        Route::post('/generate', [PayrollController::class, 'generate'])->middleware('permission:payroll.generate');
        Route::get('/{payroll}', [PayrollController::class, 'show'])->middleware('permission:payroll.view');

        // Payroll actions
        Route::post('/{payroll}/calculate', [PayrollController::class, 'calculate'])->middleware('permission:payroll.update');
        Route::post('/{payroll}/submit', [PayrollController::class, 'submitForApproval'])->middleware('permission:payroll.update');
        Route::post('/{payroll}/approve', [PayrollController::class, 'approve'])->middleware('permission:payroll.approve');
        Route::post('/{payroll}/mark-paid', [PayrollController::class, 'markAsPaid'])->middleware('permission:payroll.update');
        Route::post('/{payroll}/cancel', [PayrollController::class, 'cancel'])->middleware('permission:payroll.update');
    });


    Route::prefix('employees')->middleware('auth:sanctum')->group(function () {
        Route::put('{employee}/salary', [PayrollController::class, 'updateEmployeeSalary'])->middleware('permission:salary.update');
        Route::get('generate-code', [EmployeeController::class, 'generateCode']);
    });

    /*
    |------------------------------------------------------------------
    | Sprint 7: Reports / Dashboard / Settings / Profile
    |------------------------------------------------------------------
    */
    Route::prefix('reports')->middleware(['auth:sanctum', 'permission:report.view'])->group(function () {
        Route::get('employees', [ReportController::class, 'employees']);
        Route::get('attendance', [ReportController::class, 'attendance']);
        Route::get('leave', [ReportController::class, 'leave']);
        Route::get('payroll', [ReportController::class, 'payroll']);
        Route::get('{type}/export', [ReportController::class, 'export']); // Add this
        Route::get('{type}/stats', [ReportController::class, 'stats']);  //
    });

    Route::prefix('dashboard')->middleware('auth:sanctum')->group(function () {
        Route::get('statistics', [DashboardController::class, 'statistics']);
        Route::get('charts', [DashboardController::class, 'charts']);
        Route::get('recent-activities', [DashboardController::class, 'recentActivities']);
        Route::get('upcoming-holidays', [DashboardController::class, 'upcomingHolidays']);
    });

    Route::prefix('settings')->middleware(['auth:sanctum'])->group(function () {
        Route::get('company', [CompanySettingController::class, 'show'])->middleware('permission:setting.update');
        Route::put('company', [CompanySettingController::class, 'update'])->middleware('permission:setting.update');
        Route::get('payroll', [PayrollController::class, 'settings'])->middleware('permission:payroll.view');
        Route::put('payroll', [PayrollController::class, 'updateSettings'])->middleware('permission:payroll.update');
    });

    Route::prefix('profile')->middleware('auth:sanctum')->group(function () {
        Route::get('/', [UserProfileController::class, 'show']);
        Route::put('/', [UserProfileController::class, 'update']);
        Route::put('change-password', [UserProfileController::class, 'changePassword']);
    });

    // Announcements
    Route::prefix('announcements')->middleware(['auth:sanctum'])->group(function () {
        Route::get('dashboard', [App\Http\Controllers\Api\Announcement\AnnouncementController::class, 'dashboard']);
        Route::get('stats', [App\Http\Controllers\Api\Announcement\AnnouncementController::class, 'stats']);
        Route::get('/', [App\Http\Controllers\Api\Announcement\AnnouncementController::class, 'index']);
        Route::post('/', [App\Http\Controllers\Api\Announcement\AnnouncementController::class, 'store'])->middleware('permission:announcement.create');
        Route::get('{id}', [App\Http\Controllers\Api\Announcement\AnnouncementController::class, 'show']);
        Route::put('{id}', [App\Http\Controllers\Api\Announcement\AnnouncementController::class, 'update'])->middleware('permission:announcement.update');
        Route::delete('{id}', [App\Http\Controllers\Api\Announcement\AnnouncementController::class, 'destroy'])->middleware('permission:announcement.delete');
        Route::post('{id}/publish', [App\Http\Controllers\Api\Announcement\AnnouncementController::class, 'publish'])->middleware('permission:announcement.update');
        Route::post('{id}/archive', [App\Http\Controllers\Api\Announcement\AnnouncementController::class, 'archive'])->middleware('permission:announcement.update');
        Route::post('{id}/pin', [App\Http\Controllers\Api\Announcement\AnnouncementController::class, 'pin'])->middleware('permission:announcement.update');
        Route::post('{id}/important', [App\Http\Controllers\Api\Announcement\AnnouncementController::class, 'markImportant'])->middleware('permission:announcement.update');
        Route::post('{id}/attachments', [App\Http\Controllers\Api\Announcement\AnnouncementController::class, 'uploadAttachment'])->middleware('permission:announcement.update');
        Route::delete('attachments/{id}', [App\Http\Controllers\Api\Announcement\AnnouncementController::class, 'deleteAttachment'])->middleware('permission:announcement.update');
    });

    // Search routes
    Route::prefix('search')->group(function () {
        Route::get('/global', [SearchController::class, 'globalSearch']);
        Route::get('/performance', [SearchController::class, 'performanceComparison']);
        Route::get('/advanced', [SearchController::class, 'advancedSearch']);
        Route::get('/stats', [SearchController::class, 'searchStats']);
    });

    Route::prefix('indexing')->group(function () {
        Route::get('/compare', [IndexingController::class, 'compare']);
        Route::get('/stats', [IndexingController::class, 'stats']);
    });

    Route::prefix('explain')->group(function () {
        Route::post('/analyze', [ExplainController::class, 'analyze']);
        Route::get('/logs', [ExplainController::class, 'logs']);
        Route::get('/stats', [ExplainController::class, 'stats']);
    });

    Route::prefix('transactions')->group(function () {
        Route::get('/successful', [TransactionDemoController::class, 'successful']);
        Route::get('/failed', [TransactionDemoController::class, 'failed']);
        Route::get('/without-transaction', [TransactionDemoController::class, 'withoutTransaction']);
        Route::get('/with-transaction', [TransactionDemoController::class, 'withTransaction']);
        Route::get('/history', [TransactionDemoController::class, 'history']);
    });
});
