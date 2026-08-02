import api from "../axios";

export interface Employee {
  id: number;
  name: string;
  employee_code: string;
  email: string;
  phone?: string;
  date_of_birth?: string | null;
  gender?: string | null;
  hire_date?: string;
  status: string;
  photo?: string | null;
  department: { id: number; name: string; code?: string };
  position: { id: number; title: string; department_id?: number };
  deleted_at: string | null;
  is_deleted?: boolean;
  // Accessors
  full_name?: string;
  status_badge?: string;
  experience_years?: number;
  initials?: string;
  age?: number | null;
  uppercase_name?: string;
  formatted_employee_code?: string;
  total_earnings?: number;
  is_senior?: boolean;
  salary_grade?: string;
  is_active?: boolean;
  salary?: number;
  formatted_salary?: string;
  // For mutator demo
  first_name?: string;
  last_name?: string;
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

  // Alias for getList (backward compatibility)
  getEmployees: async (params?: {
    with_trashed?: boolean;
    only_trashed?: boolean;
    search?: string;
    page?: number;
  }): Promise<EmployeeListResponse> => {
    return employeeApi.getList(params);
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

  // ✅ Get employees with accessors
  getWithAccessors: async (): Promise<Employee[]> => {
    const response = await api.get("/employees/with-accessors");
    return response;
  },

  // ✅ Create employee with mutators
  createWithMutators: async (data: Partial<Employee>): Promise<Employee> => {
    const response = await api.post("/employees/with-mutators", data);
    return response;
  },

  // ✅ Accessor demo (single employee with all accessors)
  getAccessorDemo: async (id: number): Promise<any> => {
    const response = await api.get(`/employees/accessor-demo/${id}`);
    return response;
  },

  // ✅ Mutator demo (before/after)
  getMutatorDemo: async (data: any): Promise<any> => {
    const response = await api.post("/employees/mutator-demo", data);
    return response;
  },
};
