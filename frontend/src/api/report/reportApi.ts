import api from "../axios";
import type {
  ReportFilters,
  EmployeeReportData,
  LeaveReportData,
  LeaveSummaryData,
  PayrollReportData,
  PayrollSummaryData,
} from "../../types/report.types";

const calculateAge = (dateOfBirth: string) => {
  if (!dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const calculateTenure = (hireDate: string) => {
  if (!hireDate) return 0;
  const today = new Date();
  const hire = new Date(hireDate);
  const diffTime = Math.abs(today.getTime() - hire.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Number((diffDays / 365).toFixed(1));
};

const mapEmployee = (item: any): EmployeeReportData => ({
  id: item.id,
  employee_code: item.employee_code || "",
  name: item.name || "",
  department: item.department?.name || "N/A",
  position: item.position?.title || "N/A",
  email: item.email || "",
  phone: item.phone || "",
  hire_date: item.hire_date || "",
  employment_status: item.status || "active",
  gender: item.gender || "N/A",
  age: calculateAge(item.date_of_birth),
  tenure_years: calculateTenure(item.hire_date),
});

export const reportApi = {
  getEmployeeReport: async (
    filters: ReportFilters,
  ): Promise<EmployeeReportData[]> => {
    const params: Record<string, any> = {};
    if (filters.department_id) params.department_id = filters.department_id;
    if (filters.status) params.status = filters.status;
    if (filters.date_from) params.date_from = filters.date_from;
    if (filters.date_to) params.date_to = filters.date_to;
    if (filters.employee_id) params.employee_id = filters.employee_id;

    const response: any = await api.get("/reports/employees", { params });
    const reportData = response?.data || [];
    return (Array.isArray(reportData) ? reportData : []).map(mapEmployee);
  },

  getAttendanceReport: async (filters: ReportFilters): Promise<any[]> => {
    const params: Record<string, any> = {};
    if (filters.date_from) params.date_from = filters.date_from;
    if (filters.date_to) params.date_to = filters.date_to;
    if (filters.department_id) params.department_id = filters.department_id;
    if (filters.employee_id) params.employee_id = filters.employee_id;

    const response: any = await api.get("/reports/attendance", { params });
    return response?.data || [];
  },

  getLeaveReport: async (
    filters: ReportFilters,
  ): Promise<{ data: LeaveReportData[]; summary: LeaveSummaryData[] }> => {
    const params: Record<string, any> = {};
    if (filters.date_from) params.date_from = filters.date_from;
    if (filters.date_to) params.date_to = filters.date_to;
    if (filters.department_id) params.department_id = filters.department_id;
    if (filters.employee_id) params.employee_id = filters.employee_id;
    if (filters.status) params.status = filters.status;

    const response: any = await api.get("/reports/leave", { params });

    console.log("Leave Report API Response:", response); // Debug log

    const mapLeaveData = (item: any): LeaveReportData => {
      // Get leave type name from various possible sources
      let leaveTypeName = "N/A";

      // Check if leaveType is an object or string
      if (item.leaveType) {
        if (typeof item.leaveType === "object") {
          leaveTypeName = item.leaveType.name || "N/A";
        } else {
          leaveTypeName = item.leaveType;
        }
      } else if (item.leave_type) {
        if (typeof item.leave_type === "object") {
          leaveTypeName = item.leave_type.name || "N/A";
        } else {
          leaveTypeName = item.leave_type;
        }
      } else if (item.leave_type_name) {
        leaveTypeName = item.leave_type_name;
      }

      // Get employee name from various sources
      let employeeName = "Unknown";
      let employeeCode = "";
      let department = "N/A";

      if (item.employee) {
        employeeName = item.employee.name || "Unknown";
        employeeCode = item.employee.employee_code || "";
        department = item.employee.department?.name || "N/A";
      } else if (item.employee_name) {
        employeeName = item.employee_name;
        employeeCode = item.employee_code || "";
        department = item.department || "N/A";
      }

      return {
        employee_id: item.employee_id || 0,
        employee_name: employeeName,
        employee_code: employeeCode,
        department: department,
        leave_type: leaveTypeName,
        start_date: item.start_date || "",
        end_date: item.end_date || "",
        days: item.days || item.total_days || 1,
        status: item.status || "pending",
        reason: item.reason || "",
      };
    };

    const mapSummary = (item: any): LeaveSummaryData => ({
      employee_id: item.employee_id || 0,
      employee_name: item.employee_name || "Unknown",
      employee_code: item.employee_code || "",
      department: item.department || "N/A",
      annual_used: item.annual_used || 0,
      annual_balance: item.annual_balance || 0,
      sick_used: item.sick_used || 0,
      sick_balance: item.sick_balance || 0,
      personal_used: item.personal_used || 0,
      personal_balance: item.personal_balance || 0,
      total_used: item.total_used || 0,
      total_balance: item.total_balance || 0,
    });

    let data = [];
    let summary = [];

    if (response) {
      // Check if response is the data directly or nested
      if (Array.isArray(response)) {
        data = response;
      } else if (response.data) {
        data = Array.isArray(response.data) ? response.data : [];
      }
      if (response.summary) {
        summary = Array.isArray(response.summary) ? response.summary : [];
      }
    }

    return {
      data: data.map(mapLeaveData),
      summary: summary.map(mapSummary),
    };
  },

  getPayrollReport: async (
    filters: ReportFilters,
  ): Promise<{ data: PayrollReportData[]; summary: PayrollSummaryData[] }> => {
    const params: Record<string, any> = {};
    if (filters.date_from) params.month = filters.date_from;
    if (filters.department_id) params.department_id = filters.department_id;
    if (filters.status) params.status = filters.status;

    const response: any = await api.get("/reports/payroll", { params });

    const mapPayrollData = (item: any): PayrollReportData => ({
      employee_id: item.employee_id,
      employee_name: item.employee?.name || "Unknown",
      employee_code: item.employee?.employee_code || "",
      department: item.employee?.department?.name || "N/A",
      position: item.employee?.position?.title || "N/A",
      month: item.payroll_month || "",
      basic_salary: item.basic_salary || 0,
      allowances: item.total_allowances || 0,
      deductions: item.total_deductions || 0,
      overtime: item.total_overtime || 0,
      gross_salary: item.gross_salary || 0,
      net_salary: item.net_salary || 0,
      payment_status: item.status || "pending",
    });

    const mapSummary = (item: any): PayrollSummaryData => ({
      department: item.department || "N/A",
      total_employees: item.total_employees || 0,
      total_basic: item.total_basic || 0,
      total_allowances: item.total_allowances || 0,
      total_deductions: item.total_deductions || 0,
      total_overtime: item.total_overtime || 0,
      total_gross: item.total_gross || 0,
      total_net: item.total_net || 0,
    });

    let data = [];
    let summary = [];

    if (response) {
      if (Array.isArray(response)) {
        data = response;
      } else if (response.data) {
        data = Array.isArray(response.data) ? response.data : [];
      }
      if (response.summary) {
        summary = Array.isArray(response.summary) ? response.summary : [];
      }
    }

    return {
      data: data.map(mapPayrollData),
      summary: summary.map(mapSummary),
    };
  },

  // ✅ ADD THE EXPORT REPORT METHOD
  exportReport: async (
    type: string,
    filters: ReportFilters,
    format: "pdf" | "excel" | "csv",
  ): Promise<Blob> => {
    const params: Record<string, any> = { format };
    if (filters.department_id) params.department_id = filters.department_id;
    if (filters.status) params.status = filters.status;
    if (filters.date_from) params.date_from = filters.date_from;
    if (filters.date_to) params.date_to = filters.date_to;
    if (filters.employee_id) params.employee_id = filters.employee_id;

    const response = (await api.get(`/reports/${type}/export`, {
      params,
      responseType: "blob",
    })) as any;
    return response;
  },
};
