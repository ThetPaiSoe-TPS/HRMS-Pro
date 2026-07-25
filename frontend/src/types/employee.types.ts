export interface Department {
  id: number;
  name: string;
  code?: string;
}

export interface Position {
  id: number;
  title: string;
  department_id?: number;
}

export interface Employee {
  id: number;
  employee_code: string;
  name: string;
  email: string;
  phone: string | null;
  date_of_birth: string | null;
  gender: "male" | "female" | "other" | null;
  hire_date: string;
  department_id: number;
  department?: Department;
  position_id: number;
  position?: Position;
  status: "active" | "inactive";
  photo: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmployeeFormData {
  employee_code: string;
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: "male" | "female" | "other";
  hire_date: string;
  department_id: number | null;
  position_id: number | null;
  status: "active" | "inactive";
  photo: File | null;
}

export interface EmployeeFilters {
  search: string;
  department_id: string;
  position_id: string;
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
