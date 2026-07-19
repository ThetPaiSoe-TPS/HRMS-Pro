API Design Documentation

Create:

docs/

12-API-Design.md

This document should include:

1. API Overview
2. Base URL
3. Authentication
4. Request & Response Standards
5. HTTP Status Codes
6. API Versioning
7. API Endpoints
8. Validation Rules
9. Authorization
10. Error Handling
11. File Upload APIs
12. Pagination
13. Filtering & Searching
14. Sorting
15. API Flow
16. API Security
17. Future APIs
1. API Overview
Technology
Item	Value
Framework	Laravel 12
API Type	REST API
Authentication	Laravel Sanctum
Response Format	JSON
Version	v1
2. Base URL

Development

http://localhost:8000/api/v1

Production

https://api.hrmspro.com/api/v1
3. Authentication

Authentication Method

Laravel Sanctum

Flow

Login

↓

Receive Token

↓

Save Token

↓

Authorization Header

↓

Protected APIs

Header

Authorization: Bearer TOKEN
4. Standard Response Format

Every API should return the same structure.

Success
{
  "success": true,
  "message": "Employee created successfully.",
  "data": {}
}
Error
{
  "success": false,
  "message": "Validation failed.",
  "errors": {}
}
5. HTTP Status Codes
Code	Meaning
200	Success
201	Created
204	Deleted
400	Bad Request
401	Unauthorized
403	Forbidden
404	Not Found
409	Conflict
422	Validation Error
500	Internal Server Error
6. Authentication APIs
Login
POST /auth/login

Request

{
  "email":"admin@company.com",
  "password":"password"
}

Response

{
 "success":true,
 "data":{
   "token":"xxxxx",
   "user":{}
 }
}
Logout
POST /auth/logout
Profile
GET /auth/profile
Change Password
PUT /auth/change-password
7. Employee APIs
List Employees
GET /employees

Query Parameters

?page=1
&limit=10
&search=john
&department_id=1
&position_id=3
&status=active
Employee Detail
GET /employees/{id}
Create Employee
POST /employees

Request

{
 "employee_code":"EMP001",
 "first_name":"John",
 "last_name":"Doe",
 "department_id":1,
 "position_id":2,
 "phone":"091111111"
}
Update Employee
PUT /employees/{id}
Delete Employee
DELETE /employees/{id}

Soft delete.

8. Department APIs
GET /departments

GET /departments/{id}

POST /departments

PUT /departments/{id}

DELETE /departments/{id}
9. Position APIs
GET /positions

POST /positions

PUT /positions/{id}

DELETE /positions/{id}
10. Attendance APIs
GET /attendance

POST /attendance/check-in

POST /attendance/check-out

GET /attendance/{id}

PUT /attendance/{id}

DELETE /attendance/{id}
11. Leave APIs
GET /leave-requests

POST /leave-requests

GET /leave-requests/{id}

PUT /leave-requests/{id}

DELETE /leave-requests/{id}

PUT /leave-requests/{id}/approve

PUT /leave-requests/{id}/reject
12. Payroll APIs
GET /payrolls

POST /payrolls/generate

GET /payrolls/{id}

GET /payrolls/{id}/download
13. Reports
GET /reports/employees

GET /reports/attendance

GET /reports/leave

GET /reports/payroll
14. User APIs
GET /users

POST /users

PUT /users/{id}

DELETE /users/{id}
15. Role APIs
GET /roles

POST /roles

PUT /roles/{id}

DELETE /roles/{id}
16. Permission APIs
GET /permissions

POST /permissions

PUT /permissions/{id}

DELETE /permissions/{id}
17. Company Settings APIs
GET /settings/company

PUT /settings/company
18. Profile APIs
GET /profile

PUT /profile

PUT /profile/change-password
19. Dashboard APIs
GET /dashboard/statistics

GET /dashboard/charts

GET /dashboard/recent-activities

GET /dashboard/upcoming-holidays
20. Search Standard

Every list API should support:

?page=1

&per_page=10

&search=

&sort_by=

&sort_order=asc

&status=

&department_id=

Example

GET /employees?page=1&per_page=10&search=john&sort_by=first_name&sort_order=asc
21. File Upload APIs

Employee photo

POST /employees/{id}/photo

Leave attachment

POST /leave-requests/{id}/attachment
22. Authorization Matrix
Module	Employee	Dept Manager	HR Manager	Super Admin
Dashboard	✓	✓	✓	✓
Employees	View Self	Team	CRUD	CRUD
Departments	✗	View	CRUD	CRUD
Positions	✗	View	CRUD	CRUD
Attendance	Own	Team	All	All
Leave	Own	Approve Team	All	All
Payroll	Own Payslip	✗	All	All
Reports	✗	Team	All	All
Users	✗	✗	✗	CRUD
Roles	✗	✗	✗	CRUD
Settings	✗	✗	✗	CRUD
23. API Development Order

Build APIs in this sequence:

Sprint 1
Authentication

↓

Users

↓

Roles

↓

Permissions

↓

Sprint 2
Departments

↓

Positions

↓

Sprint 3
Employees

↓

Sprint 4
Attendance

↓

Sprint 5
Leave

↓

Sprint 6
Payroll

↓

Sprint 7
Reports

↓

Dashboard

↓

Settings