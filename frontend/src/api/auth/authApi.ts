// TODO: implement

import type { AuthResponse, LoginCredentials, RegisterData, User } from "../../types/auth.types";
import api from "../axios";


export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/auth/profile');
    return response;
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
};