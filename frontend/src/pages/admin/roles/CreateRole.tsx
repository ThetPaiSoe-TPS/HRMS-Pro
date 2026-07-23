import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  CheckBadgeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import type { Permission } from '../../../types/role.types';

// Mock permissions - Replace with API call
const mockPermissions: Permission[] = [
  // Employee Module
  { id: 1, name: 'employee.view', guard_name: 'api', module: 'employee', description: 'View employees', created_at: '', updated_at: '' },
  { id: 2, name: 'employee.create', guard_name: 'api', module: 'employee', description: 'Create employees', created_at: '', updated_at: '' },
  { id: 3, name: 'employee.update', guard_name: 'api', module: 'employee', description: 'Update employees', created_at: '', updated_at: '' },
  { id: 4, name: 'employee.delete', guard_name: 'api', module: 'employee', description: 'Delete employees', created_at: '', updated_at: '' },
  
  // Attendance Module
  { id: 5, name: 'attendance.view', guard_name: 'api', module: 'attendance', description: 'View attendance', created_at: '', updated_at: '' },
  { id: 6, name: 'attendance.create', guard_name: 'api', module: 'attendance', description: 'Check in/out', created_at: '', updated_at: '' },
  
  // Leave Module
  { id: 7, name: 'leave.view', guard_name: 'api', module: 'leave', description: 'View leaves', created_at: '', updated_at: '' },
  { id: 8, name: 'leave.create', guard_name: 'api', module: 'leave', description: 'Apply leave', created_at: '', updated_at: '' },
  { id: 9, name: 'leave.approve', guard_name: 'api', module: 'leave', description: 'Approve leaves', created_at: '', updated_at: '' },
  { id: 10, name: 'leave.reject', guard_name: 'api', module: 'leave', description: 'Reject leaves', created_at: '', updated_at: '' },
  
  // Payroll Module
  { id: 11, name: 'payroll.view', guard_name: 'api', module: 'payroll', description: 'View payroll', created_at: '', updated_at: '' },
  { id: 12, name: 'payroll.generate', guard_name: 'api', module: 'payroll', description: 'Generate payroll', created_at: '', updated_at: '' },
  
  // User Module
  { id: 13, name: 'user.view', guard_name: 'api', module: 'user', description: 'View users', created_at: '', updated_at: '' },
  { id: 14, name: 'user.create', guard_name: 'api', module: 'user', description: 'Create users', created_at: '', updated_at: '' },
  { id: 15, name: 'user.update', guard_name: 'api', module: 'user', description: 'Update users', created_at: '', updated_at: '' },
  { id: 16, name: 'user.delete', guard_name: 'api', module: 'user', description: 'Delete users', created_at: '', updated_at: '' },
  
  // Profile Module
  { id: 17, name: 'profile.view', guard_name: 'api', module: 'profile', description: 'View profile', created_at: '', updated_at: '' },
  { id: 18, name: 'profile.update', guard_name: 'api', module: 'profile', description: 'Update profile', created_at: '', updated_at: '' },
];

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

export const CreateRole: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    description: '',
  });

  const groupedPermissions = getGroupedPermissions(mockPermissions);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSelectAll = (modulePermissions: Permission[]) => {
    const ids = modulePermissions.map(p => p.id);
    const allSelected = ids.every(id => selectedPermissions.includes(id));
    
    if (allSelected) {
      setSelectedPermissions(prev => prev.filter(id => !ids.includes(id)));
    } else {
      setSelectedPermissions(prev => [...prev, ...ids.filter(id => !prev.includes(id))]);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Role name is required';
    } else if (!/^[a-z_]+$/.test(formData.name)) {
      newErrors.name = 'Role name must be lowercase with underscores only';
    }
    if (!formData.display_name.trim()) {
      newErrors.display_name = 'Display name is required';
    }
    if (selectedPermissions.length === 0) {
      newErrors.permissions = 'Select at least one permission';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // TODO: API call to create role
      console.log('Creating role:', { ...formData, permissions: selectedPermissions });
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/admin/roles');
    } catch (error: any) {
      setErrors({ general: error.response?.data?.message || 'Failed to create role' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl p-4 mx-auto sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/roles" className="p-2 transition-colors rounded-lg hover:bg-gray-100">
          <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Role</h1>
          <p className="mt-1 text-sm text-gray-500">
            Define a new role and assign permissions
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="p-3 border border-red-200 rounded-lg bg-red-50">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Role Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Role Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., hr_manager"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Lowercase with underscores only (e.g., department_manager)
            </p>
          </div>

          {/* Display Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Display Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <DocumentTextIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="display_name"
                value={formData.display_name}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                  errors.display_name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., HR Manager"
              />
            </div>
            {errors.display_name && (
              <p className="mt-1 text-sm text-red-600">{errors.display_name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="Describe the role's purpose and responsibilities"
            />
          </div>

          {/* Permissions */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Permissions</h3>
                <p className="text-xs text-gray-500">Select the permissions for this role</p>
              </div>
              <span className="text-sm text-gray-500">
                {selectedPermissions.length} selected
              </span>
            </div>

            {errors.permissions && (
              <p className="mb-3 text-sm text-red-600">{errors.permissions}</p>
            )}

            <div className="space-y-4">
              {Object.entries(groupedPermissions).map(([module, perms]) => (
                <div key={module} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-900 capitalize">
                      {module}
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleSelectAll(perms)}
                      className="text-xs font-medium text-primary-600 hover:text-primary-700"
                    >
                      {perms.every(p => selectedPermissions.includes(p.id)) ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {perms.map((permission) => (
                      <label
                        key={permission.id}
                        className={`
                          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-all
                          ${selectedPermissions.includes(permission.id)
                            ? 'bg-primary-50 text-primary-700 border border-primary-200'
                            : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                          }
                        `}
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(permission.id)}
                          onChange={() => handlePermissionToggle(permission.id)}
                          className="sr-only"
                        />
                        {selectedPermissions.includes(permission.id) ? (
                          <CheckBadgeIcon className="w-4 h-4 text-primary-600" />
                        ) : (
                          <XMarkIcon className="w-4 h-4 text-gray-400" />
                        )}
                        {permission.name}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/admin/roles')}
              className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Role'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRole;