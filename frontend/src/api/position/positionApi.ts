import api from "../axios";
import type {
  Position,
  PositionFilters,
  PaginatedResponse,
} from "../../types/position.types";

const mapPosition = (data: any): Position => ({
  id: data.id,
  title: data.title,
  code: data.code || "",
  description: data.description || "",
  department_id: data.department_id || null,
  department: data.department
    ? {
        id: data.department.id,
        name: data.department.name,
        code: data.department.code,
      }
    : undefined,
  salary_range: data.salary_range || null,
  min_salary: data.min_salary || null,
  max_salary: data.max_salary || null,
  salary_display: data.salary_display || null, // Map the new field
  employees_count: data.employees_count || 0,
  status: data.status || "active",
  created_at: data.created_at,
  updated_at: data.updated_at,
});

export const positionApi = {
  getPositions: async (
    filters: PositionFilters,
  ): Promise<PaginatedResponse<Position>> => {
    const params: Record<string, any> = {
      page: filters.page,
      per_page: filters.per_page,
    };
    if (filters.search) params.search = filters.search;
    if (filters.department_id) params.department_id = filters.department_id;
    if (filters.status) params.status = filters.status;

    const response: any = await api.get("/positions", { params });

    const data = response.data || response || [];
    const dataArray = Array.isArray(data) ? data : [];

    return {
      data: dataArray.map(mapPosition),
      current_page: response.current_page || 1,
      last_page: response.last_page || 1,
      per_page: response.per_page || 10,
      total: response.total || dataArray.length,
      from: response.from || 0,
      to: response.to || dataArray.length,
    };
  },

  getPosition: async (id: number): Promise<Position> => {
    const response: any = await api.get(`/positions/${id}`);
    return mapPosition(response);
  },

  createPosition: async (data: Partial<Position>): Promise<Position> => {
    const response: any = await api.post("/positions", data);
    return mapPosition(response);
  },

  updatePosition: async (
    id: number,
    data: Partial<Position>,
  ): Promise<Position> => {
    const response: any = await api.put(`/positions/${id}`, data);
    return mapPosition(response);
  },

  deletePosition: async (id: number): Promise<void> => {
    await api.delete(`/positions/${id}`);
  },

  getAll: async (): Promise<Position[]> => {
    const response: any = await api.get("/positions", {
      params: { per_page: 100 },
    });
    const data = response.data || response || [];
    return (Array.isArray(data) ? data : []).map(mapPosition);
  },
};
