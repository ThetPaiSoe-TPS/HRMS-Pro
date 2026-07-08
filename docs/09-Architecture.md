System Architecture Design

Overall Architecture
+------------------------------+
|         React Client         |
| React + TS + Tailwind + RQ   |
+--------------+---------------+
               |
         HTTPS / REST API
               |
+--------------+---------------+
|        Laravel API           |
| Controllers                 |
| Services                    |
| Validation                  |
| Policies                    |
| API Resources               |
+--------------+---------------+
               |
          Eloquent ORM
               |
+--------------+---------------+
|          MySQL               |
| Employees                    |
| Departments                  |
| Attendance                   |
| Leave                        |
| Payroll                      |
+------------------------------+

===

Backend Structure (Laravel)
backend/

app/

├── Http/
│   ├── Controllers/
│   ├── Middleware/
│   ├── Requests/
│   └── Resources/
│
├── Models/
│
├── Services/
│
├── Policies/
│
├── Notifications/
│
├── Events/
│
├── Jobs/
│
└── Providers/

===

frontend/

src/

├── api/
├── assets/
├── components/
│   ├── common/
│   ├── forms/
│   ├── layout/
│   └── tables/
│
├── features/
│   ├── auth/
│   ├── employee/
│   ├── attendance/
│   ├── leave/
│   ├── payroll/
│   └── reports/
│
├── hooks/
├── layouts/
├── pages/
├── routes/
├── services/
├── store/
├── types/
├── utils/
└── App.tsx

===

Request Lifecycle
User

↓

React Form

↓

React Validation

↓

Axios

↓

Laravel API

↓

Route

↓

Middleware

↓

Form Request Validation

↓

Controller

↓

Service

↓

Model

↓

MySQL

↓

API Resource

↓

React

↓

Success Message

===

Authentication Flow(Laravel Sanctum)
User Login

↓

POST /api/login

↓

Validate credentials

↓

Create Sanctum token

↓

Return:

- user
- token

↓

React stores token

↓

Future requests include:

Authorization: Bearer <token>

===

Authorization Flow
React

↓

Authorization Header

↓

Laravel Middleware

↓

Authenticated?

↓

No → 401 Unauthorized

↓

Yes

↓

Policy / Permission Check

↓

Allowed?

↓

No → 403 Forbidden

↓

Yes

↓

Controller

===

Database Layer
Employees
    │
    ├── Department
    ├── Position
    ├── Attendance
    ├── Leave
    ├── Payroll
    └── Documents

===

API Response Standard
{
  "success": true,
  "message": "Employee created successfully.",
  "data": {
    "id": 1,
    "name": "John Doe"
  }
}

{
  "success": false,
  "message": "Validation failed.",
  "errors": {
    "email": [
      "The email has already been taken."
    ]
  }
}

Error Handling Strategy
| HTTP Code | Meaning          | Example                |
| --------- | ---------------- | ---------------------- |
| 200       | Success          | Data retrieved         |
| 201       | Created          | Employee created       |
| 400       | Bad Request      | Invalid request        |
| 401       | Unauthorized     | Not logged in          |
| 403       | Forbidden        | No permission          |
| 404       | Not Found        | Employee doesn't exist |
| 422       | Validation Error | Invalid form input     |
| 500       | Server Error     | Unexpected exception   |

===

Logging & Monitoring

Login attempts
Employee creation
Leave approvals
Payroll generation
Unexpected errors

Security Principles

Passwords are hashed.
Validate all input.
Use CSRF protection where applicable.
Protect APIs with Sanctum.
Use authorization policies.
Never trust client-side validation alone.

===

Architecture Decisions
| Decision                      | Reason                    |
| ----------------------------- | ------------------------- |
| React + Laravel API           | Separation of concerns    |
| TypeScript                    | Better maintainability    |
| Tailwind CSS                  | Faster UI development     |
| Laravel Sanctum               | Secure SPA authentication |
| Service Layer                 | Keeps controllers clean   |
| Feature-based React structure | Easier scaling            |
| REST API                      | Simple, widely adopted    |



