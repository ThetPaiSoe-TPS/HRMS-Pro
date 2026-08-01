import api from "../axios";


export interface Employee {
  id: number;
  name: string;
  employee_code: string;
  email: string;
  department: { id: number; name: string };
  position: { id: number; title: string };
  deleted_at: string | null;
  is_deleted?: boolean;
}

export interface EmployeeListResponse {
  employees: {
    data: Employee[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  trashed_count: number;
  total_count: number;
  active_count: number;
}

export const employeeApi = {
  // Get all employees (with optional trashed)
  getList: async (params?: {
    with_trashed?: boolean;
    only_trashed?: boolean;
    search?: string;
    page?: number;
  }): Promise<EmployeeListResponse> => {
    const response = await api.get("/employees", { params });
    return response;
  },

  // Soft delete employee
  delete: async (id: number): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },

  // Force delete (permanent)
  forceDelete: async (id: number): Promise<void> => {
    await api.delete(`/employees/${id}/force`);
  },

  // Restore employee
  restore: async (id: number): Promise<void> => {
    await api.post(`/employees/${id}/restore`);
  },

  // Get only trashed employees
  getTrashed: async (): Promise<EmployeeListResponse> => {
    const response = await api.get("/employees/trashed");
    return response;
  },

  // Get employee statistics
  getStats: async () => {
    const response = await api.get("/employees/stats");
    return response;
  },
};
