import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CalendarIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import type { Permission, Role, RoleFilters } from '../../../types/role.types';
import { useAuth } from '../../../hooks/useAuth';

// Mock data - Replace with API calls
const mockRoles: Role[] = [
  {
    id: 1,
    name: 'super_admin',
    guard_name: 'api',
    display_name: 'Super Administrator',
    description: 'Full system access with all permissions',
    permissions: [
      { id: 1, name: 'employee.view', guard_name: 'api', module: 'employee', created_at: '', updated_at: '' },
      { id: 2, name: 'employee.create', guard_name: 'api', module: 'employee', created_at: '', updated_at: '' },
      { id: 3, name: 'employee.update', guard_name: 'api', module: 'employee', created_at: '', updated_at: '' },
      { id: 4, name: 'employee.delete', guard_name: 'api', module: 'employee', created_at: '', updated_at: '' },
      { id: 5, name: 'user.view', guard_name: 'api', module: 'user', created_at: '', updated_at: '' },
      { id: 6, name: 'user.create', guard_name: 'api', module: 'user', created_at: '', updated_at: '' },
    ],
    users_count: 2,
    created_at: '2024-01-01T00:00:00.000000Z',
    updated_at: '2024-01-01T00:00:00.000000Z',
  },
  {
    id: 2,
    name: 'hr_manager',
    guard_name: 'api',
    display_name: 'HR Manager',
    description: 'Manage employees, attendance, leave, and payroll',
    permissions: [
      { id: 1, name: 'employee.view', guard_name: 'api', module: 'employee', created_at: '', updated_at: '' },
      { id: 2, name: 'employee.create', guard_name: 'api', module: 'employee', created_at: '', updated_at: '' },
      { id: 3, name: 'employee.update', guard_name: 'api', module: 'employee', created_at: '', updated_at: '' },
      { id: 7, name: 'attendance.view', guard_name: 'api', module: 'attendance', created_at: '', updated_at: '' },
      { id: 8, name: 'leave.approve', guard_name: 'api', module: 'leave', created_at: '', updated_at: '' },
      { id: 9, name: 'payroll.generate', guard_name: 'api', module: 'payroll', created_at: '', updated_at: '' },
    ],
    users_count: 3,
    created_at: '2024-01-02T00:00:00.000000Z',
    updated_at: '2024-01-02T00:00:00.000000Z',
  },
  {
    id: 3,
    name: 'department_manager',
    guard_name: 'api',
    display_name: 'Department Manager',
    description: 'Manage team members and approve leave requests',
    permissions: [
      { id: 1, name: 'employee.view', guard_name: 'api', module: 'employee', created_at: '', updated_at: '' },
      { id: 7, name: 'attendance.view', guard_name: 'api', module: 'attendance', created_at: '', updated_at: '' },
      { id: 8, name: 'leave.approve', guard_name: 'api', module: 'leave', created_at: '', updated_at: '' },
    ],
    users_count: 5,
    created_at: '2024-01-03T00:00:00.000000Z',
    updated_at: '2024-01-03T00:00:00.000000Z',
  },
  {
    id: 4,
    name: 'employee',
    guard_name: 'api',
    display_name: 'Employee',
    description: 'Basic self-service access',
    permissions: [
      { id: 10, name: 'profile.view', guard_name: 'api', module: 'profile', created_at: '', updated_at: '' },
      { id: 11, name: 'leave.create', guard_name: 'api', module: 'leave', created_at: '', updated_at: '' },
      { id: 12, name: 'attendance.create', guard_name: 'api', module: 'attendance', created_at: '', updated_at: '' },
    ],
    users_count: 15,
    created_at: '2024-01-04T00:00:00.000000Z',
    updated_at: '2024-01-04T00:00:00.000000Z',
  },
];

// Role badge colors
const roleColors: Record<string, string> = {
  super_admin: 'bg-purple-100 text-purple-800',
  hr_manager: 'bg-blue-100 text-blue-800',
  department_manager: 'bg-indigo-100 text-indigo-800',
  employee: 'bg-gray-100 text-gray-800',
};

const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  hr_manager: 'HR Manager',
  department_manager: 'Dept Manager',
  employee: 'Employee',
};

export const Roles: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  // State
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<RoleFilters>({
    search: '',
    page: 1,
    per_page: 10,
  });
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // Filter roles
  const filteredRoles = roles.filter((role) => {
    const matchesSearch = role.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRoles.length / filters.per_page);
  const paginatedRoles = filteredRoles.slice(
    (filters.page - 1) * filters.per_page,
    filters.page * filters.per_page
  );

  // Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setFilters({ ...filters, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleDelete = (role: Role) => {
    setSelectedRole(role);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedRole) return;
    // TODO: API call to delete role
    setRoles(roles.filter(r => r.id !== selectedRole.id));
    setShowDeleteModal(false);
    setSelectedRole(null);
  };

  const handleView = (role: Role) => {
    setSelectedRole(role);
    setShowViewModal(true);
  };

  const handleEdit = (role: Role) => {
    navigate(`/admin/roles/${role.id}/edit`);
  };

  const getRoleBadge = (roleName: string) => {
    return roleColors[roleName] || 'bg-gray-100 text-gray-800';
  };

  const getPermissionCount = (role: Role) => {
    return role.permissions?.length || 0;
  };

  // Group permissions by module
  const getGroupedPermissions = (permissions: Permission[]) => {
    const grouped: Record<string, Permission[]> = {};
    permissions.forEach((p) => {
      if (!grouped[p.module]) {
        grouped[p.module] = [];
      }
      grouped[p.module].push(p);
    });
    return grouped;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage user roles and their permissions
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/roles/create')}
          className="inline-flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg shadow-sm bg-primary-600 hover:bg-primary-700"
        >
          <PlusIcon className="w-5 h-5" />
          Create Role
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-100">
              <ShieldCheckIcon className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Roles</p>
              <p className="text-xl font-bold text-gray-900">{roles.length}</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <UserGroupIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-xl font-bold text-gray-900">
                {roles.reduce((sum, r) => sum + (r.users_count || 0), 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckBadgeIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Admin Roles</p>
              <p className="text-xl font-bold text-gray-900">
                {roles.filter(r => r.name === 'super_admin' || r.name === 'hr_manager').length}
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShieldCheckIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Permissions</p>
              <p className="text-xl font-bold text-gray-900">
                {new Set(roles.flatMap(r => r.permissions?.map(p => p.id) || [])).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search roles by name or description..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilters({ search: '', page: 1, per_page: 10 });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-500 transition-colors hover:text-gray-700"
          >
            <ArrowPathIcon className="w-5 h-5" />
            <span className="text-sm">Reset</span>
          </button>
        </div>
      </div>

      {/* Roles Table */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Permissions
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Users
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Created
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedRoles.map((role) => (
                <tr key={role.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center flex-shrink-0 rounded-lg h-9 w-9 bg-primary-100">
                        <ShieldCheckIcon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{role.display_name}</p>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(role.name)}`}>
                          {roleLabels[role.name] || role.name}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="max-w-xs text-sm text-gray-600 truncate">
                      {role.description || 'No description'}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-900">
                        {getPermissionCount(role)}
                      </span>
                      <span className="text-xs text-gray-500">permissions</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <UserGroupIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{role.users_count || 0}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <CalendarIcon className="w-4 h-4" />
                      {new Date(role.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleView(role)}
                        className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                        title="View"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(role)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(role)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete"
                        disabled={role.name === 'super_admin' || role.users_count > 0}
                      >
                        <TrashIcon className={`h-4 w-4 ${(role.name === 'super_admin' || role.users_count > 0) ? 'opacity-50 cursor-not-allowed' : ''}`} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {paginatedRoles.length === 0 && (
          <div className="py-12 text-center">
            <ShieldCheckIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900">No roles found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or create a new role
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Showing {paginatedRoles.length > 0 ? (filters.page - 1) * filters.per_page + 1 : 0} to{' '}
              {Math.min(filters.page * filters.per_page, filteredRoles.length)} of {filteredRoles.length} roles
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
                className="px-3 py-1 text-sm transition-colors border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    page === filters.page
                      ? 'bg-primary-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === totalPages}
                className="px-3 py-1 text-sm transition-colors border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ==========================================
          VIEW ROLE MODAL
          ========================================== */}
      {showViewModal && selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary-100">
                  <ShieldCheckIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedRole.display_name}</h3>
                  <p className="text-sm text-gray-500">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(selectedRole.name)}`}>
                      {roleLabels[selectedRole.name] || selectedRole.name}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Description</label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedRole.description || 'No description provided'}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Users with this role</label>
                  <p className="mt-1 text-sm font-medium text-gray-900">{selectedRole.users_count || 0}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Total Permissions</label>
                  <p className="mt-1 text-sm font-medium text-gray-900">{getPermissionCount(selectedRole)}</p>
                </div>
              </div>

              {/* Permissions */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="mb-3 text-sm font-medium text-gray-900">Permissions</h4>
                {selectedRole.permissions && selectedRole.permissions.length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(getGroupedPermissions(selectedRole.permissions)).map(([module, perms]) => (
                      <div key={module}>
                        <h5 className="mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase">
                          {module.charAt(0).toUpperCase() + module.slice(1)}
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {perms.map((perm) => (
                            <span
                              key={perm.id}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700"
                            >
                              <CheckBadgeIcon className="w-3 h-3" />
                              {perm.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No permissions assigned</p>
                )}
              </div>

              {/* Metadata */}
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Created</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedRole.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Last Updated</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedRole.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEdit(selectedRole);
                }}
                className="px-4 py-2 text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
              >
                Edit Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          DELETE CONFIRMATION MODAL
          ========================================== */}
      {showDeleteModal && selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white shadow-lg rounded-xl">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-center text-gray-900">
                Delete Role
              </h3>
              <p className="text-sm text-center text-gray-500">
                Are you sure you want to delete <span className="font-medium text-gray-900">{selectedRole.display_name}</span>?
                {selectedRole.users_count > 0 && (
                  <span className="block mt-2 text-red-600">
                    ⚠️ This role is assigned to {selectedRole.users_count} user(s). Delete will remove the role from these users.
                  </span>
                )}
                {selectedRole.name === 'super_admin' && (
                  <span className="block mt-2 text-red-600">
                    ⚠️ This is a system role and cannot be deleted.
                  </span>
                )}
              </p>
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={selectedRole.name === 'super_admin'}
                  className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors ${
                    selectedRole.name === 'super_admin'
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Delete Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;