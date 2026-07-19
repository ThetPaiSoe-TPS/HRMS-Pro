Database Design (ERD)

Step 1 — Identify Entities
| Entity           | Purpose               |
| ---------------- | --------------------- |
| users            | Login accounts        |
| roles            | User roles            |
| permissions      | Access control        |
| employees        | Employee information  |
| departments      | Company departments   |
| positions        | Job titles            |
| attendance       | Daily attendance      |
| leave_requests   | Leave applications    |
| payrolls         | Salary records        |
| announcements    | Dashboard notices     |
| holidays         | Company holidays      |
| company_settings | Organization settings |


Step 2 — Identify Relationships

Step 3 — High-Level ERD
                    USERS
                      │
                      │
                      ▼
                 EMPLOYEES
                 /   |    \
                /    |     \
               ▼     ▼      ▼
      DEPARTMENTS POSITIONS ATTENDANCE
                         │
                         ▼
                    LEAVE_REQUESTS
                         │
                         ▼
                      PAYROLLS

Step 4 — Table Design
| Column            | Type      | Description                |
| ----------------- | --------- | -------------------------- |
| id                | bigint    | PK                         |
| employee_code     | varchar   | EMP0001                    |
| user_id           | bigint    | FK                         |
| department_id     | bigint    | FK                         |
| position_id       | bigint    | FK                         |
| first_name        | varchar   | First name                 |
| last_name         | varchar   | Last name                  |
| email             | varchar   | Work email                 |
| phone             | varchar   | Phone                      |
| gender            | enum      | Male/Female/Other          |
| date_of_birth     | date      | DOB                        |
| hire_date         | date      | Join date                  |
| employment_status | enum      | Active/Resigned/Terminated |
| created_at        | timestamp |                            |
| updated_at        | timestamp |                            |
| deleted_at        | timestamp | Soft delete                |

Why use employee_code?

Departments
| Column      | Type    |
| ----------- | ------- |
| id          | bigint  |
| name        | varchar |
| code        | varchar |
| manager_id  | bigint  |
| description | text    |

Step 5 — Relationship Summary
| Table                 | Relationship |
| --------------------- | ------------ |
| Department → Employee | One-to-Many  |
| Position → Employee   | One-to-Many  |
| Employee → Attendance | One-to-Many  |
| Employee → Leave      | One-to-Many  |
| Employee → Payroll    | One-to-Many  |
| Role → User           | One-to-Many  |


Step 6 — Naming Convention
employees
departments
positions
attendance_records
leave_requests
payrolls

Step 7 — Index Strategy
| Column          | Reason               |
| --------------- | -------------------- |
| employee_code   | Fast employee lookup |
| email           | Login and uniqueness |
| department_id   | Filtering            |
| attendance_date | Reports              |
| status          | Filtering            |

Step 8 — Normalization

Final ERD (Version 1.0)
users
│
├── role_id
└── employee_id
      │
      ▼
employees
├── department_id ─────────► departments
├── position_id ───────────► positions
├── user_id ───────────────► users
│
├──────────────► attendance_records
├──────────────► leave_requests
└──────────────► payrolls