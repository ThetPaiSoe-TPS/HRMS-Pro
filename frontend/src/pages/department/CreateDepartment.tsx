import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  BuildingOfficeIcon,
  TagIcon,
  DocumentTextIcon,
  UserIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';

// Mock employees for manager dropdown - Replace with API call
const mockEmployees = [
  { id: 1, name: 'John Doe', employee_code: 'EMP001' },
  { id: 2, name: 'Jane Smith', employee_code: 'EMP002' },
  { id: 3, name: 'Robert Johnson', employee_code: 'EMP003' },
  { id: 4, name: 'Sarah Williams', employee_code: 'EMP004' },
  { id: 5, name: 'Michael Brown', employee_code: 'EMP005' },
];

export const CreateDepartment: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    manager_id: '',
    status: 'active' as const,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Department name is required';
    }
    if (!formData.code.trim()) {
      newErrors.code = 'Department code is required';
    } else if (!/^[A-Z0-9]{2,5}$/.test(formData.code)) {
      newErrors.code = 'Code must be 2-5 uppercase letters or numbers';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // TODO: API call to create department
      console.log('Creating department:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/admin/departments');
    } catch (error: any) {
      setErrors({ general: error.response?.data?.message || 'Failed to create department' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl p-4 mx-auto sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/departments" className="p-2 transition-colors rounded-lg hover:bg-gray-100">
          <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Department</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add a new department to the organization
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

          {/* Department Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Department Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Engineering"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Department Code */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Department Code *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <TagIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                  errors.code ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., ENG"
                maxLength={5}
              />
            </div>
            {errors.code && (
              <p className="mt-1 text-sm text-red-600">{errors.code}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              2-5 uppercase letters or numbers (e.g., ENG, HR, FIN)
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Description
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <DocumentTextIcon className="w-5 h-5 text-gray-400" />
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe the department's purpose and responsibilities"
              />
            </div>
          </div>

          {/* Manager */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Department Manager
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <UserIcon className="w-5 h-5 text-gray-400" />
              </div>
              <select
                name="manager_id"
                value={formData.manager_id}
                onChange={handleChange}
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select a manager</option>
                {mockEmployees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.employee_code} - {emp.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Preview */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="mb-2 text-sm font-medium text-gray-700">Preview</h4>
            <div className="p-4 rounded-lg bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-100">
                  <BuildingOfficeIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {formData.name || <span className="text-gray-400">Department Name</span>}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {formData.code && (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {formData.code}
                      </span>
                    )}
                    {formData.status && (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${formData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {formData.status === 'active' ? <CheckBadgeIcon className="w-3 h-3" /> : null}
                        {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/admin/departments')}
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
                'Create Department'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDepartment;