Complete Data Flow Summary Table

Level 0 (Context Diagram)
| External Entity    | Process  | Output                                   |
| ------------------ | -------- | ---------------------------------------- |
| Super Admin        | HRMS Pro | User Management, Reports                 |
| HR Manager         | HRMS Pro | Employee Management, Attendance, Payroll |
| Department Manager | HRMS Pro | Leave Approval, Team Information         |
| Employee           | HRMS Pro | Attendance, Leave, Profile, Payslip      |

===

Level 1 Processes
| Process ID | Module                | Data Store          |
| ---------- | --------------------- | ------------------- |
| 1.0        | Authentication        | D1 Users            |
| 2.0        | Dashboard             | D1–D8               |
| 3.0        | Employee Management   | D2 Employees        |
| 4.0        | Department Management | D3 Departments      |
| 5.0        | Position Management   | D4 Positions        |
| 6.0        | Attendance Management | D5 Attendance       |
| 7.0        | Leave Management      | D6 Leave Requests   |
| 8.0        | Payroll Management    | D7 Payroll          |
| 9.0        | Reports               | D8 Reports          |
| 10.0       | Settings              | D9 Company Settings |

===

Data Store Definitions
| ID | Data Store     | Contains               |
| -- | -------------- | ---------------------- |
| D1 | Users          | Login accounts, roles  |
| D2 | Employees      | Employee profiles      |
| D3 | Departments    | Department information |
| D4 | Positions      | Job titles             |
| D5 | Attendance     | Daily attendance       |
| D6 | Leave Requests | Leave records          |
| D7 | Payroll        | Salary records         |
| D8 | Reports        | Generated reports      |
| D9 | Settings       | Company settings       |

===

1. Authentication DFD
External Entity:
Employee
HR Manager
Department Manager
Super Admin

| ID  | Process              |
| --- | -------------------- |
| 1.1 | Login                |
| 1.2 | Validate Credentials |
| 1.3 | Generate Token       |
| 1.4 | Logout               |

data flow:
User

↓

Enter Email & Password

↓

1.1 Login

↓

1.2 Validate Credentials

↓

D1 Users

↓

Valid?

↓

Yes

↓

1.3 Generate Token

↓

Dashboard

↓

Logout

↓

1.4 Logout

===

2. Dashboard DFD
Input
Employee
HR Manager
Department Manager

| ID  | Process         |
| --- | --------------- |
| 2.1 | Load Dashboard  |
| 2.2 | Get Statistics  |
| 2.3 | Display Summary |

data store:
D2 Employees

D5 Attendance

D6 Leave

D7 Payroll

===

3. Employee Management DFD
External Entity:
HR Manager

| ID  | Process           |
| --- | ----------------- |
| 3.1 | Create Employee   |
| 3.2 | Validate Employee |
| 3.3 | Save Employee     |
| 3.4 | View Employee     |
| 3.5 | Update Employee   |
| 3.6 | Delete Employee   |

Data Store
D2 Employees

data flow: 
HR Manager

↓

Enter Employee Information

↓

Validate

↓

Save Employee

↓

Employees Database

↓

Return Success

↓

Display Employee List

===

4. Department Management DFD
External Entity

HR Manager
| ID  | Process           |
| --- | ----------------- |
| 4.1 | Create Department |
| 4.2 | Update Department |
| 4.3 | Delete Department |
| 4.4 | Assign Manager    |

Data Store
D3 Departments

===

5. Position Management DFD
External Entity

HR Manager

| ID  | Process         |
| --- | --------------- |
| 5.1 | Create Position |
| 5.2 | Update Position |
| 5.3 | Delete Position |

Data Store
D4 Positions

===

6. Attendance Management DFD
External Entity

Employee

HR Manager
| ID  | Process             |
| --- | ------------------- |
| 6.1 | Check In            |
| 6.2 | Check Out           |
| 6.3 | Validate Attendance |
| 6.4 | Save Attendance     |
| 6.5 | Attendance Report   |

Data Store
D5 Attendance

Employee

↓

Check In

↓

Validate Employee

↓

Already Checked In?

↓

No

↓

Save Attendance

↓

Attendance Database

↓

Return Success

===

7. Leave Management DFD
External Entities

Employee
Department Manager
HR Manager

process:
| ID  | Process                |
| --- | ---------------------- |
| 7.1 | Apply Leave            |
| 7.2 | Validate Leave Balance |
| 7.3 | Save Request           |
| 7.4 | Approve Leave          |
| 7.5 | Reject Leave           |
| 7.6 | Update Leave Status    |

Data Store
D6 Leave Requests

data flow:
Employee

↓

Apply Leave

↓

Validate Leave Balance

↓

Save Request

↓

Leave Database

↓

Manager Review

↓

Approve / Reject

↓

Update Leave Status

↓

Notify Employee

===

8. Payroll Management DFD
External Entity

HR Manager
Employee

| ID  | Process          |
| --- | ---------------- |
| 8.1 | Generate Payroll |
| 8.2 | Calculate Salary |
| 8.3 | Save Payroll     |
| 8.4 | Generate Payslip |
| 8.5 | Download Payslip |

Data Stores
D5 Attendance
D2 Employees
D7 Payroll

data flow:
HR Manager

↓

Generate Payroll

↓

Collect Attendance

↓

Collect Salary

↓

Calculate Salary

↓

Save Payroll

↓

Payroll Database

↓

Generate PDF

↓

Employee Downloads Payslip

===

9. Reports DFD
External Entity:
HR Manager
Super Admin

process:
| ID  | Process           |
| --- | ----------------- |
| 9.1 | Employee Report   |
| 9.2 | Attendance Report |
| 9.3 | Leave Report      |
| 9.4 | Payroll Report    |
| 9.5 | Export PDF        |
| 9.6 | Export Excel      |

data store:
D2 Employees
D5 Attendance
D6 Leave
D7 Payroll

===

10. Settings DFD
External Entity:
Super Admin

process:
| ID   | Process               |
| ---- | --------------------- |
| 10.1 | Company Settings      |
| 10.2 | User Management       |
| 10.3 | Role Management       |
| 10.4 | Permission Management |

data store:
D1 Users
D9 Settings

===

Recommended Figma Pages
📄 01 Context Diagram (Level 0)

📄 02 Level 1 DFD

📄 03 Authentication

📄 04 Dashboard

📄 05 Employee

📄 06 Department

📄 07 Position

📄 08 Attendance

📄 09 Leave

📄 10 Payroll

📄 11 Reports

📄 12 Settings

===

