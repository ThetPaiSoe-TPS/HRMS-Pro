Phase 2 — UI/UX Design

1. Design Goals

Our HRMS should feel like a modern SaaS product.

We want users to think:

Clean
Fast
Easy to use
Professional
Consistent

We are not designing a colorful marketing website.

===

2. Design Principles
Simplicity

Don't overload one page.

===

Consistency

Every page should follow the same layout.

+-------------------------------------------+
 Header
--------------------------------------------

 Breadcrumb

 Page Title

 Action Buttons

 Filters

 Table

 Pagination

--------------------------------------------

===

Accessibility
Large buttons
Clear typography
Good contrast
Keyboard navigation
Visible focus states

===

3. Design System

Before creating pages, define reusable tokens.

| Purpose    | Color      |
| ---------- | ---------- |
| Primary    | Blue       |
| Success    | Green      |
| Warning    | Orange     |
| Danger     | Red        |
| Background | Light Gray |
| Surface    | White      |
| Text       | Dark Gray  |


===

Typography
| Usage | Size |
| ----- | ---- |
| H1    | 32px |
| H2    | 24px |
| H3    | 20px |
| Body  | 16px |
| Small | 14px |

===

Spacing

Use an 8px spacing system.

===

Border Radius
Buttons

8px

Cards

12px

Inputs

8px

Modal

16px

===

4. Layout

Desktop layout:
+------------------------------------------------------------+
| Sidebar |                     Header                      |
|         |------------------------------------------------|
|         | Breadcrumb                                     |
|         |                                                |
|         | Dashboard / Page Content                       |
|         |                                                |
+------------------------------------------------------------+

Sidebar width:

260px

Header:

72px

===

5. Navigation Structure
Dashboard

Employees
    Employee List
    Add Employee

Departments

Positions

Attendance

Leave

Payroll

Reports

Settings

===

6. Screen Inventory

Before drawing anything, list every screen.

Authentication
Register
Login
Forgot Password
Reset Password
Dashboard
Dashboard Home
Employees
Employee List
Employee Details
Add Employee
Edit Employee
Departments
Department List
Create Department
Attendance
Attendance List
Daily Attendance
Leave
Leave List
Leave Request
Leave Approval
Payroll
Payroll List
Payslip
Reports
Employee Report
Attendance Report
Payroll Report
Settings
Company
Roles
Users
Permissions

===

7. Reusable Components
Button

Input

Select

Date Picker

Badge

Avatar

Card

Table

Modal

Drawer

Alert

Toast

Pagination

Breadcrumb

Sidebar

Navbar

===

8. Page Template

Every CRUD page should follow the same structure.
------------------------------------------------

Breadcrumb

Page Title

+ Add Button

-----------------------------------------------

Search

Filters

-----------------------------------------------

Table

-----------------------------------------------

Pagination

===

9. Dashboard Widgets
Total Employees

Present Today

Absent Today

Pending Leave

Departments

Monthly Payroll

Recent Activities

Upcoming Holidays

===

10. Figma File Structure
HRMS Pro

01 Cover

02 Design System

03 Components

04 Authentication

05 Dashboard

06 Employee

07 Department

08 Attendance

09 Leave

10 Payroll

11 Reports

12 Settings

13 Prototype

===

Lesson 9 — Design System

We'll create:

Color Palette
Typography Scale
Icon Rules
Buttons (Primary, Secondary, Danger)
Inputs
Selects
Checkboxes
Radio Buttons
Tables
Cards
Badges
Status Chips
Modals
Toast Notifications
Form Validation Styles
Light & Dark Theme Tokens
