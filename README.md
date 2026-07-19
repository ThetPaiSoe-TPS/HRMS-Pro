# HRMS Pro

Human Resource Management System

1. Requirement Gathering
        ↓
2. Project Scope
        ↓
3. Functional Requirements
        ↓
4. Database Design
        ↓
5. User Flow
        ↓
6. Wireframe
        ↓
7. UI Design (Figma)
        ↓
8. API Documentation
        ↓
9. Laravel Backend
        ↓
10. React Frontend
        ↓
11. Testing
        ↓
12. Deployment

===

Chapter 1

Project Overview

Chapter 2

Business Requirement

Chapter 3

Project Scope

Chapter 4

User Roles

Chapter 5

Functional Requirements

Chapter 6

Non-functional Requirements

Chapter 7

Project Flow

Chapter 8

System Architecture

Chapter 9

Database Design (ERD)

Chapter 10

API Documentation

Chapter 11

Frontend Route Structure

Chapter 12

Folder Structure

Chapter 13

UI/UX Design

Chapter 14

Figma Design

Chapter 15

Development Roadmap

===

Project Overview
Project Name

HRMS Pro

Human Resource Management System

Project Goal

Develop a professional Human Resource Management System that enables organizations to manage:

Employees
Departments
Positions
Attendance
Leave
Payroll
Recruitment
Documents
Performance
Reports
Target Users
Small companies
Medium businesses
Software companies
Factories
Schools
Startups

===

Objectives

The system should:

Reduce paperwork
Centralize employee data
Automate leave requests
Monitor attendance
Generate reports
Improve HR productivity

===

Project Scope
Core Modules
Dashboard
Company statistics
Employee count
Attendance summary
Leave summary
Payroll summary
Birthday reminders
Recent activities
Authentication
Login
Logout
Forgot Password
Reset Password
Email Verification
Two-Factor Authentication (optional)
User Management
Users
Roles
Permissions
Profile
Password Change
Employee Management
Add Employee
Edit Employee
Delete Employee
Profile
Emergency Contact
Documents
Experience
Education
Skills
Department
Add
Edit
Delete
Department Head
Position
Designation
Job Grade
Salary Level
Attendance
Check-in
Check-out
Late
Early Leave
Overtime
Leave Management
Apply Leave
Approve
Reject
Cancel
Leave Balance
Payroll
Salary
Bonus
Tax
Deduction
Payslip PDF
Recruitment
Jobs
Applicants
Interviews
Hiring
Performance
KPI
Goals
Review
Promotion
Company Settings
Company Info
Holidays
Working Hours
Shift
Announcement
Reports
Attendance Report
Payroll Report
Employee Report
Leave Report
Export Excel
Export PDF

===

User Roles
Role	Description
Super Admin	Everything
HR Manager	HR Features
Department Manager	Manage Department
Employee	Own Data

===

Technology
Frontend
React 19
Vite
TypeScript
TailwindCSS
React Router
React Hook Form
TanStack Query
Axios

Backend
Laravel 12
Sanctum
MySQL
Storage
Queue
Mail
Notifications

UI Design

We'll design the UI similar to professional SaaS dashboards such as:

Clean left sidebar
Top navigation
Breadcrumbs
Statistic cards
Charts
Tables
Drawers
Modals
Responsive layout
Dark mode (optional)

===

📂 HRMS Design

Suggested Figma Structure

├── 01 Cover
├── 02 Design System
│   ├── Colors
│   ├── Typography
│   ├── Icons
│   ├── Buttons
│   ├── Inputs
│   ├── Tables
│   ├── Cards
│   └── Modals
├── 03 Authentication
├── 04 Dashboard
├── 05 Employee
├── 06 Department
├── 07 Attendance
├── 08 Leave
├── 09 Payroll
├── 10 Reports
├── 11 Settings
└── 12 Mobile Responsive

===

Suggested Project Folder (Documentation)

HRMS

├── docs
│   ├── Project Scope
│   ├── Requirements
│   ├── Flowchart
│   ├── ERD
│   ├── API Docs
│   ├── UI Guide
│   └── Meeting Notes
│
├── backend (Laravel)
│
├── frontend (React)
│
└── figma-assets

===

Development Roadmap

Project documentation
Design system (colors, typography, reusable components)
Figma wireframes
High-fidelity UI designs
Database schema and ERD
API specification
Laravel authentication and role management
Employee and department modules
Attendance and leave management
Payroll, reports, and remaining modules
Testing and deployment

===

Development Roadmap

Phase 1 – Project Planning

Week 1
✅ Business Requirement Document (BRD)
✅ Software Requirement Specification (SRS)
✅ Project Scope
✅ Functional Requirements
✅ Non-functional Requirements
✅ User Stories
✅ User Roles & Permissions
✅ Project Timeline
✅ Technology Stack
✅ Development Standards

Phase 2 – System Analysis
Use Case Diagram
Activity Diagram
Sequence Diagram
ER Diagram (ERD)
Database Design
Relationships
Data Dictionary

Phase 3 – UI/UX Design
Low-Fidelity Wireframes
Login
Dashboard
Employee
Department
Attendance
Leave
Payroll
Reports
Settings
High-Fidelity Design

Create a professional design system with:

Color palette
Typography
Icons
Buttons
Inputs
Tables
Cards
Charts
Modals
Toasts
Empty states

Phase 4 – API Design

Each endpoint will include:

Request
Validation
Response
Error cases
HTTP status codes

Phase 5 – Backend (Laravel 12)

Authentication
Roles & Permissions
Departments
Employees
Attendance
Leave
Payroll
Recruitment
Performance
Reports
Notifications
Settings

Phase 6 – Frontend (React + TypeScript)

Each module will include:

List page
Create page
Edit page
View page
Delete confirmation
Search
Filter
Pagination
Responsive layout

We'll also build reusable components such as:

DataTable
Modal
Drawer
Form controls
File upload
Date picker
Breadcrumbs

Phase 7 – Advanced Features

JWT/Sanctum authentication
Role-based access control
Audit logs
Activity timeline
Notifications
Email verification
Excel import/export
PDF payslips
Dashboard charts
Dark mode
Multi-language support (English/Myanmar)
Docker setup
Unit & Feature Tests
CI/CD pipeline

===

UI/UX Design Process

Login
Dashboard
Employees
Departments
Attendance
Leave
Payroll
Reports
Settings
Mobile responsiveness


xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Frontend
- React
- TypeScript
- Tailwind CSS

Backend
- Laravel 12

Database
- MySQL
<<<<<<< HEAD

======

Planning
    ☐ BRD
    ☐ SRS
    ☐ Scope
    ☐ User Stories

Analysis
    ☐ Use Cases
    ☐ ERD
    ☐ API

Design
    ☐ Wireframe
    ☐ Design System
    ☐ High-Fidelity UI

Backend
    ☐ Authentication
    ☐ Employees
    ☐ Departments

Frontend
    ☐ Dashboard
    ☐ Employee Module

Testing
Deployment


===

| Week | Role               | Output       |
| ---- | ------------------ | ------------ |
| 1    | Business Analyst   | BRD          |
| 2    | System Analyst     | SRS          |
| 3    | UI/UX Designer     | Figma        |
| 4    | Database Designer  | ERD          |
| 5    | Backend Developer  | Laravel APIs |
| 6    | Frontend Developer | React UI     |
| 7    | QA Engineer        | Testing      |
| 8    | DevOps             | Deployment   |


===

Version 1.0 should include:

Login
Dashboard
Employee Management
Departments
Attendance
Leave
Payroll
Reports

===

Phase 1
✅ Planning

↓

Phase 2
System Analysis

↓

Phase 3
Database Design

↓

Phase 4
API Design

↓

Phase 5
Figma UI/UX

↓

Phase 6
Laravel Backend

↓

Phase 7
React Frontend

↓

Phase 8
Testing

↓

Phase 9
Docker

↓

Phase 10
Deployment


===


1.3 Technology Overview
Frontend
React
TypeScript
Tailwind CSS
React Router
TanStack Query
Axios
Backend
Laravel 12
REST API
Laravel Sanctum
MySQL
Design
Figma
1. System Users

The system contains four main user roles.

2.1 Super Admin
Description

Full system administrator.

Permissions

Can:

Manage users
Manage roles
Configure system
View all reports
Manage company settings
2.2 HR Manager
Description

Responsible for employee operations.

Permissions

Can:

Create employees
Update employee information
Manage attendance
Manage leave
Process payroll
Generate reports
2.3 Department Manager
Description

Manages employees inside their department.

Permissions

Can:

View team members
Approve leave requests
View department reports

Cannot:

Manage payroll
Delete employees
2.4 Employee
Description

Normal system user.

Can:

View profile
Update personal information
Check attendance
Apply leave
View payslips

===
3. Functional Requirements

Module 1: Authentication
FR-AUTH-001
Login

The system must allow users to log in using:

Email
Password

---

FR-AUTH-002

Logout

User can logout and invalidate session/token.

FR-AUTH-003

Forgot Password

User can request password reset.

Flow:

Enter Email
      |
      ↓
Receive Email
      |
      ↓
Reset Password

---

Module 2: Dashboard
FR-DASH-001

System displays:

Total Employees
Departments
Present Today
Absent Today
Pending Leave
Monthly Payroll

---

Module 3: Employee Management
FR-EMP-001

HR can create employee.

Required fields:

Employee ID
First Name
Last Name
Email
Phone
Gender
Date of Birth
Department
Position
Join Date
Salary
Status

---

FR-EMP-002

Employee list.

Features:

Search
Filter
Pagination
Sort

---

FR-EMP-003

Employee profile.

Display:

Personal Information
Employment Information
Documents
Attendance History
Leave History
Payroll History

---

Module 4: Department Management

Functions:

Create department
Update department
Delete department
Assign manager

---

Module 5: Attendance

Features:

Employee:

Check In
Check Out

System calculates:

Working Hours
Late Time
Overtime
Module 6: Leave Management

Workflow:

Employee

Apply Leave

      ↓

Department Manager

Approve / Reject

      ↓

HR

Update Balance

Leave types:

Annual Leave
Sick Leave
Emergency Leave
Unpaid Leave
Module 7: Payroll

System calculates:

Basic Salary

+
Allowance

-
Tax

-
Deduction

=

Net Salary

Output:

PDF Payslip
Module 8: Reports

Available reports:

Employee Report
Total Employees
New Employees
Resigned Employees
Attendance Report
Monthly Attendance
Late Report
Overtime Report
Payroll Report
Salary Summary
Payment History

Export:

PDF
Excel

===

4. Non-Functional Requirements

Performance

System should:

Load pages quickly
Support pagination
Optimize database queries
Security

System must:

Encrypt passwords
Validate requests
Protect APIs
Use role permissions
Usability

System should:

Be responsive
Work on desktop/tablet/mobile
Have simple navigation
Maintainability

Code should:

Follow clean architecture
Use reusable components
Have documentation

===

5. Business Rules
Employee Rule

Each employee must belong to:

One Department
One Position
Leave Rule

Employee cannot apply leave if:

Requested days > Available balance
Payroll Rule

Only HR Manager can finalize payroll.

===

6. System Limitations

Version 1:

Single company
Single currency
Web only
Manual attendance input
7. Acceptance Criteria

The project is accepted when:

✅ Users can login
✅ Roles work correctly
✅ Employees can be managed
✅ Leave workflow works
✅ Payroll can generate payslips
✅ Reports can export data
=======
===

Step 1 — High-Fidelity UI (Current Step)

Turn your wireframes into polished screens.

Design these pages:
Authentication
Login
Forgot Password
Dashboard
Dashboard
Employee
Employee List
Add Employee
Edit Employee
Employee Detail
Department
Department List
Add/Edit Department
Position
Position List
Add/Edit Position
Attendance
Attendance List
Check In
Attendance Detail
Leave
Leave List
Apply Leave
Leave Approval
Leave Detail
Payroll
Payroll List
Payroll Detail
Reports
Reports Dashboard
Administration
Users
Roles
Permissions
Company Settings
Profile
User Profile

===

Step 2 — Design System

Before polishing all screens, create reusable Figma components.

Colors
Primary
Secondary
Success
Warning
Danger
Background
Surface
Border
Typography
Heading 1–4
Body
Caption
Button
Components
Button
Input
Select
Date Picker
Table
Modal
Drawer
Card
Badge
Avatar
Breadcrumb
Pagination
Tabs
Toast
Alert
Empty State
Loading Spinner

These should become Figma Components and later React components.

===

Step 3 — API Specification (Highly Recommended)

This is one thing that separates good portfolio projects from great ones.

Create:

docs/
11-API-Specification.md

For every page, define:

Example:

Login
Method	Endpoint
POST	/api/login

Request

{
  "email": "admin@example.com",
  "password": "password"
}

Response

{
  "success": true,
  "token": "...",
  "user": {}
}

Example:

Employee
Method	Endpoint
GET	/api/employees
POST	/api/employees
GET	/api/employees/{id}
PUT	/api/employees/{id}
DELETE	/api/employees/{id}

Do this for every module before writing controllers.


===

Step 4 — Laravel Folder Planning

Before coding, decide your structure.

app/

Http/
    Controllers/
    Middleware/
    Requests/
    Resources/

Models/

Services/

Repositories/

Policies/

Notifications/

Events/

Jobs/

===

Step 5 — React Folder Planning
src/

api/

components/

features/

hooks/

layouts/

pages/

routes/

services/

store/

types/

utils/

===

Step 6 — Sprint Planning

Instead of building randomly, develop module by module.

Sprint 1
Authentication
Roles
Users
Sprint 2
Departments
Positions
Sprint 3
Employees
Sprint 4
Attendance
Sprint 5
Leave
Sprint 6
Payroll
Sprint 7
Reports
Sprint 8
Testing
Bug Fixes
Deployment
>>>>>>> 7d2296172acb86953edd1534f01db97b8cb71096


Sprint 1
Authentication
Roles
Permissions
Users
Sprint 2
Departments
Positions
Sprint 3
Employees
Sprint 4
Attendance
Sprint 5
Leave
Sprint 6
Payroll
Sprint 7
Reports
Dashboard
Sprint 8
Company Settings
Profile
Notifications
Activity Logs