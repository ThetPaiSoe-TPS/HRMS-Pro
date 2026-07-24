export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  role_id?: number;
  role_name?: string;
  permissions: string[];
  employee_id?: number;
  avatar?: string;
  phone?: string;
  department?: string;
  position?: string;
  joinDate?: string;
  address?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    token_type: string;
    expires_in: number;
  };
}

export interface ValidationError {
  success: false;
  message: string;
  errors: Record<string, string[]>;
}
