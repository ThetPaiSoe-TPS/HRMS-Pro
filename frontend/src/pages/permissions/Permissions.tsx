import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  KeyIcon,
  ShieldCheckIcon,
  CalendarIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  XMarkIcon,
  FolderIcon,
} from '@heroicons/react/24/outline';

// Mock data - Replace with API calls
const mockPermissions: Permission[] = [
  // Employee Module
  { id: 1, name: 'employee.view', guard_name: 'api', module: 'employee', description: 'View employee list and details', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  { id: 2, name: 'employee.create', guard_name: 'api', module: 'employee', description: 'Create new employees', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  { id: 3, name: 'employee.update', guard_name: 'api', module: 'employee', description: 'Update employee information', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  { id: 4, name: 'employee.delete', guard_name: 'api', module: 'employee', description: 'Delete employees', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  
  // Attendance Module
  { id: 5, name: 'attendance.view', guard_name: 'api', module: 'attendance', description: 'View attendance records', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  { id: 6, name: 'attendance.create', guard_name: 'api', module: 'attendance', description: 'Check in/out attendance', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  { id: 7, name: 'attendance.update', guard_name: 'api', module: 'attendance', description: 'Update attendance records', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  { id: 8, name: 'attendance.delete', guard_name: 'api', module: 'attendance', description: 'Delete attendance records', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  
  // Leave Module
  { id: 9, name: 'leave.view', guard_name: 'api', module: 'leave', description: 'View leave requests', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  { id: 10, name: 'leave.create', guard_name: 'api', module: 'leave', description: 'Apply for leave', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  { id: 11, name: 'leave.approve', guard_name: 'api', module: 'leave', description: 'Approve leave requests', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  { id: 12, name: 'leave.reject', guard_name: 'api', module: 'leave', description: 'Reject leave requests', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  
  // Payroll Module
  { id: 13, name: 'payroll.view', guard_name: 'api', module: 'payroll', description: 'View payroll records', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  { id: 14, name: 'payroll.generate', guard_name: 'api', module: 'payroll', description: 'Generate payroll', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  { id: 15, name: 'payroll.update', guard_name: 'api', module: 'payroll', description: 'Update payroll records', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  { id: 16, name: 'payroll.delete', guard_name: 'api', module: 'payroll', description: 'Delete payroll records', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  
  // User Module
  { id: 17, name: 'user.view', guard_name: 'api', module: 'user', description: 'View users', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  { id: 18, name: 'user.create', guard_name: 'api', module: 'user', description: 'Create users', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  { id: 19, name: 'user.update', guard_name: 'api', module: 'user', description: 'Update users', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  { id: 20, name: 'user.delete', guard_name: 'api', module: 'user', description: 'Delete users', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  
  // Role Module
  { id: 21, name: 'role.view', guard_name: 'api', module: 'role', description: 'View roles', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  { id: 22, name: 'role.create', guard_name: 'api', module: 'role', description: 'Create roles', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  { id: 23, name: 'role.update', guard_name: 'api', module: 'role', description: 'Update roles', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  { id: 24, name: 'role.delete', guard_name: 'api', module: 'role', description: 'Delete roles', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  
  // Permission Module
  { id: 25, name: 'permission.view', guard_name: 'api', module: 'permission', description: 'View permissions', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  { id: 26, name: 'permission.create', guard_name: 'api', module: 'permission', description: 'Create permissions', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  { id: 27, name: 'permission.update', guard_name: 'api', module: 'permission', description: 'Update permissions', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  { id: 28, name: 'permission.delete', guard_name: 'api', module: 'permission', description: 'Delete permissions', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  
  // Profile Module
  { id: 29, name: 'profile.view', guard_name: 'api', module: 'profile', description: 'View own profile', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  { id: 30, name: 'profile.update', guard_name: 'api', module: 'profile', description: 'Update own profile', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  
  // Report Module
  { id: 31, name: 'report.view', guard_name: 'api', module: 'report', description: 'View reports', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
  { id: 32, name: 'report.export', guard_name: 'api', module: 'report', description: 'Export reports', created_at: '2024-01-01T00:00:00.000000Z', updated_at: '2024-01-01T00:00:00.000000Z' },
];

// Module icon mapping
const moduleIcons: Record<string, any> = {
  employee: UserGroupIcon,
  attendance: ClockIcon,
  leave: CalendarDaysIcon,
  payroll: CurrencyDollarIcon,
  report: ChartBarIcon,
  user: UserGroupIcon,
  role: ShieldCheckIcon,
  permission: KeyIcon,
  profile: UserCircleIcon,
  setting: Cog6ToothIcon,
};

// Import all icons needed
import {
  UserGroupIcon,
  ClockIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import type { Permission } from '../../types/role.types';
import type { PermissionFilters } from '../../types/permission.types';

const moduleColors: Record<string, string> = {
  employee: 'bg-blue-100 text-blue-800',
  attendance: 'bg-green-100 text-green-800',
  leave: 'bg-yellow-100 text-yellow-800',
  payroll: 'bg-purple-100 text-purple-800',
  report: 'bg-indigo-100 text-indigo-800',
  user: 'bg-pink-100 text-pink-800',
  role: 'bg-orange-100 text-orange-800',
  permission: 'bg-red-100 text-red-800',
  profile: 'bg-cyan-100 text-cyan-800',
  setting: 'bg-gray-100 text-gray-800',
};

export const Permissions: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [permissions, setPermissions] = useState<Permission[]>(mockPermissions);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<PermissionFilters>({
    search: '',
    module: '',
    page: 1,
    per_page: 10,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // Get unique modules from permissions
  const availableModules = [...new Set(permissions.map(p => p.module))];

  // Filter permissions
  const filteredPermissions = permissions.filter((perm) => {
    const matchesSearch = perm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perm.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perm.module.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = !filters.module || perm.module === filters.module;
    return matchesSearch && matchesModule;
  });

  // Group by module
  const groupedPermissions = filteredPermissions.reduce((acc, perm) => {
    if (!acc[perm.module]) {
      acc[perm.module] = [];
    }
    acc[perm.module].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  // Pagination
  const totalPages = Math.ceil(filteredPermissions.length / filters.per_page);
  const paginatedPermissions = filteredPermissions.slice(
    (filters.page - 1) * filters.per_page,
    filters.page * filters.per_page
  );

  // Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setFilters({ ...filters, page: 1 });
  };

  const handleFilterChange = (key: keyof PermissionFilters, value: string) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleDelete = (permission: Permission) => {
    setSelectedPermission(permission);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedPermission) return;
    // TODO: API call to delete permission
    setPermissions(permissions.filter(p => p.id !== selectedPermission.id));
    setShowDeleteModal(false);
    setSelectedPermission(null);
  };

  const handleView = (permission: Permission) => {
    setSelectedPermission(permission);
    setShowViewModal(true);
  };

  const handleEdit = (permission: Permission) => {
    navigate(`/admin/permissions/${permission.id}/edit`);
  };

  const getModuleColor = (module: string) => {
    return moduleColors[module] || 'bg-gray-100 text-gray-800';
  };

  const getModuleIcon = (module: string) => {
    return moduleIcons[module] || FolderIcon;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Permissions Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage system permissions by module
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/permissions/create')}
          className="inline-flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg shadow-sm bg-primary-600 hover:bg-primary-700"
        >
          <PlusIcon className="w-5 h-5" />
          Create Permission
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-100">
              <KeyIcon className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Permissions</p>
              <p className="text-xl font-bold text-gray-900">{permissions.length}</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FolderIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Modules</p>
              <p className="text-xl font-bold text-gray-900">{availableModules.length}</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Used in Roles</p>
              <p className="text-xl font-bold text-gray-900">
                {permissions.filter(p => p.module !== 'permission').length}
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckBadgeIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">System Permissions</p>
              <p className="text-xl font-bold text-gray-900">
                {permissions.filter(p => p.module === 'permission').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search permissions by name, module, or description..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FunnelIcon className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-700">Filters</span>
          </button>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilters({ search: '', module: '', page: 1, per_page: 10 });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-500 transition-colors hover:text-gray-700"
          >
            <ArrowPathIcon className="w-5 h-5" />
            <span className="text-sm">Reset</span>
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 gap-4 pt-4 mt-4 border-t border-gray-200 sm:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Module</label>
              <select
                value={filters.module}
                onChange={(e) => handleFilterChange('module', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Modules</option>
                {availableModules.map((module) => (
                  <option key={module} value={module}>
                    {module.charAt(0).toUpperCase() + module.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Per Page</label>
              <select
                value={filters.per_page}
                onChange={(e) => handleFilterChange('per_page', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Permissions Table */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Permission
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Module
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Description
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
              {paginatedPermissions.map((permission) => {
                const ModuleIcon = getModuleIcon(permission.module);
                return (
                  <tr key={permission.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center flex-shrink-0 rounded-lg h-9 w-9 bg-primary-100">
                          <KeyIcon className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{permission.name}</p>
                          <span className="text-xs text-gray-500">ID: {permission.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ModuleIcon className="w-4 h-4 text-gray-400" />
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getModuleColor(permission.module)}`}>
                          {permission.module.charAt(0).toUpperCase() + permission.module.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="max-w-xs text-sm text-gray-600 truncate">
                        {permission.description || 'No description'}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <CalendarIcon className="w-4 h-4" />
                        {new Date(permission.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleView(permission)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                          title="View"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(permission)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(permission)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {paginatedPermissions.length === 0 && (
          <div className="py-12 text-center">
            <KeyIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900">No permissions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or create a new permission
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Showing {paginatedPermissions.length > 0 ? (filters.page - 1) * filters.per_page + 1 : 0} to{' '}
              {Math.min(filters.page * filters.per_page, filteredPermissions.length)} of {filteredPermissions.length} permissions
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
          VIEW PERMISSION MODAL
          ========================================== */}
      {showViewModal && selectedPermission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white shadow-lg rounded-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-100">
                  <KeyIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Permission Details</h3>
                  <p className="text-sm text-gray-500">ID: {selectedPermission.id}</p>
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
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Permission Name</label>
                <p className="mt-1 text-sm font-medium text-gray-900">{selectedPermission.name}</p>
              </div>
              <div>
                <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Module</label>
                <p className="mt-1">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getModuleColor(selectedPermission.module)}`}>
                    {selectedPermission.module.charAt(0).toUpperCase() + selectedPermission.module.slice(1)}
                  </span>
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Description</label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedPermission.description || 'No description provided'}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Guard Name</label>
                <p className="mt-1 text-sm text-gray-900">{selectedPermission.guard_name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Created</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedPermission.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Last Updated</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedPermission.updated_at).toLocaleString()}
                  </p>
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
                  handleEdit(selectedPermission);
                }}
                className="px-4 py-2 text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
              >
                Edit Permission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          DELETE CONFIRMATION MODAL
          ========================================== */}
      {showDeleteModal && selectedPermission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white shadow-lg rounded-xl">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-center text-gray-900">
                Delete Permission
              </h3>
              <p className="text-sm text-center text-gray-500">
                Are you sure you want to delete <span className="font-medium text-gray-900">{selectedPermission.name}</span>?
                {selectedPermission.module === 'permission' && (
                  <span className="block mt-2 text-red-600">
                    ⚠️ This is a system permission and may affect role assignments.
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
                  className="flex-1 px-4 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Delete Permission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Permissions;