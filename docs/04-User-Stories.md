HRMS Pro — User Stories Document

1. Introduction
Purpose

This document describes system functionality from the perspective of different users.

The format:
As a [user role]

I want to [action]

So that [business value]

---

2. User Roles

The system has four main actors:
                 HRMS Pro

        ┌───────────────┐
        │  Super Admin  │
        └───────┬───────┘
                │

        ┌───────┴───────┐
        │  HR Manager   │
        └───────┬───────┘
                │

        ┌───────┴────────┐
        │ Department Mgr │
        └───────┬────────┘
                │

        ┌───────┴───────┐
        │   Employee    │
        └───────────────┘

===

3. Authentication User Stories
US-AUTH-001
Login

User Story
Acceptance Criteria

Given:

User has registered account

When:

User enters valid email and password

Then:

System authenticates user
Redirects to dashboard

---

US-AUTH-002
Logout

Acceptance Criteria:

Token/session is invalidated
User returns to login page

---

4. Dashboard User Stories
US-DASH-001

Acceptance Criteria:

Dashboard displays:

Total employees
Attendance today
Pending leaves
Departments
Payroll summary

---

5. Employee Management User Stories
US-EMP-001
Create Employee
Acceptance Criteria:

Required fields:

Employee ID
Name
Email
Department
Position
Join Date

System should:

Validate data
Save employee
Show success message

---

US-EMP-002
View Employee List
Acceptance Criteria:

Employee list supports:

Search
Filter
Pagination
Sorting

---

US-EMP-003
Update Employee

US-EMP-004
Delete Employee
Business rule:
Use soft delete
Keep history

---

6. Department Management
US-DEPT-001

---

7. Attendance User Stories
US-ATT-001
Check In

Date
Time
Employee
Status

---

US-ATT-002
Attendance Report

---

8. Leave Management
US-LEAVE-001
Apply Leave

Required:

Leave Type
Start Date
End Date
Reason

---

US-LEAVE-002
Approve Leave
Status:

Pending

Approved

Rejected

---

9. Payroll User Stories
US-PAY-001

Calculation:

Basic Salary

+
Allowance

-
Deduction

=

Net Salary

---

10. Reports
US-REPORT-001
Export:

PDF
Excel

---

11. Priority Table
| ID        | Feature        | Priority |
| --------- | -------------- | -------- |
| US-AUTH   | Authentication | Must     |
| US-DASH   | Dashboard      | Must     |
| US-EMP    | Employee       | Must     |
| US-DEPT   | Department     | Must     |
| US-ATT    | Attendance     | Must     |
| US-LEAVE  | Leave          | Must     |
| US-PAY    | Payroll        | Should   |
| US-REPORT | Reports        | Should   |


---

12. Example Complete Workflow
Employee Leave Request Flow
Employee

Login

 ↓

Open Leave Page

 ↓

Submit Request

 ↓

Status = Pending

 ↓

Manager Reviews

 ↓

Approve / Reject

 ↓

Employee Receives Notification

 ↓

Leave Balance Updated

===

13. QA Test Example

User Story:

Test cases:
| Test                 | Expected Result      |
| -------------------- | -------------------- |
| Valid leave request  | Created successfully |
| Empty reason         | Validation error     |
| Invalid date         | Error message        |
| Insufficient balance | Request rejected     |

===





