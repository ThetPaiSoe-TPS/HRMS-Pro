<?php

namespace App\Providers;

use App\Listeners\LogUserActivity;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Policies\AttendancePolicy;
use App\Policies\EmployeePolicy;
use App\Policies\LeaveRequestPolicy;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Gate::policy(Employee::class, EmployeePolicy::class);
        Gate::policy(Attendance::class, AttendancePolicy::class);
        Gate::policy(LeaveRequest::class, LeaveRequestPolicy::class);

        Event::listen(Login::class, LogUserActivity::class);
        Event::listen(Logout::class, LogUserActivity::class);
        Event::listen(Registered::class, LogUserActivity::class);
    }
}
