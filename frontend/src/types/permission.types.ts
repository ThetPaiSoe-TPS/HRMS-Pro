export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  module: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface PermissionFormData {
  name: string;
  module: string;
  description: string;
}

export interface ModulePermissions {
  module: string;
  permissions: Permission[];
}

export interface PermissionFilters {
  search: string;
  module: string;
  page: number;
  per_page: number;
}

// Predefined modules for dropdown
export const MODULES = [
  'employee',
  'attendance',
  'leave',
  'payroll',
  'report',
  'user',
  'role',
  'permission',
  'profile',
  'setting',
] as const;

export type ModuleType = typeof MODULES[number];