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

admin roles can make all

Manager role:
Menu Item	Manager Access
Dashboard	✅ Yes
Employee Management	✅ Yes (read-only)
Attendance	✅ Yes (read-only, except Check In/Out)
Attendance Report	✅ Yes (read-only)
Leave Management	✅ Yes (read-only)
Reports	✅ Yes (read-only)
Employee Report	✅ Yes (read-only)
Leave Report	✅ Yes (read-only)
Payroll Report	✅ Yes (read-only)
Announcements	✅ Yes (create & edit own)
Profile	✅ Yes
Administration	❌ No
Settings	❌ No
User Management	❌ No

Admin role:
🚫 Admin vs Super Admin Comparison
Feature	Admin	Super Admin
Dashboard	✅ Full Access	✅ Full Access
Employee Management	✅ Full CRUD	✅ Full CRUD
Attendance	✅ Full CRUD	✅ Full CRUD
Leave Management	✅ Approve/Reject	✅ Approve/Reject
Payroll	✅ Generate & Manage	✅ Generate & Manage
Reports	✅ Full Access	✅ Full Access
Announcements	✅ Full CRUD	✅ Full CRUD
User Management	✅ Create/Edit/Delete	✅ Create/Edit/Delete
Roles & Permissions	✅ Full Access	✅ Full Access
System Settings	✅ Edit	✅ Edit
Database Migration	❌ No	✅ Yes
System Updates	❌ No	✅ Yes
Server Configuration	❌ No	✅ Yes
API Management	❌ No	✅ Yes
Logs & Monitoring	❌ Limited	✅ Full
Backup & Restore	❌ No	✅ Yes

===

 Employee Dashboard Flow
text
┌─────────────────────────────────────────────────────────────┐
│                  EMPLOYEE DASHBOARD                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ My Today's│  │  My Leave│  │  My      │  │  My Next │  │
│  │Attendance│  │  Balance │  │Requests  │  │  Holiday │  │
│  │  Checked │  │  12 days │  │   3      │  │  Jul 21  │  │
│  │  In ✅   │  │  left    │  │ Pending  │  │          │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  My Recent Activities                              │   │
│  │  • You checked in at 09:00 AM today                │   │
│  │  • Your leave request is pending approval          │   │
│  │  • Payroll for June has been processed             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
📂 Employee Module Access Flow
1. 👤 Profile Management
text
EMPLOYEE → Profile
│
├── 👤 View Profile
│   ├── View personal information
│   ├── View contact details
│   ├── View department & position
│   └── View profile photo
│
├── ✏️ Edit Profile
│   ├── Update phone number
│   ├── Update address
│   ├── Update bio
│   └── Upload/change photo
│
└── 🔒 Change Password
    ├── Enter current password
    ├── Enter new password
    └── Confirm new password
Employee Capabilities: ✅ View Self, ✅ Edit Self (limited fields), ✅ Change Password

2. ⏰ Attendance Management
text
EMPLOYEE → Attendance
│
├── 📋 My Attendance Records
│   ├── View own attendance history
│   ├── Filter by date range
│   └── View check-in/out times
│
├── 📍 Check In/Out
│   ├── ✅ Check In (with location)
│   ├── ✅ Check Out (with location)
│   └── Add notes to check-in/out
│
├── 📊 My Attendance Stats
│   ├── View total present days
│   ├── View total absent days
│   ├── View total late days
│   └── View attendance percentage
│
└── 📈 My Attendance Report
    ├── View personal attendance trends
    └── View monthly attendance summary
Employee Capabilities: ✅ Check In/Out, ✅ View Own Attendance, ✅ View Own Stats

3. 📅 Leave Management
text
EMPLOYEE → Leave Management
│
├── 📋 My Leave Requests
│   ├── View all own leave requests
│   ├── View request status (Pending/Approved/Rejected)
│   ├── View leave history
│   └── Cancel pending requests
│
├── ➕ Apply for Leave
│   ├── Select leave type (Annual/Sick/Personal)
│   ├── Select start & end date
│   ├── Enter number of days
│   ├── Add reason/description
│   ├── Upload attachment (if required)
│   └── Submit request
│
├── 📊 My Leave Balance
│   ├── View Annual Leave balance
│   ├── View Sick Leave balance
│   ├── View Personal Leave balance
│   └── View total used vs available
│
└── 📈 My Leave Report
    ├── View leave usage trends
    └── View monthly leave summary
Employee Capabilities: ✅ Apply for Leave, ✅ View Own Balance, ✅ View Own History

4. 💰 Payroll Access
text
EMPLOYEE → Payroll
│
├── 📄 My Payslips
│   ├── View all payslips
│   ├── View current month's payslip
│   ├── Download payslip (PDF)
│   └── View payslip details
│
└── 📊 My Payroll History
    ├── View salary history
    ├── View deductions history
    └── View payment status
Employee Capabilities: ✅ View Own Payslips, ✅ Download Payslips, ❌ Cannot Generate/Edit Payroll

5. 📢 Announcements
text
EMPLOYEE → Announcements
│
├── 📢 View Announcements
│   ├── View all announcements
│   ├── View important announcements (highlighted)
│   ├── View pinned announcements (top)
│   ├── Filter by type
│   └── View announcement details
│
└── 🔔 Read Receipt
    └── Mark announcements as read
Employee Capabilities: ✅ View All Announcements, ❌ Cannot Create/Edit/Delete

6. 📈 Reports (Read-Only)
text
EMPLOYEE → Reports
│
├── 📅 My Leave Report
│   ├── View personal leave usage
│   └── Export own leave report
│
├── ⏰ My Attendance Report
│   ├── View personal attendance
│   └── Export own attendance report
│
└── 💰 My Payroll Report
    ├── View personal payroll summary
    └── Export own payroll report
Employee Capabilities: ✅ View Own Reports, ✅ Export Own Data, ❌ Cannot View Others

🚫 Employee Restrictions
Feature	Access	Reason
View Other Employees	❌ No	Privacy
Edit Other Profiles	❌ No	Security
Approve Leave	❌ No	Manager Only
Generate Payroll	❌ No	Admin Only
Manage Users	❌ No	Admin Only
System Settings	❌ No	Admin Only
Delete Data	❌ No	Admin Only
Export All Reports	❌ No	Limited to self
Create Announcements	❌ No	Admin/Manager Only
🔄 Employee Workflow Examples
1. Daily Check-in Flow
text
1. Employee logs in
2. Goes to Attendance → Check In/Out
3. Clicks "Check In"
4. System records time and location
5. Dashboard updates with "Checked In ✅"
6. At end of day, clicks "Check Out"
7. System calculates work hours
8. Attendance record is saved
2. Leave Application Flow
text
1. Employee → Leave Management → Apply Leave
2. Select leave type (Annual Leave)
3. Select dates (Jul 15-17, 2026)
4. Enter reason (Family vacation)
5. Upload attachment (optional)
6. Click "Submit"
7. Request sent to Manager/Admin for approval
8. Status shows as "Pending"
9. Employee receives notification
10. Can view request history
3. View Payslip Flow
text
1. Employee → Payroll → My Payslips
2. Select month/year
3. View payslip details:
   - Basic salary
   - Allowances
   - Deductions
   - Net salary
4. Click "Download PDF"
5. Payslip saved locally
4. Update Profile Flow
text
1. Employee → Profile
2. View current information
3. Click "Edit Profile"
4. Update phone number or address
5. Upload new photo
6. Click "Save"
7. Profile updated
8. Can also change password
📋 Employee Quick Reference Card
Action	Path	Permission
View Dashboard	/dashboard	✅ Read
Check In/Out	/admin/attendance/check	✅ Create
View My Attendance	/admin/attendance	✅ Read Own
Apply for Leave	/admin/leaves/create	✅ Create
View My Leave Requests	/admin/leaves	✅ Read Own
View My Leave Balance	/admin/leaves	✅ Read
View My Payslips	/admin/payroll	✅ Read Own
Download Payslip	/admin/payroll/:id	✅ Download
View Announcements	/announcements	✅ Read
View Profile	/profile	✅ Read
Edit Profile	/profile	✅ Update Own
Change Password	/profile	✅ Update
View Own Reports	/reports/*	✅ Read Own
Export Own Data	/reports/*	✅ Export
View Others' Data	-	❌ No
Edit Others' Data	-	❌ No
Approve Leave	-	❌ No
Manage Users	-	❌ No
System Settings	-	❌ No
Create Announcements	-	❌ No
🎯 What Min Min Can See in Sidebar
Based on your Sidebar logic, Min Min (Employee) will see:

text
┌─────────────────────────────────────┐
│         SIDEBAR - EMPLOYEE          │
├─────────────────────────────────────┤
│  📊 Dashboard                       │
│  📢 Announcements                   │
│  👤 Profile                         │
├─────────────────────────────────────┤
│  No admin menus visible             │
│  No employee management             │
│  No reports (unless configured)     │
└─────────────────────────────────────┘
Note: Employees typically have a simplified sidebar with only essential options.

🆚 Role Comparison Summary
Feature	Employee	Manager	Admin	Super Admin
View Self Profile	✅	✅	✅	✅
Edit Self Profile	✅	✅	✅	✅
Check In/Out	✅	✅	✅	✅
Apply Leave	✅	✅	✅	✅
View Own Leave	✅	✅	✅	✅
View Team Leave	❌	✅	✅	✅
Approve Leave	❌	✅	✅	✅
View Own Payslip	✅	✅	✅	✅
View Team Payslip	❌	✅	✅	✅
Generate Payroll	❌	❌	✅	✅
View Reports	Own only	Team only	Full	Full
Manage Users	❌	❌	✅	✅
Manage Roles	❌	❌	✅	✅
System Settings	❌	❌	✅	✅
Create Announcements	❌	✅	✅	✅
Edit All Announcements	❌	❌	✅	✅