HRMS-Pro UI/UX Design System Prompt

Your task is to design and maintain a complete UI/UX system for this project.

================================================

PROJECT OBJECTIVE

HRMS-Pro is a complete Human Resource Management System that manages:

- Employee information
- Departments
- Positions
- Attendance
- Leave management
- Payroll
- Reports
- Users
- Roles and permissions
- Company settings

The design must communicate:

- Professional enterprise software
- Trust
- Security
- Productivity
- Data management
- Ease of use

Target users:

1. Super Admin
2. HR Manager
3. Department Manager
4. Employee

================================================

DESIGN PRINCIPLE

Follow these principles:

- Clean enterprise dashboard style
- Minimal but professional
- High readability
- Data-focused interface
- Consistent spacing
- Clear hierarchy
- Easy navigation
- Accessible design
- Responsive for desktop, tablet, and mobile

Avoid:

- Gaming style
- Excessive animations
- Too many colors
- Over decoration
- Complex navigation

================================================

COLOR SYSTEM

Use the 60/30/10 color distribution rule.

--------------------------------

PRIMARY COLOR (60%)

Color:
Light Gray

Hex:
#F5F5F5

Usage:

- Main application background
- Page background
- Form backgrounds
- Empty spaces
- Dashboard sections

--------------------------------

SECONDARY COLOR (30%)

Color:
Navy

Hex:
#1E3A8A

Usage:

- Sidebar navigation
- Top header
- Navigation elements
- Active menu items
- Section headers
- Branding

--------------------------------

ACCENT COLOR (10%)

Color:
Teal

Hex:
#14B8A6

Usage:

- Primary buttons
- Important actions
- Active states
- Success highlights
- Charts
- Notifications

--------------------------------

ERROR COLOR

Red:

#DC2626

Usage:

- Validation errors
- Delete actions
- Warning messages
- Failed operations

--------------------------------

Additional colors:

Success:
#16A34A

Warning:
#F59E0B

Info:
#2563EB

Border:
#E5E7EB

Text Primary:
#111827

Text Secondary:
#6B7280


================================================

GRADIENT RULES

Use gradients carefully.

Allowed:

Header gradient:

Navy → Teal

Example:

#1E3A8A → #14B8A6


Button gradient:

Teal → Emerald

Example:

#14B8A6 → #10B981


Do not use gradients everywhere.

Use only for:

- Login page
- Dashboard hero cards
- Important CTA buttons
- Empty states

================================================

TYPOGRAPHY

Use modern enterprise typography.

Recommended:

Font:
Inter

Hierarchy:

Page Title:
32px / Bold

Section Title:
24px / Semi Bold

Card Title:
18px / Medium

Body:
14-16px

Small Text:
12px

Maintain:

- Clear spacing
- Good contrast
- Easy scanning


================================================

LAYOUT SYSTEM

Application Layout:

Desktop:


+--------------------------------+
| Header |
+----------+---------------------+
| Sidebar | Main Content |
| | |
| | |
+----------+---------------------+



Sidebar:

Width:
260px

Background:
#1E3A8A


Main content:

Background:
#F5F5F5


Cards:

Background:
White

Border:
#E5E7EB

Radius:
12px


================================================

SIDEBAR DESIGN

Create navigation with icons.

Structure:

Dashboard

Employee Management
    - Employee List
    - Departments
    - Positions

Attendance
    - Attendance Records
    - Check In / Check Out

Leave Management
    - Leave Requests
    - Apply Leave
    - Leave Approval
    - Leave Types

Payroll
    - Payroll List
    - Generate Payroll
    - Payslips

Reports

Announcements

Administration
    - Users
    - Roles
    - Permissions
    - Company Settings

Profile

Logout


Sidebar behavior:

- Active menu uses Teal highlight
- Hover uses subtle opacity
- Collapsible on smaller screens


================================================

COMPONENT DESIGN SYSTEM

Create reusable components:

Buttons:

Types:

Primary:
Teal background

Secondary:
Navy background

Danger:
Red background


Inputs:

Include:

- Label
- Placeholder
- Required indicator
- Error message
- Helper text


Tables:

Features:

- Search
- Filter
- Sorting
- Pagination
- Row actions

Actions:

View
Edit
Delete


Cards:

Use for:

Dashboard statistics

Example:

Total Employees

Attendance Today

Pending Leaves

Payroll Cost


Modal:

Use for:

Delete confirmation

Quick actions


Badge:

Statuses:

Active
Inactive
Pending
Approved
Rejected
Paid


================================================

PAGE DESIGN REQUIREMENTS


Create UI according to these modules:

--------------------------------

AUTHENTICATION

Login:

Include:

- Company logo
- Email field
- Password field
- Remember me
- Forgot password
- Login button

Style:

Professional centered card.

Use Navy + Teal gradient subtly.

--------------------------------

DASHBOARD

Include:

Statistics cards:

- Total Employees
- Present Today
- Pending Leave
- Payroll Summary


Charts:

- Attendance trend
- Employee distribution
- Leave statistics


Recent activity table.

--------------------------------

EMPLOYEE MODULE

Pages:

Employee List

Include:

- Search
- Filter
- Add Employee button
- Data table


Employee Detail:

Sections:

- Personal Information
- Employment Information
- Attendance Summary
- Leave Summary
- Payroll Summary


Employee Form:

Fields:

- Name
- Email
- Phone
- Department
- Position
- Hire Date
- Status
- Profile Photo

--------------------------------

ATTENDANCE MODULE

Pages:

Attendance List

Include:

- Date filter
- Employee filter
- Status filter


Attendance Detail:

Show:

- Employee
- Check in
- Check out
- Working hours
- Overtime
- Status


--------------------------------

LEAVE MODULE

Pages:

Leave Request List

Leave Detail

Apply Leave


Show:

- Leave type
- Date range
- Reason
- Approval status
- Approval timeline


--------------------------------

PAYROLL MODULE

Design professional financial UI.

Show:

- Salary breakdown
- Allowances
- Bonuses
- Deductions
- Tax
- Net salary
- Payslip


Use cards and tables.

--------------------------------

ADMINISTRATION

Pages:

Users

Roles

Permissions

Settings


================================================

RESPONSIVE RULES

Desktop:

Full sidebar

Tablet:

Collapsible sidebar

Mobile:

Drawer navigation


Tables:

Desktop:
Full table

Mobile:
Card layout


================================================

UX RULES

Every page must include:

- Page title
- Breadcrumb
- Main action button
- Loading state
- Empty state
- Error state

Every destructive action requires:

Confirmation modal.


================================================

OUTPUT EXPECTATION

For every screen provide:

1. Layout structure
2. Components used
3. Color usage
4. User interaction
5. Responsive behavior
6. Empty/loading/error states

Maintain the same design language throughout the entire HRMS-Pro application.