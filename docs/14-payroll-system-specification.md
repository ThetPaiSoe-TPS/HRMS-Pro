1. Payroll Overview
The payroll module calculates employee salaries, manages allowances and deductions, and generates payslips.

2. Payroll Data Structure
Payroll Table
sql
CREATE TABLE payrolls (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    employee_id BIGINT NOT NULL,
    payroll_month DATE NOT NULL,
    
    -- Basic Salary Components
    basic_salary DECIMAL(15,2) NOT NULL,
    hourly_rate DECIMAL(10,2) DEFAULT NULL,
    
    -- Work Hours & Overtime
    total_work_days INT DEFAULT 0,
    present_days INT DEFAULT 0,
    absent_days INT DEFAULT 0,
    leave_days INT DEFAULT 0,
    overtime_hours DECIMAL(5,2) DEFAULT 0,
    overtime_rate DECIMAL(10,2) DEFAULT NULL,
    overtime_amount DECIMAL(15,2) DEFAULT 0,
    
    -- Allowances (JSON for flexibility)
    allowances JSON DEFAULT NULL,
    total_allowances DECIMAL(15,2) DEFAULT 0,
    
    -- Allowances Structure:
    -- {
    --   "housing": 5000,
    --   "transport": 2000,
    --   "meal": 1000,
    --   "medical": 3000,
    --   "others": 1000
    -- }
    
    -- Deductions (JSON for flexibility)
    deductions JSON DEFAULT NULL,
    total_deductions DECIMAL(15,2) DEFAULT 0,
    
    -- Deductions Structure:
    -- {
    --   "tax": 2500,
    --   "insurance": 1500,
    --   "loan": 1000,
    --   "others": 500
    -- }
    
    -- Final Calculation
    gross_salary DECIMAL(15,2) DEFAULT 0,
    net_salary DECIMAL(15,2) DEFAULT 0,
    
    -- Payment Details
    payment_method ENUM('bank_transfer', 'cash', 'check') DEFAULT 'bank_transfer',
    bank_name VARCHAR(100) DEFAULT NULL,
    bank_account VARCHAR(50) DEFAULT NULL,
    payment_date DATE DEFAULT NULL,
    payment_status ENUM('pending', 'processing', 'paid', 'failed') DEFAULT 'pending',
    
    -- Payslip
    payslip_path VARCHAR(255) DEFAULT NULL,
    payslip_generated_at TIMESTAMP NULL,
    
    -- Metadata
    notes TEXT DEFAULT NULL,
    created_by BIGINT DEFAULT NULL,
    approved_by BIGINT DEFAULT NULL,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    
    INDEX idx_employee_month (employee_id, payroll_month),
    INDEX idx_payment_status (payment_status),
    INDEX idx_payroll_month (payroll_month)
);
Payroll Detail Items Table
For tracking individual payroll components separately:

sql
CREATE TABLE payroll_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    payroll_id BIGINT NOT NULL,
    employee_id BIGINT NOT NULL,
    
    -- Item Type & Category
    item_type ENUM('allowance', 'deduction', 'earning', 'tax', 'insurance', 'loan') NOT NULL,
    category VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    
    -- Amount
    amount DECIMAL(15,2) NOT NULL,
    is_percentage BOOLEAN DEFAULT FALSE,
    percentage_value DECIMAL(5,2) DEFAULT NULL,
    
    -- Tracking
    reference_id BIGINT DEFAULT NULL,
    reference_type VARCHAR(50) DEFAULT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (payroll_id) REFERENCES payrolls(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    
    INDEX idx_payroll_items (payroll_id, item_type)
);
Payroll Settings Table
sql
CREATE TABLE payroll_settings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    
    -- Basic Settings
    payroll_cycle ENUM('monthly', 'bi_weekly', 'weekly') DEFAULT 'monthly',
    payroll_day INT DEFAULT 25, -- Day of month for payroll
    pay_day INT DEFAULT 30, -- Day of month for payment
    
    -- Tax Settings
    tax_regime VARCHAR(50) DEFAULT 'standard',
    tax_tables JSON DEFAULT NULL,
    -- {
    --   "brackets": [
    --     {"min": 0, "max": 300000, "rate": 0},
    --     {"min": 300001, "max": 600000, "rate": 5},
    --     {"min": 600001, "max": 1000000, "rate": 10}
    --   ]
    -- }
    
    -- Insurance Settings
    insurance_employee_rate DECIMAL(5,2) DEFAULT 0,
    insurance_employer_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Overtime Settings
    overtime_rate_multiplier DECIMAL(3,2) DEFAULT 1.5,
    holiday_rate_multiplier DECIMAL(3,2) DEFAULT 2.0,
    night_shift_rate_multiplier DECIMAL(3,2) DEFAULT 1.25,
    
    -- Loan/Deduction Settings
    max_loan_percentage DECIMAL(5,2) DEFAULT 30,
    min_loan_amount DECIMAL(15,2) DEFAULT 1000,
    
    -- Default Allowances
    default_allowances JSON DEFAULT NULL,
    -- {
    --   "housing": 5000,
    --   "transport": 2000,
    --   "meal": 1000
    -- }
    
    -- Default Deductions
    default_deductions JSON DEFAULT NULL,
    -- {
    --   "insurance": 1500,
    --   "pension": 500
    -- }
    
    company_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (company_id) REFERENCES company_settings(id),
    UNIQUE KEY unique_company_payroll (company_id)
);
Employee Salary Records Table
sql
CREATE TABLE employee_salaries (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    employee_id BIGINT NOT NULL,
    
    -- Salary Components
    base_salary DECIMAL(15,2) NOT NULL,
    hourly_rate DECIMAL(10,2) DEFAULT NULL,
    weekly_rate DECIMAL(10,2) DEFAULT NULL,
    monthly_rate DECIMAL(15,2) DEFAULT NULL,
    
    -- Allowance Structure
    allowances JSON DEFAULT NULL,
    -- {
    --   "housing": 5000,
    --   "transport": 2000,
    --   "meal": 1000,
    --   "medical": 3000
    -- }
    
    -- Deduction Structure
    deductions JSON DEFAULT NULL,
    -- {
    --   "insurance": 1500,
    --   "pension": 500
    -- }
    
    -- Payment Details
    bank_name VARCHAR(100) DEFAULT NULL,
    bank_account VARCHAR(50) DEFAULT NULL,
    bank_branch VARCHAR(100) DEFAULT NULL,
    account_type VARCHAR(50) DEFAULT NULL,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    effective_date DATE NOT NULL,
    end_date DATE DEFAULT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    INDEX idx_employee_salary (employee_id, is_active)
);
3. Salary Calculation Logic
Gross Salary Calculation
text
Gross Salary = Basic Salary + Total Allowances + Overtime Amount
Net Salary Calculation
text
Net Salary = Gross Salary - Total Deductions

Where:
- Total Allowances = Sum of all allowance items
- Total Deductions = Sum of all deduction items (tax, insurance, loans, etc.)
Overtime Calculation
text
Overtime Amount = Overtime Hours × Hourly Rate × Overtime Multiplier

Where:
- Hourly Rate = Monthly Salary / (Work Days × Daily Hours)
- Daily Hours = 8 (standard)
- Overtime Multiplier = 1.5 (weekdays), 2.0 (holidays)
Tax Calculation Example
php
public function calculateTax($annualSalary)
{
    $taxBrackets = [
        ['min' => 0, 'max' => 300000, 'rate' => 0],
        ['min' => 300001, 'max' => 600000, 'rate' => 5],
        ['min' => 600001, 'max' => 1000000, 'rate' => 10],
        ['min' => 1000001, 'max' => 2000000, 'rate' => 15],
        ['min' => 2000001, 'max' => PHP_INT_MAX, 'rate' => 20],
    ];
    
    $tax = 0;
    foreach ($taxBrackets as $bracket) {
        if ($annualSalary > $bracket['min']) {
            $taxableAmount = min($annualSalary, $bracket['max']) - $bracket['min'];
            $tax += $taxableAmount * ($bracket['rate'] / 100);
        }
    }
    return $tax;
}
4. API Endpoints
http
### Payroll Management

# Generate Monthly Payroll
POST /api/v1/payrolls/generate
{
    "month": "2024-12",
    "employee_ids": [1, 2, 3] // optional
}

# Get Payroll List
GET /api/v1/payrolls
?page=1
&per_page=15
&month=2024-12
&employee_id=1
&status=pending

# Get Single Payroll
GET /api/v1/payrolls/{id}

# Update Payroll
PUT /api/v1/payrolls/{id}
{
    "allowances": {
        "housing": 6000
    },
    "deductions": {
        "insurance": 2000
    },
    "notes": "Updated for December"
}

# Approve Payroll
PUT /api/v1/payrolls/{id}/approve

# Process Payment
PUT /api/v1/payrolls/{id}/pay

# Generate Payslip PDF
GET /api/v1/payrolls/{id}/payslip

# Download Payslip
GET /api/v1/payrolls/{id}/download

# Mark as Paid
PUT /api/v1/payrolls/{id}/mark-paid

### Employee Salary Management

# Get Employee Salary
GET /api/v1/employees/{id}/salary

# Update Employee Salary
PUT /api/v1/employees/{id}/salary
{
    "base_salary": 50000,
    "allowances": {
        "housing": 5000,
        "transport": 2000
    },
    "deductions": {
        "insurance": 1500
    }
}

### Payroll Settings

GET /api/v1/settings/payroll

PUT /api/v1/settings/payroll
{
    "payroll_cycle": "monthly",
    "payroll_day": 25,
    "pay_day": 30,
    "overtime_rate_multiplier": 1.5
}
5. Payroll Workflow
text
┌─────────────────────────────────────────────┐
│           Payroll Generation Flow           │
└─────────────────────────────────────────────┘

1. HR Manager triggers payroll generation
                ↓
2. System collects data for selected month
                ↓
3. For each employee:
   ├─ Get base salary
   ├─ Calculate attendance (present/absent/leave)
   ├─ Calculate overtime
   ├─ Apply allowances
   ├─ Apply deductions
   ├─ Calculate tax
   └─ Calculate net salary
                ↓
4. Generate payroll records
                ↓
5. Create individual payslips (PDF)
                ↓
6. Send notifications to employees
                ↓
7. HR Manager reviews & approves
                ↓
8. Process payments (bank transfer)
                ↓
9. Mark as paid & archive
6. Payslip Format
text
┌─────────────────────────────────────────────┐
│  COMPANY NAME                               │
│  Address: _______________________________   │
│  Phone: _______________________________     │
│  Email: _______________________________     │
│  Tax ID: _______________________________    │
├─────────────────────────────────────────────┤
│  PAYSLIP - DECEMBER 2024                    │
│                                             │
│  Employee: John Doe                         │
│  Employee ID: EMP001                        │
│  Department: Engineering                    │
│  Position: Senior Developer                 │
│  Join Date: Jan 15, 2020                   │
├─────────────────────────────────────────────┤
│  EARNINGS                   AMOUNT          │
│  ─────────────────────────────────          │
│  Basic Salary               50,000.00       │
│  Housing Allowance           5,000.00       │
│  Transport Allowance         2,000.00       │
│  Overtime (10 hrs @ 1.5x)   3,750.00       │
│  ─────────────────────────────────          │
│  Gross Salary               60,750.00       │
├─────────────────────────────────────────────┤
│  DEDUCTIONS                  AMOUNT          │
│  ─────────────────────────────────          │
│  Income Tax                  2,500.00       │
│  Health Insurance            1,500.00       │
│  Pension                      500.00        │
│  ─────────────────────────────────          │
│  Total Deductions            4,500.00       │
├─────────────────────────────────────────────┤
│  NET SALARY                 56,250.00       │
│                                             │
│  Payment Method: Bank Transfer              │
│  Bank: ABC Bank                             │
│  Account: 1234567890                        │
│  Payment Date: Dec 30, 2024                │
├─────────────────────────────────────────────┤
│  This is a system-generated payslip.       │
│  For inquiries, contact HR Department.     │
└─────────────────────────────────────────────┘





Payroll Controller Analysis & Data Generation Guide
1. Payroll Data Flow Overview
text
┌─────────────────────────────────────────────────────────────────────────┐
│                        PAYROLL DATA FLOW                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  STEP 1: Setup Phase                                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ • Create Payroll Settings                                      │   │
│  │ • Create Employees with Salary Records                         │   │
│  │ • Setup Tax Brackets                                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              ↓                                          │
│  STEP 2: Data Collection                                               │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ • Employee Base Salary (EmployeeSalary)                        │   │
│  │ • Attendance Records (present/absent/leave)                    │   │
│  │ • Overtime Hours                                               │   │
│  │ • Allowances & Deductions                                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              ↓                                          │
│  STEP 3: Payroll Generation                                            │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ • Calculate Gross Salary                                       │   │
│  │ • Calculate Tax                                                │   │
│  │ • Calculate Net Salary                                         │   │
│  │ • Create Payroll Record                                        │   │
│  │ • Create Payroll Items                                         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              ↓                                          │
│  STEP 4: Approval & Payment                                            │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ • Approve Payroll (pending → processing)                       │   │
│  │ • Process Payment (processing → paid)                          │   │
│  │ • Generate Payslip                                             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
2. Required Database Tables & Sample Data
A. Payroll Settings Table
sql
-- Payroll Settings Sample Data
INSERT INTO payroll_settings (
    payroll_cycle,
    payroll_day,
    pay_day,
    overtime_rate_multiplier,
    holiday_rate_multiplier,
    night_shift_rate_multiplier,
    insurance_employee_rate,
    insurance_employer_rate,
    max_loan_percentage,
    min_loan_amount,
    tax_tables,
    default_allowances,
    default_deductions,
    created_at,
    updated_at
) VALUES (
    'monthly',
    25,
    30,
    1.5,
    2.0,
    1.25,
    2.5,
    5.0,
    30,
    1000,
    '[
        {"min": 0, "max": 300000, "rate": 0},
        {"min": 300001, "max": 600000, "rate": 5},
        {"min": 600001, "max": 1000000, "rate": 10},
        {"min": 1000001, "max": 2000000, "rate": 15},
        {"min": 2000001, "max": 999999999, "rate": 20}
    ]',
    '{"housing": 5000, "transport": 2000, "meal": 1000}',
    '{"insurance": 1500, "pension": 500}',
    NOW(),
    NOW()
);
B. Employee Salary Records
sql
-- Employee Salaries Sample Data
INSERT INTO employee_salaries (
    employee_id,
    base_salary,
    hourly_rate,
    weekly_rate,
    monthly_rate,
    allowances,
    deductions,
    bank_name,
    bank_account,
    bank_branch,
    account_type,
    is_active,
    effective_date,
    created_at,
    updated_at
) VALUES 
-- Employee 1: Senior Developer
(
    1,  -- employee_id
    50000.00,  -- base_salary
    284.09,    -- hourly_rate (50000 / 22 / 8)
    11538.46,  -- weekly_rate
    50000.00,  -- monthly_rate
    '{"housing": 8000, "transport": 3000, "meal": 2000, "medical": 5000}',
    '{"insurance": 2500, "pension": 1000}',
    'ABC Bank',
    '1234567890',
    'Main Branch',
    'Savings',
    1,
    '2024-01-01',
    NOW(),
    NOW()
),

-- Employee 2: Software Engineer
(
    2,
    40000.00,
    227.27,
    9230.77,
    40000.00,
    '{"housing": 5000, "transport": 2000, "meal": 1500}',
    '{"insurance": 2000, "pension": 800}',
    'XYZ Bank',
    '9876543210',
    'City Branch',
    'Current',
    1,
    '2024-01-01',
    NOW(),
    NOW()
),

-- Employee 3: DevOps Engineer
(
    3,
    45000.00,
    255.68,
    10384.62,
    45000.00,
    '{"housing": 6000, "transport": 2500, "meal": 1500}',
    '{"insurance": 2200, "pension": 900}',
    'ABC Bank',
    '5555555555',
    'Downtown Branch',
    'Savings',
    1,
    '2024-01-01',
    NOW(),
    NOW()
),

-- Employee 4: HR Manager
(
    4,
    55000.00,
    312.50,
    12692.31,
    55000.00,
    '{"housing": 7000, "transport": 3500, "meal": 2500}',
    '{"insurance": 2800, "pension": 1100}',
    'XYZ Bank',
    '4444444444',
    'Central Branch',
    'Current',
    1,
    '2024-01-01',
    NOW(),
    NOW()
),

-- Employee 5: Junior Developer
(
    5,
    30000.00,
    170.45,
    6923.08,
    30000.00,
    '{"housing": 3000, "transport": 1500, "meal": 1000}',
    '{"insurance": 1500, "pension": 600}',
    'ABC Bank',
    '3333333333',
    'North Branch',
    'Savings',
    1,
    '2024-06-01',
    NOW(),
    NOW()
);
C. Attendance Records (For Payroll Calculation)
sql
-- Generate Attendance for December 2024
-- Employee 1: 20 present, 2 absent
INSERT INTO attendance_records (employee_id, date, check_in, check_out, status, work_hours, overtime_hours, created_at, updated_at)
VALUES 
(1, '2024-12-01', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(1, '2024-12-02', '09:15:00', '18:30:00', 'present', 8, 0.5, NOW(), NOW()),
(1, '2024-12-03', '09:00:00', '19:00:00', 'present', 8, 1, NOW(), NOW()),
(1, '2024-12-04', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(1, '2024-12-05', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(1, '2024-12-06', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(1, '2024-12-07', NULL, NULL, 'absent', 0, 0, NOW(), NOW()),  -- Saturday (weekend)
(1, '2024-12-08', NULL, NULL, 'absent', 0, 0, NOW(), NOW()),  -- Sunday (weekend)
(1, '2024-12-09', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(1, '2024-12-10', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(1, '2024-12-11', '09:30:00', '18:30:00', 'present', 8, 0.5, NOW(), NOW()),
(1, '2024-12-12', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(1, '2024-12-13', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(1, '2024-12-14', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(1, '2024-12-15', NULL, NULL, 'absent', 0, 0, NOW(), NOW()),  -- Sunday
(1, '2024-12-16', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(1, '2024-12-17', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(1, '2024-12-18', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(1, '2024-12-19', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(1, '2024-12-20', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(1, '2024-12-21', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(1, '2024-12-22', NULL, NULL, 'absent', 0, 0, NOW(), NOW()),  -- Sunday
(1, '2024-12-23', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(1, '2024-12-24', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(1, '2024-12-25', NULL, NULL, 'absent', 0, 0, NOW(), NOW()),  -- Christmas
(1, '2024-12-26', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(1, '2024-12-27', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(1, '2024-12-28', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(1, '2024-12-29', NULL, NULL, 'absent', 0, 0, NOW(), NOW()),  -- Sunday
(1, '2024-12-30', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(1, '2024-12-31', '09:00:00', '16:00:00', 'present', 7, 0, NOW(), NOW());

-- Employee 2: 22 present, 0 absent
INSERT INTO attendance_records (employee_id, date, check_in, check_out, status, work_hours, overtime_hours, created_at, updated_at)
SELECT 
    2,
    dates.date,
    '09:00:00',
    '18:00:00',
    'present',
    8,
    0,
    NOW(),
    NOW()
FROM (
    SELECT DATE('2024-12-01') + INTERVAL (a.a + (10 * b.a)) DAY AS date
    FROM (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) AS a
    CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) AS b
    HAVING date <= '2024-12-31'
) dates
WHERE DAYOFWEEK(dates.date) NOT IN (1, 7)  -- Exclude weekends
LIMIT 22;

-- Employee 3: 18 present, 4 absent
INSERT INTO attendance_records (employee_id, date, check_in, check_out, status, work_hours, overtime_hours, created_at, updated_at)
VALUES 
(3, '2024-12-01', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(3, '2024-12-02', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(3, '2024-12-03', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(3, '2024-12-04', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(3, '2024-12-05', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(3, '2024-12-06', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(3, '2024-12-07', NULL, NULL, 'absent', 0, 0, NOW(), NOW()),  -- Saturday
(3, '2024-12-08', NULL, NULL, 'absent', 0, 0, NOW(), NOW()),  -- Sunday
(3, '2024-12-09', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(3, '2024-12-10', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(3, '2024-12-11', NULL, NULL, 'leave', 0, 0, NOW(), NOW()), -- Leave
(3, '2024-12-12', NULL, NULL, 'leave', 0, 0, NOW(), NOW()), -- Leave
(3, '2024-12-13', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(3, '2024-12-14', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(3, '2024-12-15', NULL, NULL, 'absent', 0, 0, NOW(), NOW()), -- Sunday
(3, '2024-12-16', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(3, '2024-12-17', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(3, '2024-12-18', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(3, '2024-12-19', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(3, '2024-12-20', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(3, '2024-12-21', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(3, '2024-12-22', NULL, NULL, 'absent', 0, 0, NOW(), NOW()), -- Sunday
(3, '2024-12-23', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(3, '2024-12-24', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(3, '2024-12-25', NULL, NULL, 'leave', 0, 0, NOW(), NOW()), -- Christmas
(3, '2024-12-26', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(3, '2024-12-27', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(3, '2024-12-28', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(3, '2024-12-29', NULL, NULL, 'absent', 0, 0, NOW(), NOW()), -- Sunday
(3, '2024-12-30', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW()),
(3, '2024-12-31', '09:00:00', '18:00:00', 'present', 8, 0, NOW(), NOW());
D. Leave Requests (For Payroll Calculation)
sql
-- Leave Requests for December 2024
INSERT INTO leave_requests (
    employee_id,
    leave_type,
    start_date,
    end_date,
    status,
    days,
    reason,
    created_at,
    updated_at
) VALUES 
-- Employee 1: 2 days leave
(
    1,
    'annual',
    '2024-12-23',
    '2024-12-24',
    'approved',
    2,
    'Year-end vacation',
    NOW(),
    NOW()
),

-- Employee 3: 4 days leave
(
    3,
    'annual',
    '2024-12-11',
    '2024-12-12',
    'approved',
    2,
    'Personal leave',
    NOW(),
    NOW()
),
(
    3,
    'annual',
    '2024-12-25',
    '2024-12-25',
    'approved',
    1,
    'Christmas holiday',
    NOW(),
    NOW()
);
3. API Request Examples
A. Generate Payroll
http
POST /api/v1/payrolls/generate
Authorization: Bearer {token}
Content-Type: application/json

{
    "month": 12,
    "year": 2024,
    "employee_ids": [1, 2, 3, 4, 5]
}
B. Expected Response
json
{
    "success": true,
    "message": "Payroll generated successfully.",
    "data": [
        {
            "id": 1,
            "employee_id": 1,
            "employee": {
                "id": 1,
                "name": "John Doe",
                "employee_code": "EMP001"
            },
            "payroll_month": "2024-12-01",
            "basic_salary": 50000.00,
            "hourly_rate": 284.09,
            "total_work_days": 22,
            "present_days": 20,
            "absent_days": 2,
            "leave_days": 0,
            "overtime_hours": 2.5,
            "overtime_amount": 1065.34,
            "allowances": {
                "housing": 8000,
                "transport": 3000,
                "meal": 2000,
                "medical": 5000
            },
            "total_allowances": 18000.00,
            "deductions": {
                "insurance": 2500,
                "pension": 1000
            },
            "total_deductions": 2500.00,
            "gross_salary": 69065.34,
            "net_salary": 64127.67,
            "payment_status": "pending",
            "created_by": 1
        },
        {
            "id": 2,
            "employee_id": 2,
            "employee": {
                "id": 2,
                "name": "Jane Smith",
                "employee_code": "EMP002"
            },
            "payroll_month": "2024-12-01",
            "basic_salary": 40000.00,
            "hourly_rate": 227.27,
            "total_work_days": 22,
            "present_days": 22,
            "absent_days": 0,
            "leave_days": 0,
            "overtime_hours": 0,
            "overtime_amount": 0,
            "allowances": {
                "housing": 5000,
                "transport": 2000,
                "meal": 1500
            },
            "total_allowances": 8500.00,
            "deductions": {
                "insurance": 2000,
                "pension": 800
            },
            "total_deductions": 2800.00,
            "gross_salary": 48500.00,
            "net_salary": 45531.67,
            "payment_status": "pending",
            "created_by": 1
        }
    ]
}
C. Approve Payroll
http
PUT /api/v1/payrolls/1/approve
Authorization: Bearer {token}
json
{
    "success": true,
    "message": "Payroll approved successfully.",
    "data": {
        "id": 1,
        "employee_id": 1,
        "payment_status": "processing",
        "approved_by": 1,
        "approved_at": "2024-12-28T10:30:00.000000Z"
    }
}
D. Process Payment
http
PUT /api/v1/payrolls/1/pay
Authorization: Bearer {token}
Content-Type: application/json

{
    "payment_method": "bank_transfer",
    "bank_name": "ABC Bank",
    "bank_account": "1234567890",
    "payment_date": "2024-12-30"
}
json
{
    "success": true,
    "message": "Payment processed successfully.",
    "data": {
        "id": 1,
        "employee_id": 1,
        "payment_status": "paid",
        "payment_method": "bank_transfer",
        "payment_date": "2024-12-30"
    }
}
4. Complete Test Flow
Test Script
php
<?php

namespace Tests\Feature\API;

use Tests\TestCase;
use App\Models\User;
use App\Models\Employee;
use App\Models\EmployeeSalary;
use App\Models\PayrollSetting;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PayrollTestFlow extends TestCase
{
    use RefreshDatabase;
    
    protected $admin;
    protected $employee;
    
    protected function setUp(): void
    {
        parent::setUp();
        
        // Create admin user
        $this->admin = User::factory()->create([
            'email' => 'admin@company.com',
            'password' => bcrypt('password')
        ]);
        Sanctum::actingAs($this->admin);
        
        // Create payroll settings
        PayrollSetting::create([
            'payroll_cycle' => 'monthly',
            'payroll_day' => 25,
            'pay_day' => 30,
            'overtime_rate_multiplier' => 1.5,
            'tax_tables' => [
                ['min' => 0, 'max' => 300000, 'rate' => 0],
                ['min' => 300001, 'max' => 600000, 'rate' => 5],
                ['min' => 600001, 'max' => 1000000, 'rate' => 10],
                ['min' => 1000001, 'max' => 2000000, 'rate' => 15],
                ['min' => 2000001, 'max' => PHP_INT_MAX, 'rate' => 20],
            ],
            'default_allowances' => [
                'housing' => 5000,
                'transport' => 2000
            ],
            'default_deductions' => [
                'insurance' => 1500,
                'pension' => 500
            ]
        ]);
        
        // Create employee
        $this->employee = Employee::create([
            'employee_code' => 'EMP001',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@company.com',
            'department_id' => 1,
            'position_id' => 1,
            'hire_date' => '2024-01-01',
            'employment_status' => 'active'
        ]);
        
        // Create salary record
        EmployeeSalary::create([
            'employee_id' => $this->employee->id,
            'base_salary' => 50000,
            'monthly_rate' => 50000,
            'hourly_rate' => 284.09,
            'allowances' => [
                'housing' => 8000,
                'transport' => 3000,
                'medical' => 5000
            ],
            'deductions' => [
                'insurance' => 2500,
                'pension' => 1000
            ],
            'is_active' => true,
            'effective_date' => '2024-01-01'
        ]);
        
        // Create attendance records
        for ($day = 1; $day <= 22; $day++) {
            Attendance::create([
                'employee_id' => $this->employee->id,
                'date' => "2024-12-{$day}",
                'check_in' => '09:00:00',
                'check_out' => '18:00:00',
                'status' => 'present',
                'work_hours' => 8
            ]);
        }
    }
    
    /** @test */
    public function test_complete_payroll_flow()
    {
        // Step 1: Generate Payroll
        $response = $this->postJson('/api/v1/payrolls/generate', [
            'month' => 12,
            'year' => 2024,
            'employee_ids' => [$this->employee->id]
        ]);
        
        $response->assertStatus(201);
        $payrollId = $response->json('data.0.id');
        
        // Verify payroll record
        $this->assertDatabaseHas('payrolls', [
            'id' => $payrollId,
            'employee_id' => $this->employee->id,
            'payment_status' => 'pending'
        ]);
        
        // Step 2: Approve Payroll
        $approveResponse = $this->putJson("/api/v1/payrolls/{$payrollId}/approve");
        $approveResponse->assertStatus(200);
        
        $this->assertDatabaseHas('payrolls', [
            'id' => $payrollId,
            'payment_status' => 'processing'
        ]);
        
        // Step 3: Process Payment
        $payResponse = $this->putJson("/api/v1/payrolls/{$payrollId}/pay", [
            'payment_method' => 'bank_transfer',
            'bank_name' => 'ABC Bank',
            'bank_account' => '1234567890'
        ]);
        $payResponse->assertStatus(200);
        
        $this->assertDatabaseHas('payrolls', [
            'id' => $payrollId,
            'payment_status' => 'paid'
        ]);
        
        // Step 4: Download Payslip
        $downloadResponse = $this->getJson("/api/v1/payrolls/{$payrollId}/download");
        $downloadResponse->assertStatus(200);
        
        $payslipData = $downloadResponse->json('data.payslip');
        $this->assertEquals('John Doe', $payslipData['employee_name']);
        $this->assertEquals('EMP001', $payslipData['employee_code']);
        $this->assertGreaterThan(0, $payslipData['net_salary']);
    }
}
5. Payroll Calculation Examples
Employee 1: Senior Developer
text
Basic Salary: 50,000
Allowances:
  - Housing: 8,000
  - Transport: 3,000
  - Medical: 5,000
Total Allowances: 16,000

Work Details:
  - Total Work Days: 22
  - Present Days: 20
  - Absent Days: 2
  - Overtime Hours: 2.5

Overtime Calculation:
  Hourly Rate = 50,000 / (22 * 8) = 284.09
  Overtime Amount = 2.5 * 284.09 * 1.5 = 1,065.34

Gross Salary = 50,000 + 16,000 + 1,065.34 = 67,065.34

Deductions:
  - Insurance: 2,500
  - Pension: 1,000
  - Tax: 4,937.67
Total Deductions: 8,437.67

Net Salary = 67,065.34 - 8,437.67 = 58,627.67
Employee 2: Software Engineer
text
Basic Salary: 40,000
Allowances:
  - Housing: 5,000
  - Transport: 2,000
  - Meal: 1,500
Total Allowances: 8,500

Work Details:
  - Total Work Days: 22
  - Present Days: 22
  - Absent Days: 0
  - Overtime Hours: 0

Gross Salary = 40,000 + 8,500 = 48,500

Deductions:
  - Insurance: 2,000
  - Pension: 800
  - Tax: 2,968.33
Total Deductions: 5,768.33

Net Salary = 48,500 - 5,768.33 = 42,731.67
6. Dashboard Statistics Response
http
GET /api/v1/dashboard/statistics
Authorization: Bearer {token}
json
{
    "success": true,
    "data": {
        "total_employees": 150,
        "present_today": 142,
        "absent_today": 8,
        "pending_leaves": 5,
        "total_departments": 8,
        "monthly_payroll": 8500000,
        "recent_activities": [
            {
                "id": 1,
                "employee": "John Doe",
                "action": "Payroll approved",
                "amount": 58627.67,
                "time": "2024-12-28 10:30:00"
            }
        ],
        "upcoming_holidays": [
            {
                "date": "2025-01-01",
                "name": "New Year's Day",
                "days_left": 4
            }
        ],
        "payroll_summary": {
            "total_generated": 150,
            "paid": 145,
            "pending": 5,
            "total_amount": 8500000
        }
    }
}
7. Payroll Flow Sequence Diagram
text
┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐
│   Admin    │    │   System   │    │  Database  │    │  Employee  │
└─────┬──────┘    └─────┬──────┘    └─────┬──────┘    └─────┬──────┘
      │                 │                 │                 │
      │ 1. Generate    │                 │                 │
      │────────────────>│                 │                 │
      │                 │                 │                 │
      │                 │ 2. Get Employee │                 │
      │                 │────────────────>│                 │
      │                 │                 │                 │
      │                 │ 3. Get Salary   │                 │
      │                 │────────────────>│                 │
      │                 │                 │                 │
      │                 │ 4. Get Attend   │                 │
      │                 │────────────────>│                 │
      │                 │                 │                 │
      │                 │ 5. Calculate    │                 │
      │                 │─────────────────│                 │
      │                 │                 │                 │
      │                 │ 6. Save Payroll │                 │
      │                 │────────────────>│                 │
      │                 │                 │                 │
      │ 7. Success     │                 │                 │
      │<────────────────│                 │                 │
      │                 │                 │                 │
      │ 8. Approve     │                 │                 │
      │────────────────>│                 │                 │
      │                 │                 │                 │
      │                 │ 9. Update Status│                 │
      │                 │────────────────>│                 │
      │                 │                 │                 │
      │ 10. Process Pay│                 │                 │
      │────────────────>│                 │                 │
      │                 │                 │                 │
      │                 │ 11. Mark Paid   │                 │
      │                 │────────────────>│                 │
      │                 │                 │                 │
      │                 │ 12. Send Notify │                 │
      │                 │─────────────────────────────────>│
      │                 │                 │                 │
      │ 13. Download   │                 │                 │
      │────────────────>│                 │                 │
      │                 │                 │                 │
      │ 14. Payslip PDF│                 │                 │
      │<────────────────│                 │                 │
      │                 │                 │                 │
8. Error Handling Examples
Invalid Month
json
{
    "success": false,
    "message": "Validation failed.",
    "errors": {
        "month": [
            "The month must be between 1 and 12."
        ]
    }
}
Duplicate Payroll
json
{
    "success": false,
    "message": "Payroll for this employee and month already exists."
}
Invalid Status Transition
json
{
    "success": false,
    "message": "Only pending payrolls can be approved."
}