# HRMS Pro — Full-Stack Human Resource Management System

## 📋 Project Overview

**HRMS Pro** is a comprehensive, enterprise-grade Human Resource Management System built from the ground up. It streamlines HR operations including employee management, attendance tracking, leave management, payroll processing, and reporting—all within a secure, role-based access control framework.

The project was architected following **full SDLC methodology**—from Business Requirement Document (BRD) and SRS through to database design, API specification, UI/UX design, development, and deployment planning.

---

## 🚀 Live Demo & Repository

| Item | Link |
|------|------|
| **GitHub Repository** | [https://github.com/ThetPaiSoe-TPS/HRMS-Pro] |
| **Tech Stack** | Laravel 12 + React 18 + TypeScript + MySQL |
| **Authentication** | Laravel Sanctum (Token-based SPA Auth) |

---

## 🧠 My Role & Contributions

### Role: **Full-Stack Developer / Software Engineer**

### Responsibilities:
- **End-to-End Development**: Architected and built the entire application from documentation to deployment
- **System Architecture**: Designed the multi-tier architecture (React → Laravel API → MySQL) with clean separation of concerns
- **Database Design**: Created normalized database schema with 12+ entities, proper relationships, migrations, and indexing strategy
- **API Development**: Designed and implemented 80+ RESTful API endpoints with versioning, validation, standardized responses, and error handling
- **Role-Based Access Control**: Implemented comprehensive RBAC system with roles, permissions, gates, policies, and middleware
- **Frontend Architecture**: Built modular React application with TypeScript, protected routing, reusable components, and custom hooks
- **Payroll Engine**: Developed sophisticated payroll calculation system handling attendance, overtime, allowances, deductions, tax brackets, and payslip generation
- **Security**: Implemented Sanctum authentication, permission middleware, input validation, CSRF protection, and SQL injection prevention
- **Documentation**: Created complete project documentation including BRD, SRS, API specs, architecture docs, data flow diagrams, and deployment guides

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────┐
│           React Frontend (SPA)              │
│  React 18 + TypeScript + Tailwind CSS       │
│  React Router + React Hook Form + Axios     │
└──────────────────┬──────────────────────────┘
                   │ HTTPS / REST API
┌──────────────────▼──────────────────────────┐
│         Laravel 12 Backend API              │
│  Controllers → Services → Repositories      │
│  Policies → Form Requests → API Resources   │
│  Middleware: Auth, Permission, Activity Log  │
└──────────────────┬──────────────────────────┘
                   │ Eloquent ORM
┌──────────────────▼──────────────────────────┘
│              MySQL Database                  │
│  12 Tables: Users, Roles, Permissions,       │
│  Employees, Departments, Positions,          │
│  Attendance, Leave Requests, Payrolls,       │
│  Payroll Items, Company Settings, etc.       │
└─────────────────────────────────────────────┘
```

---

## ⚡ Key Features Implemented

### 🔐 Authentication & Role Management
- Multi-role authentication: **Super Admin, HR Manager, Department Manager, Employee**
- Token-based authentication via **Laravel Sanctum**
- Login, Logout, Profile management, Avatar upload, Password change
- Role-Based Access Control with fine-grained permissions (e.g., `employee.create`, `payroll.approve`)
- Permission middleware protecting every route

### 👥 Employee Management
- Full CRUD operations with employee code auto-generation
- Photo upload/delete with file validation
- Department & Position assignment
- Advanced search with filters (department, position, status, date range)
- Pagination with sort support
- Soft delete with restore capability

### 🏢 Department & Position Management
- Hierarchical department structure with manager assignment
- Position management with job grade and salary level
- Employee count per department
- Full CRUD with validation

### ⏰ Attendance Management
- **Check-in / Check-out** system with auto late detection (after 9:15 AM)
- Attendance status tracking: Present, Absent, Late, Half-day, Leave
- Daily attendance summary with percentage calculations
- Date-range filtering and reporting
- Manual attendance correction by admin

### 📅 Leave Management
- Leave application with balance validation
- **Approval workflow**: Employee → Manager Approve/Reject
- Leave types configuration (Annual, Sick, Emergency, Unpaid)
- Leave balance tracking with used/pending/available calculation
- File attachment upload (PDF, DOC, images) for supporting documents
- Date-range search and status filtering

### 💰 Payroll Management
- **Full payroll lifecycle**: Draft → Calculated → Pending Approval → Approved → Paid
- Automatic salary calculation with attendance, overtime, allowances, bonuses
- Tax calculation using progressive tax brackets
- Deductions for late, absent, unpaid leave, loans, advance salary
- Net salary computation
- Payslip PDF generation
- Payroll dashboard with statistics
- Business rules enforcement:
  - One payroll per employee per month
  - Cannot edit after payment
  - Only cancellation with audit trail
  - Salary history preserved

### 📊 Reports & Dashboard
- Dashboard with statistics: Total employees, present/absent today, pending leaves
- Employee, Attendance, Leave, and Payroll reports
- Export to PDF and Excel formats
- Charts and data visualization (Chart.js)
- Recent activities feed

### 🔧 Administration
- User management (Create, Edit, Delete)
- Role management with permission assignment
- Permission management (view, create, update, delete per module)
- Company settings configuration

---

## 🛠️ Technologies & Tools Used

### Backend
| Technology | Usage |
|-----------|-------|
| **Laravel 12** | PHP Framework — MVC Architecture |
| **PHP 8.2+** | Server-side language |
| **MySQL** | Relational Database |
| **Laravel Sanctum** | SPA Token Authentication |
| **Eloquent ORM** | Database abstraction & relationships |
| **Service Layer** | Business logic separation |
| **Repository Pattern** | Data access abstraction |
| **Form Requests** | Validation logic |
| **Policies & Gates** | Authorization |
| **API Resources** | Data transformation |
| **Middlewares** | Auth, Permission, Activity Logging |
| **File Storage** | Local/Public disk for uploads |
| **Database Migrations** | Version-controlled schema |
| **Seeders** | Test data population |

### Frontend
| Technology | Usage |
|-----------|-------|
| **React 18** | UI Library |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Utility-first CSS framework |
| **React Router** | Client-side routing |
| **React Hook Form** | Form management |
| **Zod** | Frontend validation |
| **Axios** | HTTP client |
| **Chart.js** | Data visualization |
| **jsPDF** | PDF generation |
| **xlsx** | Excel export |
| **@heroicons/react** | Icons |
| **Vite** | Build tool |

### DevOps & Tools
- **Git** for version control
- **Composer** for PHP dependency management
- **npm** for frontend dependency management
- **Docker** containerization setup
- **Postman** for API testing

---

## 📐 Design Patterns & Best Practices Applied

| Pattern | Implementation |
|---------|---------------|
| **MVC Architecture** | Laravel's built-in MVC with React as View layer |
| **Service Layer** | `PayrollService`, `AttendanceService`, `LeaveService`, `AuthService`, `EmployeeService` |
| **Repository Pattern** | `AttendanceRepository`, `EmployeeRepository`, `LeaveRepository` |
| **Traits** | `ApiResponseTrait` (standardized JSON responses), `FileUploadTrait` |
| **DTO/Resources** | API Resources for consistent data transformation |
| **Strategy Pattern** | Payroll calculation strategies for different components |
| **Observer/Event** | Activity Logging via Event/Listener |
| **Policy Pattern** | `AttendancePolicy`, `EmployeePolicy`, `LeaveRequestPolicy` |
| **Form Request Pattern** | Validation separated into dedicated Request classes |
| **SOLID Principles** | Single responsibility, Open-closed, Liskov, Interface segregation, Dependency inversion |
| **DRY Principle** | Reusable components, traits, service methods |
| **Clean Architecture** | Separation of concerns across Controller → Service → Repository → Model |

---

## 📊 Database Schema (12 Tables)

```
users ──┬── roles ──┬── role_permissions ──── permissions
        │
        └── employees ──┬── departments
                        ├── positions
                        ├── attendance_records
                        ├── leave_requests ──┬── leave_types
                        ├── payrolls ────────┬── payroll_items
                        ├── employee_salaries
                        └── employee_documents
```

---

## 💪 Challenges Solved

1. **Payroll Calculation Complexity**: Built a modular calculation engine that handles basic salary, allowances, overtime pay (with different rates for normal/weekend/holiday), progressive tax brackets, loan deductions, and advance salary adjustments.

2. **Leave Balance Management**: Implemented real-time balance validation ensuring employees cannot apply for leave exceeding available days, considering approved leaves and pending requests.

3. **Role-Based Access Control**: Designed a scalable permission system with 30+ granular permissions across all modules, implemented via middleware, policies, and frontend route guards.

4. **Attendance Tracking**: Built a check-in/check-out system with automatic late detection, duplicate check-in prevention, and daily summary calculations.

5. **Standardized API Responses**: Created a reusable `ApiResponseTrait` ensuring every endpoint returns consistent JSON structure with proper HTTP status codes.

---

## 📈 Project Impact

- **20+ screens** across 8 core modules
- **80+ API endpoints** fully documented with request/response examples
- **12 database tables** with normalized schema and proper indexing
- **4 user roles** with granular permission system
- **Complete documentation** including BRD, SRS, Architecture, API Specs, Data Flow, UI/UX guides

---

## 🎯 What This Project Demonstrates to Employers

| Skill | Demonstrated By |
|-------|----------------|
| **Full-Stack Development** | Built complete application from database to UI |
| **Clean Architecture** | MVC + Service Layer + Repository Pattern |
| **API Design** | RESTful, versioned, documented APIs |
| **Database Design** | Normalized schema, migrations, indexing |
| **Authentication & Security** | Sanctum tokens, RBAC, input validation |
| **Frontend Engineering** | React + TypeScript, reusable components |
| **Problem Solving** | Payroll engine, leave balance, attendance logic |
| **Documentation** | Comprehensive BRD, SRS, API docs, architecture |
| **Project Management** | SDLC methodology, phased development approach |
| **Code Quality** | SOLID principles, design patterns, clean code |

---

## 📧 Contact & Links

- **Email**: [your-email@example.com]
- **GitHub**: [github.com/your-username]
- **LinkedIn**: [linkedin.com/in/your-profile]
- **Portfolio**: [your-portfolio.com]

