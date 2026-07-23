
export interface Department {
  id: number;
  name: string;
  code: string;
  description?: string;
  manager_id?: number;
  manager?: {
    id: number;
    name: string;
    employee_code: string;
  };
  employees_count: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface DepartmentFormData {
  name: string;
  code: string;
  description: string;
  manager_id: number | null;
  status: 'active' | 'inactive';
}

export interface DepartmentFilters {
  search: string;
  status: string;
  page: number;
  per_page: number;
}