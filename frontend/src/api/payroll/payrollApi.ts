import api from "../axios";
import type {
  Payroll,
  PayrollFilters,
  PayrollStats,
  PayrollGenerateData,
  PayrollPaymentData,
  PayrollUpdateData,
  PaginatedResponse,
} from "../../types/payroll.types";
import { getStorageUrl } from "../axios";

const mapPayroll = (data: any): Payroll => ({
  id: data.id,
  employee_id: data.employee_id,
  employee: data.employee
    ? {
        id: data.employee.id,
        name: data.employee.name,
        employee_code: data.employee.employee_code,
        photo: data.employee.photo || null,
        department: data.employee.department
          ? {
              id: data.employee.department.id,
              name: data.employee.department.name,
            }
          : undefined,
        position: data.employee.position
          ? {
              id: data.employee.position.id,
              title: data.employee.position.title,
            }
          : undefined,
      }
    : undefined,
  payroll_month: data.payroll_month,
  basic_salary: data.basic_salary || 0,
  daily_salary: data.daily_salary || 0,
  hourly_salary: data.hourly_salary || 0,
  total_allowances: data.total_allowances || 0,
  total_overtime: data.total_overtime || 0,
  total_bonus: data.total_bonus || 0,
  gross_salary: data.gross_salary || 0,
  total_deductions: data.total_deductions || 0,
  tax_amount: data.tax_amount || 0,
  loan_deduction: data.loan_deduction || 0,
  advance_salary: data.advance_salary || 0,
  late_deduction: data.late_deduction || 0,
  absent_deduction: data.absent_deduction || 0,
  unpaid_leave_deduction: data.unpaid_leave_deduction || 0,
  other_deductions: data.other_deductions || 0,
  net_salary: data.net_salary || 0,
  status: data.status || "draft",
  payment_date: data.payment_date || null,
  payment_method: data.payment_method || null,
  bank_name: data.bank_name || null,
  bank_account: data.bank_account || null,
  transaction_number: data.transaction_number || null,
  paid_by: data.paid_by || null,
  paid_by_user: data.paid_by_user
    ? {
        id: data.paid_by_user.id,
        name: data.paid_by_user.name,
      }
    : undefined,
  hr_notes: data.hr_notes || null,
  finance_notes: data.finance_notes || null,
  employee_notes: data.employee_notes || null,
  general_notes: data.general_notes || null,
  created_by: data.created_by || null,
  creator: data.creator
    ? {
        id: data.creator.id,
        name: data.creator.name,
      }
    : undefined,
  approved_by: data.approved_by || null,
  approver: data.approver
    ? {
        id: data.approver.id,
        name: data.approver.name,
      }
    : undefined,
  approved_at: data.approved_at || null,
  paid_at: data.paid_at || null,
  created_at: data.created_at,
  updated_at: data.updated_at,
});

export const payrollApi = {
  // Get all payrolls with pagination and filters
  getPayrolls: async (
    filters: PayrollFilters,
  ): Promise<PaginatedResponse<Payroll>> => {
    const params: Record<string, any> = {
      page: filters.page,
      per_page: filters.per_page,
    };
    if (filters.employee_id) params.employee_id = filters.employee_id;
    if (filters.month) params.month = filters.month;
    if (filters.year) params.year = filters.year;
    if (filters.status) params.status = filters.status;
    if (filters.search) params.search = filters.search;

    const response: any = await api.get("/payrolls", { params });
    const data = response.data || response || [];
    const dataArray = Array.isArray(data) ? data : [];

    return {
      data: dataArray.map(mapPayroll),
      current_page: response.current_page || 1,
      last_page: response.last_page || 1,
      per_page: response.per_page || 10,
      total: response.total || dataArray.length,
      from: response.from || 0,
      to: response.to || dataArray.length,
    };
  },

  // Get single payroll
  getPayroll: async (id: number): Promise<Payroll> => {
    const response: any = await api.get(`/payrolls/${id}`);
    return mapPayroll(response);
  },

  // Generate payroll
  generatePayroll: async (data: PayrollGenerateData): Promise<Payroll[]> => {
    const response: any = await api.post("/payrolls/generate", data);
    const payrolls = response || [];
    return (Array.isArray(payrolls) ? payrolls : []).map(mapPayroll);
  },

  // Calculate payroll
  calculatePayroll: async (id: number): Promise<Payroll> => {
    const response: any = await api.post(`/payrolls/${id}/calculate`);
    return mapPayroll(response);
  },

  // Submit for approval
  submitForApproval: async (id: number): Promise<Payroll> => {
    const response: any = await api.post(`/payrolls/${id}/submit`);
    return mapPayroll(response);
  },

  // Approve payroll
  approvePayroll: async (id: number): Promise<Payroll> => {
    const response: any = await api.post(`/payrolls/${id}/approve`);
    return mapPayroll(response);
  },

  // Mark as paid
  markAsPaid: async (
    id: number,
    data: PayrollPaymentData,
  ): Promise<Payroll> => {
    const response: any = await api.post(`/payrolls/${id}/mark-paid`, data);
    return mapPayroll(response);
  },

  // Cancel payroll
  cancelPayroll: async (id: number, reason?: string): Promise<Payroll> => {
    const response: any = await api.post(`/payrolls/${id}/cancel`, { reason });
    return mapPayroll(response);
  },

  // Update payroll
  updatePayroll: async (
    id: number,
    data: PayrollUpdateData,
  ): Promise<Payroll> => {
    const response: any = await api.put(`/payrolls/${id}`, data);
    return mapPayroll(response);
  },

  // Delete payroll
  deletePayroll: async (id: number): Promise<void> => {
    await api.delete(`/payrolls/${id}`);
  },

  // Get dashboard stats
  getDashboardStats: async (
    month?: number,
    year?: number,
  ): Promise<{ summary: PayrollStats; department_breakdown: any }> => {
    const params: Record<string, any> = {};
    if (month) params.month = month;
    if (year) params.year = year;
    const response: any = await api.get("/payrolls/dashboard", { params });
    return response;
  },

  // Download payslip
  downloadPayslip: async (id: number): Promise<Blob> => {
    const response = (await api.get(`/payrolls/${id}/download`, {
      responseType: "blob",
    })) as any;
    return response;
  },
};
