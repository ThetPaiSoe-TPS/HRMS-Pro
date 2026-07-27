import api from "../axios";
import type {
  User,
  UserFilters,
  UserFormData,
  PaginatedResponse,
} from "../../types/user.types";

const mapUser = (data: any): User => ({
  id: data.id,
  name: data.name,
  email: data.email,
  role: data.role?.name || data.role_name || "employee",
  role_id: data.role_id,
  role_name: data.role?.name || data.role_name || "employee",
  permissions: data.permissions || [],
  employee_id: data.employee_id,
  avatar: data.avatar || null,
  phone: data.phone || "",
  department: data.department || "",
  position: data.position || "",
  join_date: data.join_date || "",
  address: data.address || "",
  bio: data.bio || "",
  years_experience: data.years_experience ?? 0,
  total_projects: data.total_projects ?? 0,
  last_login_at: data.last_login_at || null,
  last_login_ip: data.last_login_ip || null,
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
  email_verified_at: data.email_verified_at || null,
  created_at: data.created_at,
  updated_at: data.updated_at,
});

export const userApi = {
  // Get all users with pagination and filters
  getUsers: async (filters: UserFilters): Promise<PaginatedResponse<User>> => {
    const params: Record<string, any> = {
      page: filters.page,
      per_page: filters.per_page,
    };
    if (filters.search) params.search = filters.search;
    if (filters.role) params.role = filters.role;
    if (filters.status) params.status = filters.status;

    const response: any = await api.get("/users", { params });
    const data = response.data || response || [];
    const dataArray = Array.isArray(data) ? data : [];

    return {
      data: dataArray.map(mapUser),
      current_page: response.current_page || 1,
      last_page: response.last_page || 1,
      per_page: response.per_page || 10,
      total: response.total || dataArray.length,
      from: response.from || 0,
      to: response.to || dataArray.length,
    };
  },

  // Get single user
  getUser: async (id: number): Promise<User> => {
    const response: any = await api.get(`/users/${id}`);
    return mapUser(response);
  },

  // Create user
  createUser: async (data: UserFormData): Promise<User> => {
    const response: any = await api.post("/users", data);
    return mapUser(response);
  },

  // Update user
  updateUser: async (
    id: number,
    data: Partial<UserFormData>,
  ): Promise<User> => {
    const response: any = await api.put(`/users/${id}`, data);
    return mapUser(response);
  },

  // Delete user
  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  // Update the getRoles method
  getRoles: async (): Promise<any[]> => {
    const response: any = await api.get("/roles");
    // Handle different response structures
    if (Array.isArray(response)) {
      return response;
    }
    if (response?.data && Array.isArray(response.data)) {
      return response.data;
    }
    // If it's an object with roles property
    if (response?.roles && Array.isArray(response.roles)) {
      return response.roles;
    }
    // Fallback to empty array
    return [];
  },
};
