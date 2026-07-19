File 21: API Specifications (Detailed)
1. Complete API Documentation
Response Standards
javascript
// Success Response
{
    "success": true,
    "message": "Operation successful",
    "data": {
        // Actual response data
    },
    "meta": {
        "timestamp": "2024-01-01T12:00:00Z",
        "version": "v1"
    }
}

// Error Response
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "field_name": [
            "The field name is required"
        ]
    },
    "code": 422,
    "meta": {
        "timestamp": "2024-01-01T12:00:00Z"
    }
}

// Paginated Response
{
    "success": true,
    "data": {
        "items": [],
        "total": 100,
        "per_page": 15,
        "current_page": 1,
        "last_page": 7
    }
}
2. Detailed API Endpoints
Authentication APIs
http
### POST /api/v1/auth/login
Request:
{
    "email": "admin@company.com",
    "password": "password123",
    "remember": true // optional
}

Response (Success):
{
    "success": true,
    "data": {
        "user": {
            "id": 1,
            "name": "Admin",
            "email": "admin@company.com",
            "role": {
                "id": 1,
                "name": "Super Admin",
                "permissions": ["employee.view", "employee.create", ...]
            },
            "employee_id": 1,
            "avatar": "https://...",
            "last_login": "2024-01-01 12:00:00"
        },
        "token": "1|xxxxxxxxxxxxxxxxxxxxx",
        "token_type": "Bearer",
        "expires_in": 3600
    }
}

Response (Error):
{
    "success": false,
    "message": "Invalid credentials",
    "code": 401
}
Employee APIs
http
### GET /api/v1/employees
Headers:
    Authorization: Bearer {token}
    Accept: application/json

Query Parameters:
    page: 1
    per_page: 15
    search: John
    department_id: 1
    position_id: 2
    employment_status: active
    sort_by: first_name
    sort_order: asc
    from_date: 2024-01-01
    to_date: 2024-12-31

Response:
{
    "success": true,
    "data": {
        "employees": [
            {
                "id": 1,
                "employee_code": "EMP001",
                "first_name": "John",
                "last_name": "Doe",
                "full_name": "John Doe",
                "email": "john@company.com",
                "phone": "1234567890",
                "gender": "male",
                "date_of_birth": "1990-01-15",
                "hire_date": "2020-01-01",
                "employment_status": "active",
                "department": {
                    "id": 1,
                    "name": "Engineering"
                },
                "position": {
                    "id": 1,
                    "name": "Senior Developer"
                },
                "profile_photo": "https://...",
                "created_at": "2024-01-01T12:00:00Z"
            }
        ],
        "pagination": {
            "total": 100,
            "per_page": 15,
            "current_page": 1,
            "last_page": 7
        }
    }
}

### POST /api/v1/employees
Request:
{
    "employee_code": "EMP001",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@company.com",
    "phone": "1234567890",
    "gender": "male",
    "date_of_birth": "1990-01-15",
    "hire_date": "2020-01-01",
    "department_id": 1,
    "position_id": 1,
    "employment_status": "active"
}

Response (Success):
{
    "success": true,
    "message": "Employee created successfully",
    "data": {
        "employee": {
            "id": 1,
            "employee_code": "EMP001",
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@company.com"
        }
    }
}

Response (Validation Error):
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "email": [
            "The email has already been taken"
        ],
        "employee_code": [
            "The employee code has already been taken"
        ]
    },
    "code": 422
}

### PUT /api/v1/employees/{id}
Request:
{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@company.com",
    "phone": "1234567890",
    "gender": "male",
    "date_of_birth": "1990-01-15",
    "hire_date": "2020-01-01",
    "department_id": 1,
    "position_id": 1,
    "employment_status": "active"
}

### DELETE /api/v1/employees/{id}
Response:
{
    "success": true,
    "message": "Employee deleted successfully"
}
Department APIs
http
### GET /api/v1/departments
Response:
{
    "success": true,
    "data": {
        "departments": [
            {
                "id": 1,
                "name": "Engineering",
                "code": "ENG",
                "description": "Software development team",
                "manager_id": 1,
                "manager": {
                    "id": 1,
                    "name": "John Doe"
                },
                "employee_count": 25,
                "created_at": "2024-01-01T12:00:00Z"
            }
        ]
    }
}

### POST /api/v1/departments
Request:
{
    "name": "Human Resources",
    "code": "HR",
    "description": "HR department",
    "manager_id": 2
}
Attendance APIs
http
### POST /api/v1/attendance/check-in
Request:
{
    "latitude": "37.7749",
    "longitude": "-122.4194",
    "location": "Office",
    "notes": "Checked in at office"
}

Response:
{
    "success": true,
    "data": {
        "attendance": {
            "id": 1,
            "employee_id": 1,
            "date": "2024-01-01",
            "check_in": "09:00:00",
            "status": "present"
        }
    }
}

### POST /api/v1/attendance/check-out
Request:
{
    "notes": "Checked out"
}

Response:
{
    "success": true,
    "data": {
        "attendance": {
            "id": 1,
            "employee_id": 1,
            "date": "2024-01-01",
            "check_in": "09:00:00",
            "check_out": "18:00:00",
            "work_hours": 8,
            "status": "present"
        }
    }
}
Leave APIs
http
### GET /api/v1/leave-requests
Query Parameters:
    status: pending|approved|rejected
    employee_id: 1
    from_date: 2024-01-01
    to_date: 2024-12-31

### POST /api/v1/leave-requests
Request:
{
    "leave_type": "annual",
    "start_date": "2024-01-15",
    "end_date": "2024-01-20",
    "reason": "Vacation",
    "attachment": "file"
}

Response:
{
    "success": true,
    "data": {
        "leave_request": {
            "id": 1,
            "employee_id": 1,
            "leave_type": "annual",
            "start_date": "2024-01-15",
            "end_date": "2024-01-20",
            "days": 5,
            "status": "pending",
            "reason": "Vacation"
        }
    }
}

### PUT /api/v1/leave-requests/{id}/approve
Request:
{
    "approver_notes": "Approved"
}

Response:
{
    "success": true,
    "message": "Leave request approved"
}
Payroll APIs
http
### POST /api/v1/payrolls/generate
Request:
{
    "month": "2024-12",
    "employee_ids": [1, 2, 3] // optional
}

Response:
{
    "success": true,
    "message": "Payroll generated successfully",
    "data": {
        "payrolls": [
            {
                "id": 1,
                "employee_id": 1,
                "month": "2024-12",
                "basic_salary": 50000,
                "allowances": {"housing": 5000, "transport": 2000},
                "deductions": {"tax": 2500, "insurance": 1500},
                "gross_salary": 57000,
                "net_salary": 53000,
                "status": "pending"
            }
        ]
    }
}

### GET /api/v1/payrolls/{id}/download
Response:
    // Binary PDF file
    Content-Type: application/pdf
    Content-Disposition: attachment; filename="payslip_EMP001_Dec2024.pdf"
Report APIs
http
### GET /api/v1/reports/employees
Query Parameters:
    format: pdf|excel|csv
    department_id: 1
    status: active
    date_range: start=2024-01-01&end=2024-12-31

### GET /api/v1/reports/attendance
Query Parameters:
    format: pdf|excel|csv
    employee_id: 1
    month: 2024-12

### GET /api/v1/reports/payroll
Query Parameters:
    format: pdf|excel|csv
    month: 2024-12
    department_id: 1
3. Webhook APIs
http
### POST /api/v1/webhooks/payroll
Request:
{
    "event": "payroll.generated",
    "data": {
        "payroll_id": 1,
        "employee_id": 1,
        "amount": 53000,
        "month": "2024-12"
    },
    "timestamp": "2024-01-01T12:00:00Z"
}

### POST /api/v1/webhooks/employee
Request:
{
    "event": "employee.created",
    "data": {
        "employee_id": 1,
        "email": "john@company.com",
        "name": "John Doe"
    }
}