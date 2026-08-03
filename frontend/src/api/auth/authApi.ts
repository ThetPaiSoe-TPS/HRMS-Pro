// TODO: implement

import type { Activity } from "../../types/activity.types";
import type { AuthResponse, LoginCredentials, RegisterData, User } from "../../types/auth.types";
import api from "../axios";

const mapUser = (data: any): User => ({
  id: data.id,
  name: data.name,
  email: data.email,
  role: (data.role_slug || '').replace(/-/g, '_') || 'employee',
  role_id: data.role_id,
  role_name: data.role_name || (data.role_slug || '').replace(/-/g, '_') || 'employee',
  permissions: data.permissions || [],
  employee_id: data.employee_id,
  avatar: data.avatar || null,
  phone: data.phone || '',
  department: data.department || '',
  position: data.position || '',
  joinDate: data.joinDate || data.join_date || '',
  address: data.address || '',
  bio: data.bio || '',
  years_experience: data.years_experience ?? 0,
  total_projects: data.total_projects ?? 0,
  last_login_at: data.last_login_at || null,
  last_login_ip: data.last_login_ip || null,
  created_at: data.created_at,
  updated_at: data.updated_at,
});

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<any> => {
    const response = await api.post<any>('/auth/login', credentials);
    // api.post already unwraps response.data.data, so response is { user, token, ... }
    if (response?.user) {
      response.user = mapUser(response.user);
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