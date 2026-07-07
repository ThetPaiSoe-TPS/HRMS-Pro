HRMS Pro — Use Case Document

1. What is a Use Case?

A use case describes:

Who uses the system, what they do, and what the system does in response.

2. System Actors

Our system has four main actors:
                 HRMS Pro


          +----------------+
          |  Super Admin   |
          +----------------+

                 |
                 |

          +----------------+
          |  HR Manager    |
          +----------------+

                 |
                 |

          +----------------+
          | Department Mgr |
          +----------------+

                 |
                 |

          +----------------+
          |   Employee     |
          +----------------+

===

3. High-Level Use Case Diagram
                     HRMS PRO


 Super Admin
      |
      |
      |---------------- Manage Users
      |
      |---------------- Manage Roles
      |
      |---------------- System Settings



 HR Manager
      |
      |
      |---------------- Employee Management
      |
      |---------------- Department Management
      |
      |---------------- Attendance Management
      |
      |---------------- Leave Management
      |
      |---------------- Payroll Management
      |
      |---------------- Reports



 Department Manager
      |
      |
      |---------------- View Team
      |
      |---------------- Approve Leave
      |
      |---------------- View Reports



 Employee
      |
      |
      |---------------- View Profile
      |
      |---------------- Check Attendance
      |
      |---------------- Apply Leave
      |
      |---------------- View Payslip

===

4. Authentication Flow
Use Case: Login
Actor

All users

Goal

Allow users to access the system securely.
User

 ↓

Enter Email + Password

 ↓

System validates credentials

 ↓

Check user role

 ↓

Generate access token

 ↓

Redirect dashboard
===

Alternative Flow

Wrong password:
User enters wrong password

↓

System rejects login

↓

Show error message

===

5. Employee Management Flow
Actor

HR Manager

Create Employee
HR Manager

 ↓

Open Employee Page

 ↓

Click Add Employee

 ↓

Fill Employee Form

 ↓

Submit

 ↓

Backend validates data

 ↓

Save database

 ↓

Return success response

 ↓

Display employee list

---

Database Interaction
React Form

    ↓

Laravel API

    ↓

Employee Controller

    ↓

Employee Model

    ↓

MySQL

employees table

---

6. Leave Approval Flow
Actors

Employee + Department Manager

Employee

 ↓

Create Leave Request

 ↓

System saves request

 ↓

Status = Pending

 ↓

Manager receives notification

 ↓

Manager reviews request

        |
        |
   +----+----+
   |         |
Approve   Reject

   |         |

Approved  Rejected

   |

Update Leave Balance

   |

Notify Employee

===

7. Attendance Flow
Employee Check-in
Employee

 ↓

Click Check In

 ↓

System checks:

- Already checked in?
- Current date?

 ↓

Create attendance record

 ↓

Save time

 ↓

Show success

===

Database:

attendance

id
employee_id
date
check_in
check_out
status

===

8. Payroll Flow
Actor

HR Manager
HR Manager

 ↓

Select Month

 ↓

System collects:

Employee Salary

Attendance

Overtime

Allowances

Deductions

 ↓

Calculate Salary

 ↓

Generate Payslip

 ↓

Save Payroll Record

 ↓

Employee downloads PDF

===

9. Permission Flow

Every request follows:
React Application

        ↓

Laravel API

        ↓

Authentication Middleware

        ↓

Permission Check

        ↓

Controller

        ↓

Database

===

10. Main System Navigation Flow

After Login:
                 Login

                   |

              Dashboard

                   |

     +-------------+-------------+

     |             |             |

 Employee     Attendance     Leave

     |

 Department

     |

 Payroll

     |

 Reports

     |

 Settings

===

11. Complete Project Flow

Business Requirement

        ↓

System Requirement

        ↓

User Stories

        ↓

Use Cases

        ↓

Database Design

        ↓

API Design

        ↓

UI Design

        ↓

Development

        ↓

Testing

        ↓

Deployment

===

12. Use Case Summary Table
| Actor              | Use Case                                 |
| ------------------ | ---------------------------------------- |
| Super Admin        | Users, Roles, Settings                   |
| HR Manager         | Employees, Departments, Payroll, Reports |
| Department Manager | Team, Leave Approval                     |
| Employee           | Profile, Attendance, Leave, Payslip      |


===

