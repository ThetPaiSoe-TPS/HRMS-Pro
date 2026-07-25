export interface Position {
  id: number;
  title: string;
  code: string;
  description?: string;
  department_id: number | null;
  department?: {
    id: number;
    name: string;
    code: string;
  };
  salary_range?: string | null;
  min_salary?: number | null;
  max_salary?: number | null;
  salary_display?: string; // Add this
  employees_count: number;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface PositionFormData {
  title: string;
  code: string;
  description: string;
  department_id: number | null;
  salary_range?: string;
  min_salary?: string;
  max_salary?: string;
  status: "active" | "inactive";
}

export interface PositionFilters {
  search: string;
  department_id: string;
  status: string;
  page: number;
  per_page: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}
