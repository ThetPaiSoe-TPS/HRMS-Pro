export interface Employee {
  id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string | null;
  gender: 'male' | 'female' | 'other';
  date_of_birth: string;
  hire_date: string;
  department_id: number;
  department?: {
    id: number;
    name: string;
    code: string;
  };
  position_id: number;
  position?: {
    id: number;
    title: string;
    code: string;
  };
  employment_status: 'active' | 'resigned' | 'terminated';
  profile_photo: string | null;
  user_id?: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface EmployeeFormData {
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  date_of_birth: string;
  hire_date: string;
  department_id: number | null;
  position_id: number | null;
  employment_status: 'active' | 'resigned' | 'terminated';
  profile_photo: File | null;
}

export interface EmployeeFilters {
  search: string;
  department_id: string;
  position_id: string;
  employment_status: string;
  page: number;
  per_page: number;
}