export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  module: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  display_name: string;
  description?: string;
  permissions: Permission[];
  users_count: number;
  created_at: string;
  updated_at: string;
}

export interface RoleFormData {
  name: string;
  display_name: string;
  description: string;
  permissions: number[];
}

export interface ModulePermissions {
  module: string;
  permissions: Permission[];
}

export interface RoleFilters {
  search: string;
  page: number;
  per_page: number;
}