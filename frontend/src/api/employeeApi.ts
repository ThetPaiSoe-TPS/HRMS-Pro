import api from "./axios";
import type {
  Department,
  Employee,
  EmployeeFilters,
  PaginatedResponse,
  Position,
} from "../types/employee.types";

const mapEmployee = (data: any): Employee => ({
  id: data.id,
  employee_code: data.employee_code,
  name: data.name,
  email: data.email || "",
  phone: data.phone || null,
  date_of_birth: data.date_of_birth || null,
  gender: data.gender || null,
  hire_date: data.hire_date || "",
  department_id: data.department_id,
  department: data.department
    ? {
        id: data.department.id,
        name: data.department.name,
        code: data.department.code,
      }
    : undefined,
  position_id: data.position_id,
  position: data.position
    ? {
        id: data.position.id,
        title: data.position.title,
        department_id: data.position.department_id,
      }
    : undefined,
  status: data.status || "active",
  photo: data.photo || null,
  created_at: data.created_at,
  updated_at: data.updated_at,
});

export const employeeApi = {
  getEmployees: async (
    filters: EmployeeFilters,
  ): Promise<PaginatedResponse<Employee>> => {
    const params: Record<string, any> = {
      page: filters.page,
      per_page: filters.per_page,
    };
    if (filters.search) params.search = filters.search;
    if (filters.department_id) params.department_id = filters.department_id;
    if (filters.position_id) params.position_id = filters.position_id;
    if (filters.status) params.status = filters.status;

    const response: any = await api.get("/employees", { params });

    // response is already the data from axios interceptor
    return {
      data: (response.data || []).map(mapEmployee),
      current_page: response.current_page || 1,
      last_page: response.last_page || 1,
      per_page: response.per_page || 10,
      total: response.total || 0,
      from: response.from || 0,
      to: response.to || 0,
    };
  },

  getEmployee: async (id: number): Promise<Employee> => {
    const response: any = await api.get(`/employees/${id}`);
    return mapEmployee(response);
  },

  createEmployee: async (data: any): Promise<Employee> => {
    const response: any = await api.post("/employees", data);
    return mapEmployee(response);
  },

  updateEmployee: async (id: number, data: any): Promise<Employee> => {
    const response: any = await api.put(`/employees/${id}`, data);
    return mapEmployee(response);
  },

  deleteEmployee: async (id: number): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },

  uploadPhoto: async (id: number, file: File): Promise<{ photo: string }> => {
    const formData = new FormData();
    formData.append("photo", file);
    const response: any = await api.post(`/employees/${id}/photo`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  },

  deletePhoto: async (id: number): Promise<void> => {
    await api.delete(`/employees/${id}/photo`);
  },

  generateEmployeeCode: async (prefix: string = "EMP"): Promise<string> => {
    const response: any = await api.get("/employees/generate-code", {
      params: { prefix },
    });
    return response.employee_code;
  },
};

export const departmentApi = {
  getAll: async (): Promise<Department[]> => {
    const response: any = await api.get("/departments", {
      params: { per_page: 100 },
    });
    // response is already the data from axios interceptor
    // but departments might be nested in response.data
    return response.data || response || [];
  },
};

export const positionApi = {
  getAll: async (): Promise<Position[]> => {
    const response: any = await api.get("/positions", {
      params: { per_page: 100 },
    });
    // response is already the data from axios interceptor
    // but positions might be nested in response.data
    return response.data || response || [];
  },
};
