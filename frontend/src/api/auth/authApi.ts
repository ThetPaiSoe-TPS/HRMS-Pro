// TODO: implement

import type { Activity } from "../../types/activity.types";
import type { AuthResponse, LoginCredentials, RegisterData, User } from "../../types/auth.types";
import api from "../axios";

const roleMap: Record<number, string> = {
  1: 'super_admin',
  2: 'admin',
  3: 'hr_manager',
  4: 'manager',
  5: 'employee',
};

const mapUser = (data: any): User => ({
  id: data.id,
  name: data.name,
  email: data.email,
  role: roleMap[data.role_id] || 'employee',
  role_id: data.role_id,
  role_name: data.role_name || roleMap[data.role_id] || 'employee',
  permissions: data.permissions || [],
  employee_id: data.employee_id,
  avatar: data.avatar || null,
  phone: data.phone || '',
  department: data.department || '',
  position: data.position || '',
  joinDate: data.joinDate || data.join_date || '',
  address: data.address || '',
  bio: data.bio || '',
  created_at: data.created_at,
  updated_at: data.updated_at,
});

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    if (response.data?.user) {
      response.data.user = mapUser(response.data.user);
    }
    return response;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    if (response.data?.user) {
      response.data.user = mapUser(response.data.user);
    }
    return response;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getProfile: async (): Promise<User> => {
    const response: any = await api.get('/auth/profile');
    return mapUser(response);
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response: any = await api.put('/auth/profile', data);
    return mapUser(response);
  },

  uploadAvatar: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response: any = await api.post('/auth/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.avatar;
  },

  changePassword: async (data: { current_password: string; new_password: string; new_password_confirmation: string }): Promise<void> => {
    await api.put('/auth/change-password', data);
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (data: { email: string; token: string; password: string; password_confirmation: string }): Promise<void> => {
    await api.post('/auth/reset-password', data);
  },

  getMyActivities: async (limit: number = 10): Promise<Activity[]> => {
    const response = await api.get<Activity[]>('/profile/activities', {
      params: { limit }
    });
    return response;
  },
};