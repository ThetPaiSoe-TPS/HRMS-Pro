Payroll Module Documentation
Module Purpose

The Payroll module calculates an employee's monthly salary based on:

Basic Salary
Attendance
Overtime
Allowances
Bonuses
Deductions
Tax
Leave
Payment Status

Finally, it generates a payslip.

---

Payroll Workflow
Month Starts
        │
        ▼
Attendance Records Collected
        │
        ▼
Approved Leave Applied
        │
        ▼
Overtime Calculated
        │
        ▼
Allowances Added
        │
        ▼
Deductions Calculated
        │
        ▼
Tax Calculated
        │
        ▼
Net Salary Calculated
        │
        ▼
HR Reviews Payroll
        │
        ▼
Payroll Approved
        │
        ▼
Payslip Generated
        │
        ▼
Employee Can View Payslip
Payroll Status
Status	Description
Draft	Payroll created but not calculated
Calculated	Salary calculated
Pending Approval	Waiting for HR approval
Approved	Final payroll
Paid	Salary transferred
Cancelled	Payroll cancelled

---

Payroll Formula
Net Salary

=

Basic Salary

+

Allowances

+

Overtime Pay

+

Bonus

-

Late Deduction

-

Absent Deduction

-

Unpaid Leave Deduction

-

Tax

-

Other Deductions

---

Payroll Detail
Employee Information

Display

Employee ID
Employee Name
Department
Position
Hire Date
Payroll Month
Payroll Year

---

Salary Information
Field	Description
Basic Salary	Fixed monthly salary
Daily Salary	Auto calculated
Hourly Salary	Auto calculated

Example

Basic Salary

1,000,000 MMK

Daily Salary

Basic

÷

Working Days

Hourly Salary

Daily

÷

Working Hours

---

Attendance Summary

Display

Field
Working Days
Present Days
Late Days
Absent Days
Paid Leave
Unpaid Leave
Holiday
Weekend

---

Overtime

Display

Field
Normal OT Hours
Weekend OT
Holiday OT
Total OT Hours
OT Rate
OT Amount
Allowances

Examples

Type
Transport
Meal
Phone
Housing
Internet
Position Allowance
Shift Allowance
Project Allowance
Attendance Allowance

Each

Allowance Name

Amount
Bonus

Examples

Performance Bonus

Festival Bonus

Year-end Bonus

Referral Bonus

Project Bonus

Deductions

Examples

Type
Late Deduction
Absent Deduction
Unpaid Leave
Loan
Advance Salary
Insurance
Tax
Other
Tax

Display

Tax Percentage

Tax Amount

Tax Rule

Example

5%
Loan

Some companies deduct loans monthly.

Display

Outstanding Loan

Monthly Installment

Remaining Balance

Advance Salary

If employee already received

200,000 MMK

Deduct from payroll.

Final Summary

Display

Basic Salary

+

Allowances

+

Bonus

+

Overtime

-------------------

Gross Salary

-------------------

Late

Absent

Tax

Loan

Advance

Other Deduction

-------------------

Net Salary

---

Payment Information

Display

Payment Date

Payment Method

Bank

Bank Account

Transaction Number

Paid By

Payroll Notes

Free text

HR Notes

Finance Notes

Employee Notes

Payslip

Header

Company Logo

Company Name

Employee Information

Payroll Month

Body

Salary Breakdown

Allowance Breakdown

Deduction Breakdown

Net Salary

Footer

Prepared By

Approved By

Employee Signature

HR Signature

Payroll List

Columns

Column
Employee
Department
Month
Basic Salary
Gross Salary
Deduction
Net Salary
Payment Status
Action

Actions

View

Generate Payslip

Approve

Mark Paid

Download PDF

---

Business Rules
Rule 1

One employee

↓

One payroll

↓

Per month

Cannot generate two payrolls for the same employee and month.

---

Rule 2

Payroll can only be generated after attendance is finalized.

Rule 3

Only approved leave affects payroll.

Pending or rejected leave should not.

Rule 4

Only approved overtime is included.

Rule 5

Payroll cannot be edited after payment.

Rule 6

Deleting payroll is not allowed after approval.

Only cancellation with an audit trail.

Rule 7

Salary history must never be overwritten.

If corrections are needed:

Cancel the old payroll (if not paid, according to your business rules).
Generate a new payroll version or adjustment.
Rule 8

Employees can only view their own payslips.

---

Payroll Dashboard

Cards

Payroll Generated

Pending Approval

Paid

Unpaid

Total Payroll Cost

Average Salary

Charts

Monthly Payroll

Department Payroll Cost

Salary Distribution

---

Real Payroll Generation Flow
HR Selects Payroll Month
        │
        ▼
Select Employees
        │
        ▼
System Loads:
  • Employee Basic Salary
  • Attendance Summary
  • Approved Leave
  • Approved Overtime
  • Active Allowances
  • Active Deductions
        │
        ▼
Calculate Gross Salary
        │
        ▼
Calculate Tax
        │
        ▼
Calculate Net Salary
        │
        ▼
Save as Draft
        │
        ▼
HR Reviews & Approves
        │
        ▼
Finance Marks as Paid
        │
        ▼
Employee Views/Downloads Payslip

====

Backend Flow Explanation

1. Payroll Generation Flow
---
1. HR selects payroll month (year/month)
2. HR selects employees (or all active employees)
3. System checks for existing payroll records
4. For each employee, system:
   a. Gets basic salary from EmployeeSalary table
   b. Calculates daily/hourly rates
   c. Fetches attendance data (present, late, absent days)
   d. Fetches approved leaves (paid/unpaid)
   e. Fetches approved overtime
   f. Fetches active allowances
   g. Fetches bonuses for the period
   h. Calculates all components
   i. Saves payroll with 'draft' status
   j. Creates PayrollItem records
5. Returns generated payroll list

===

2. Payroll Calculation Flow
---
1. Payroll in draft status
2. System recalculates all components:
   a. Gross Salary = Basic + Allowances + Overtime + Bonuses
   b. Deductions = Late + Absent + Unpaid Leave + Other
   c. Loan Deduction (if active)
   d. Advance Salary (if taken)
   e. Tax = Based on taxable income and tax brackets
   f. Net Salary = Gross - Total Deductions
3. Updates all fields
4. Status changes to 'calculated'
5. Updates PayrollItem records

===

3. Approval Flow
---
1. HR reviews calculated payroll
2. HR submits for approval (status: pending_approval)
3. HR Manager/HR Head approves (status: approved)
4. Finance department processes payment
5. Finance marks as paid (status: paid)
6. Payslip generated and available to employee

===

4. Business Rules Enforced
One payroll per employee per month - Unique constraint on (employee_id, payroll_month)

Attendance must be finalized - Check before generation

Only approved leave affects payroll - Filter by status: approved

Only approved overtime included - Filter by status: approved

Payroll cannot be edited after payment - canBeEdited() method check

Cannot delete after approval - Only cancellation allowed

Audit trail for cancellations - Notes field with cancellation reason

Salary history preserved - No overwrites, only new versions or cancellations

This implementation provides a complete, production-ready payroll system with proper separation of concerns, business rule enforcement, and a clean API structure.

xxx

payroll process
----
Generate → POST /api/v1/payrolls/generate with {month, year, employee_ids?} → PayrollService::generatePayroll() creates a payroll record per employee with status = "draft" and basic_salary from the employee

Calculate → POST /api/v1/payrolls/{payroll}/calculate → PayrollService::calculatePayroll() computes allowances, overtime, bonuses, deductions (late/absent/leave/loan/advance/tax/other), sets net_salary, and changes status = "calculated"

Submit for approval → POST /api/v1/payrolls/{payroll}/submit → status = "pending_approval"

Approve → PUT /api/v1/payrolls/{payroll}/approve → status = "approved", records approved_by and approved_at

Mark as paid → POST /api/v1/payrolls/{payroll}/mark-paid with {payment_date?, payment_method?} → status = "paid", records paid_by and paid_at
Cancel (any step) → POST /api/v1/payrolls/{payroll}/cancel → status = "cancelled"