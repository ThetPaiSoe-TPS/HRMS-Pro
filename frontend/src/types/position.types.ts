
export interface Position {
  id: number;
  title: string;
  code: string;
  description?: string;
  department_id: number;
  department?: {
    id: number;
    name: string;
    code: string;
  };
  min_salary: number | null;
  max_salary: number | null;
  employees_count: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface PositionFormData {
  title: string;
  code: string;
  description: string;
  department_id: number | null;
  min_salary: string;
  max_salary: string;
  status: 'active' | 'inactive';
}

export interface PositionFilters {
  search: string;
  department_id: string;
  status: string;
  page: number;
  per_page: number;
}