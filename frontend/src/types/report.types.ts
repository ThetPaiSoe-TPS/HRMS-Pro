
export interface ReportFilters {
  date_from: string;
  date_to: string;
  department_id: string;
  employee_id: string;
  status?: string;
  format?: 'pdf' | 'excel' | 'csv';
}

export interface EmployeeReportData {
  id: number;
  employee_code: string;
  name: string;
  department: string;
  position: string;
  email: string;
  phone: string | null;
  hire_date: string;
  employment_status: string;
  gender: string;
  age: number;
  tenure_years: number;
}

export interface LeaveReportData {
  employee_id: number;
  employee_name: string;
  employee_code: string;
  department: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days: number;
  status: string;
  reason: string;
}

export interface LeaveSummaryData {
  employee_id: number;
  employee_name: string;
  employee_code: string;
  department: string;
  annual_used: number;
  annual_balance: number;
  sick_used: number;
  sick_balance: number;
  personal_used: number;
  personal_balance: number;
  total_used: number;
  total_balance: number;
}

export interface PayrollReportData {
  employee_id: number;
  employee_name: string;
  employee_code: string;
  department: string;
  position: string;
  month: string;
  basic_salary: number;
  allowances: number;
  deductions: number;
  overtime: number;
  gross_salary: number;
  net_salary: number;
  payment_status: string;
}

export interface PayrollSummaryData {
  department: string;
  total_employees: number;
  total_basic: number;
  total_allowances: number;
  total_deductions: number;
  total_overtime: number;
  total_gross: number;
  total_net: number;
}