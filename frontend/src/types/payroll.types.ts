
export interface Payroll {
  id: number;
  employee_id: number;
  employee?: {
    id: number;
    name: string;
    employee_code: string;
    department: {
      id: number;
      name: string;
    };
    position: {
      id: number;
      title: string;
    };
  };
  payroll_month: string;
  basic_salary: number;
  hourly_rate: number | null;
  total_work_days: number;
  present_days: number;
  absent_days: number;
  leave_days: number;
  overtime_hours: number;
  overtime_rate: number;
  overtime_amount: number;
  allowances: Record<string, number> | null;
  total_allowances: number;
  deductions: Record<string, number> | null;
  total_deductions: number;
  gross_salary: number;
  net_salary: number;
  payment_method: 'bank_transfer' | 'cash' | 'check' | null;
  bank_name: string | null;
  bank_account: string | null;
  payment_status: 'pending' | 'processing' | 'paid' | 'rejected' | 'cancelled';
  payment_date: string | null;
  notes: string | null;
  created_by: number;
  creator?: {
    id: number;
    name: string;
  };
  approved_by: number | null;
  approver?: {
    id: number;
    name: string;
  };
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PayrollGenerateData {
  month: number;
  year: number;
  employee_ids?: number[];
}

export interface PayrollFilters {
  employee_id: string;
  month: string;
  year: string;
  status: string;
  search: string;
  page: number;
  per_page: number;
}

export interface PayrollStats {
  total_payrolls: number;
  total_amount: number;
  pending: number;
  processing: number;
  paid: number;
  rejected: number;
  cancelled: number;
  this_month_total: number;
  this_month_employees: number;
}

export interface PayrollUpdateData {
  allowances?: Record<string, number>;
  deductions?: Record<string, number>;
  overtime_hours?: number;
  notes?: string;
}

export interface PayrollPaymentData {
  payment_method: 'bank_transfer' | 'cash' | 'check';
  bank_name?: string;
  bank_account?: string;
  payment_date?: string;
}

export interface PayslipData {
  employee_name: string;
  employee_code: string;
  department: string;
  position: string;
  payroll_month: string;
  basic_salary: number;
  allowances: Record<string, number> | null;
  total_allowances: number;
  overtime_hours: number;
  overtime_amount: number;
  gross_salary: number;
  deductions: Record<string, number> | null;
  total_deductions: number;
  net_salary: number;
  payment_method: string | null;
  payment_status: string;
  payment_date: string | null;
}