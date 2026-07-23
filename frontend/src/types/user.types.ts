export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  employee_id?: number;
  avatar?: string;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  permissions?: string[];
  employee?: {
    id: number;
    name: string;
    employee_code: string;
    department: {
      id: number;
      name: string;
    };
    position: {
      id: number;
      title: string;
    };
  };
}

export interface UserFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
  employee_id?: number;
}

export interface UserFilters {
  search: string;
  role: string;
  status: string;
  page: number;
  per_page: number;
}

export interface UserPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}