Software Requirement Specification (SRS)

The BRD explains "why we build this system".

The SRS explains "what the system must do".
Business Owner
      |
      ↓
Business Requirement Document (BRD)
      |
      ↓
System Analyst
      |
      ↓
Software Requirement Specification (SRS)
      |
      ↓
Developer Team

===

HRMS Pro
Software Requirement Specification (SRS)

Version: 1.0

1. Introduction
1.1 Purpose

The purpose of this document is to define the functional and technical requirements of HRMS Pro.

This document describes:

System features
User interactions
Business rules
System behavior
Technical requirements
1.2 Product Overview

HRMS Pro is a web-based Human Resource Management System that allows organizations to manage employee information, attendance, leave, payroll, and reporting through a centralized platform.

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
2. System Users

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
3. Functional Requirements

Functional requirements describe what the system must do.

===

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
---

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

===

Module 2: Dashboard
FR-DASH-001

System displays:

Total Employees
Departments
Present Today
Absent Today
Pending Leave
Monthly Payroll

===

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

===

Module 4: Department Management

Functions:

Create department
Update department
Delete department
Assign manager

===

Module 5: Attendance

Features:

Employee:
Check In
Check Out

System calculates:
Working Hours
Late Time
Overtime

===

Module 6: Leave Management

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

===

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

===

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

These describe system quality.

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

===

7. Acceptance Criteria

The project is accepted when:

✅ Users can login
✅ Roles work correctly
✅ Employees can be managed
✅ Leave workflow works
✅ Payroll can generate payslips
✅ Reports can export data

===






