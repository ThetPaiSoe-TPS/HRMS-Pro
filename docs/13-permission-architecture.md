Recommended Permission Architecture
User
 │
 ▼
Role
 │
 ▼
RolePermission (pivot)
 │
 ▼
Permission
 │
 ▼
Gate / Policy
 │
 ▼
Middleware
 │
 ▼
Controller
Database

You already have:

users
roles
permissions

Add the pivot table:

role_permissions
Field	Type
id	bigint
role_id	FK
permission_id	FK
created_at	timestamp
updated_at	timestamp

Example data:

Role	Permission
Super Admin	employee.view
Super Admin	employee.create
Super Admin	employee.update
Super Admin	employee.delete
HR Manager	employee.view
HR Manager	employee.create
HR Manager	employee.update
Department Manager	employee.view
Employee	profile.view
Employee	leave.create
Permissions

Don't use generic names like create_employee.

Use a consistent pattern:

employee.view
employee.create
employee.update
employee.delete

department.view
department.create
department.update
department.delete

position.view
position.create
position.update
position.delete

attendance.view
attendance.create
attendance.update

leave.view
leave.create
leave.approve
leave.reject

payroll.view
payroll.generate

report.view

user.view
user.create
user.update
user.delete

role.view
role.create
role.update
role.delete

setting.update
Relationships
User
public function role()
{
    return $this->belongsTo(Role::class);
}
Role
public function permissions()
{
    return $this->belongsToMany(
        Permission::class,
        'role_permissions'
    );
}
Permission
public function roles()
{
    return $this->belongsToMany(
        Role::class,
        'role_permissions'
    );
}
User Helper

Add a helper on the User model:

public function hasPermission(string $permission): bool
{
    return $this->role
        ->permissions
        ->contains('slug', $permission);
}

Then you can simply write:

$user->hasPermission('employee.create');
Gates

In AppServiceProvider::boot() (or a dedicated AuthServiceProvider if you add one):

Gate::define('employee.create', function ($user) {
    return $user->hasPermission('employee.create');
});

Gate::define('employee.update', function ($user) {
    return $user->hasPermission('employee.update');
});

Gate::define('employee.delete', function ($user) {
    return $user->hasPermission('employee.delete');
});

Repeat for other permissions.

Policies (Recommended)

Instead of creating many Gates, create one policy per resource.

Example:

EmployeePolicy

Methods:

viewAny()

view()

create()

update()

delete()

Example:

public function create(User $user)
{
    return $user->hasPermission('employee.create');
}

Controller:

$this->authorize('create', Employee::class);

This is the Laravel approach and scales better than defining dozens of Gates.

Middleware

Implement your CheckRole (or rename it to CheckPermission) middleware to check permissions passed from the route.

Example logic:

if (!$request->user()->hasPermission($permission)) {
    abort(403);
}

Register it in bootstrap/app.php, then use it like:

Route::middleware(['auth:sanctum', 'permission:employee.create'])
    ->post('/employees', ...);
Form Requests

Instead of:

Validator::make(...)

Prefer:

StoreEmployeeRequest

Then:

public function authorize()
{
    return auth()->user()->can('create', Employee::class);
}

Validation and authorization stay together.

UI Permissions

Your React app should also use permissions to hide actions, but remember:

Hiding a button is only for UX. The backend must always enforce permissions.

Examples:

Permission	UI
employee.create	Show Add Employee button
employee.update	Show Edit button
employee.delete	Show Delete button
leave.approve	Show Approve and Reject buttons
payroll.generate	Show Generate Payroll button
Route Example
Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('/employees', ...)
        ->middleware('permission:employee.view');

    Route::post('/employees', ...)
        ->middleware('permission:employee.create');

    Route::put('/employees/{employee}', ...)
        ->middleware('permission:employee.update');

    Route::delete('/employees/{employee}', ...)
        ->middleware('permission:employee.delete');
});
Recommended Development Order
Create permissions and role_permissions migrations.
Add Eloquent relationships.
Seed default roles and permissions.
Add hasPermission() to User.
Register Gates or Policies.
Implement the permission middleware.
Register the middleware alias.
Protect routes.
Update Form Requests to use authorize().
Update the React UI to show/hide features based on permissions.

===

admin can access all

employee role: 
---
Profile (auth:sanctum only, no permission middleware)
Method	Route	Action
GET	/auth/profile	View own auth profile
PUT	/auth/change-password	Change own password
GET	/profile	View own full profile
PUT	/profile	Update own profile
PUT	/profile/change-password	Change own password

Employees (employee.view)
Method	Route	Action
GET	/employees	View employee list (auto-scoped to own)
GET	/employees/{employee}	View own employee details

Attendance (attendance.view, attendance.create)
Method	Route	Action
GET	/attendance	View own attendance history (auto-scoped)
POST	/attendance/check-in	Check in
POST	/attendance/check-out	Check out

Leave (leave.view, leave.create)
Method	Route	Action
GET	/leave-requests	View own leave history (auto-scoped)
POST	/leave-requests	Apply for leave
GET	/leave-requests/{id}	View own leave detail
PUT	/leave-requests/{id}	Update own leave
DELETE	/leave-requests/{id}	Delete own leave
POST	/leave-requests/{id}/attachment	Upload attachment

Payroll (payroll.view)
Method	Route	Action
GET	/payrolls	View own payroll list
GET	/payrolls/{payroll}	View own payroll/payslip

Salary (salary.view)
Method	Route	Action
GET	/employees/{employee}/salary	View own salary info

xxx

