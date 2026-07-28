import api from '../axios';
import type { Role, RoleFilters, Permission, PaginatedResponse } from '../../types/role.types';

const mapPermission = (data: any): Permission => ({
  id: data.id,
  name: data.name,
  guard_name: data.guard_name || 'api',
  module: data.module || 'general',
  description: data.description || '',
  created_at: data.created_at || '',
  updated_at: data.updated_at || '',
});

const mapRole = (data: any): Role => ({
  id: data.id,
  name: data.name,
  guard_name: data.guard_name || 'api',
  display_name: data.display_name || data.name,
  description: data.description || '',
  permissions: (data.permissions || []).map(mapPermission),
  users_count: data.users_count || 0,
  created_at: data.created_at,
  updated_at: data.updated_at,
});

export const roleApi = {
  // Get all roles with pagination and filters
  getRoles: async (filters: RoleFilters): Promise<PaginatedResponse<Role>> => {
    const params: Record<string, any> = {
      page: filters.page,
      per_page: filters.per_page,
    };
    if (filters.search) params.search = filters.search;

    const response: any = await api.get('/roles', { params });
    const data = response.data || response || [];
    const dataArray = Array.isArray(data) ? data : [];
    
    return {
      data: dataArray.map(mapRole),
      current_page: response.current_page || 1,
      last_page: response.last_page || 1,
      per_page: response.per_page || 10,
      total: response.total || dataArray.length,
      from: response.from || 0,
      to: response.to || dataArray.length,
    };
  },

  // Get single role
  getRole: async (id: number): Promise<Role> => {
    const response: any = await api.get(`/roles/${id}`);
    return mapRole(response);
  },

  // Create role
  createRole: async (data: { name: string; display_name: string; description?: string; permissions: number[] }): Promise<Role> => {
    const response: any = await api.post('/roles', data);
    return mapRole(response);
  },

  // Update role
  updateRole: async (id: number, data: { name: string; display_name: string; description?: string; permissions: number[] }): Promise<Role> => {
    const response: any = await api.put(`/roles/${id}`, data);
    return mapRole(response);
  },

  // Delete role
  deleteRole: async (id: number): Promise<void> => {
    await api.delete(`/roles/${id}`);
  },

  // Get all permissions
  getPermissions: async (): Promise<Permission[]> => {
    const response: any = await api.get('/permissions');
    const data = response.data || response || [];
    return (Array.isArray(data) ? data : []).map(mapPermission);
  },

  // Get permissions grouped by module
  getGroupedPermissions: async (): Promise<Record<string, Permission[]>> => {
    const permissions = await roleApi.getPermissions();
    const grouped: Record<string, Permission[]> = {};
    permissions.forEach((p) => {
      const module = p.module || 'general';
      if (!grouped[module]) {
        grouped[module] = [];
      }
      grouped[module].push(p);
    });
    return grouped;
  },
};