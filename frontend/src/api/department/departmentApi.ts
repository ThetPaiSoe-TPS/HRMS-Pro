import api from "../axios";
import type {
  Department,
  DepartmentFilters,
  PaginatedResponse,
} from "../../types/department.types";

const mapDepartment = (data: any): Department => ({
  id: data.id,
  name: data.name,
  code: data.code || "",
  description: data.description || "",
  manager_id: data.manager_id || null,
  manager: data.manager
    ? {
        id: data.manager.id,
        name: data.manager.name,
        employee_code: data.manager.employee_code,
      }
    : null,
  employees_count: data.employees_count || 0,
  status: data.status || "active",
  created_at: data.created_at,
  updated_at: data.updated_at,
});

export const departmentApi = {
  getDepartments: async (
    filters: DepartmentFilters,
  ): Promise<PaginatedResponse<Department>> => {
    const params: Record<string, any> = {
      page: filters.page,
      per_page: filters.per_page,
    };
    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;

    const response: any = await api.get("/departments", { params });

    // Handle different response structures
    const data = response.data || response || [];
    const dataArray = Array.isArray(data) ? data : [];

    return {
      data: dataArray.map(mapDepartment),
      current_page: response.current_page || 1,
      last_page: response.last_page || 1,
      per_page: response.per_page || 10,
      total: response.total || dataArray.length,
      from: response.from || 0,
      to: response.to || dataArray.length,
    };
  },

  getDepartment: async (id: number): Promise<Department> => {
    const response: any = await api.get(`/departments/${id}`);
    return mapDepartment(response);
  },

  createDepartment: async (data: Partial<Department>): Promise<Department> => {
    const response: any = await api.post("/departments", data);
    return mapDepartment(response);
  },

  updateDepartment: async (
    id: number,
    data: Partial<Department>,
  ): Promise<Department> => {
    const response: any = await api.put(`/departments/${id}`, data);
    return mapDepartment(response);
  },

  deleteDepartment: async (id: number): Promise<void> => {
    await api.delete(`/departments/${id}`);
  },

  getAll: async (): Promise<Department[]> => {
    const response: any = await api.get("/departments", {
      params: { per_page: 100 },
    });
    const data = response.data || response || [];
    return (Array.isArray(data) ? data : []).map(mapDepartment);
  },
};
