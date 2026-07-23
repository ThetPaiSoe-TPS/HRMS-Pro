import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  KeyIcon,
  FolderIcon,
  DocumentTextIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import { MODULES } from '../../types/permission.types';

export const CreatePermission: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    module: '',
    description: '',
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
      newErrors.name = 'Permission name is required';
    } else if (!/^[a-z]+\.[a-z]+$/.test(formData.name)) {
      newErrors.name = 'Permission name must be in format "module.action" (e.g., employee.view)';
    }
    if (!formData.module) {
      newErrors.module = 'Module is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // TODO: API call to create permission
      console.log('Creating permission:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/admin/permissions');
    } catch (error: any) {
      setErrors({ general: error.response?.data?.message || 'Failed to create permission' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl p-4 mx-auto sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/permissions" className="p-2 transition-colors rounded-lg hover:bg-gray-100">
          <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Permission</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add a new permission to the system
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

          {/* Permission Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Permission Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <KeyIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., employee.view"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Format: <span className="font-mono">module.action</span> (e.g., employee.view, leave.approve)
            </p>
          </div>

          {/* Module */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Module *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FolderIcon className="w-5 h-5 text-gray-400" />
              </div>
              <select
                name="module"
                value={formData.module}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                  errors.module ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select a module</option>
                {MODULES.map((module) => (
                  <option key={module} value={module}>
                    {module.charAt(0).toUpperCase() + module.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            {errors.module && (
              <p className="mt-1 text-sm text-red-600">{errors.module}</p>
            )}
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
                placeholder="Describe what this permission allows"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="mb-2 text-sm font-medium text-gray-700">Preview</h4>
            <div className="p-4 rounded-lg bg-gray-50">
              <div className="flex items-center gap-2">
                <CheckBadgeIcon className="w-5 h-5 text-primary-600" />
                <span className="text-sm text-gray-700">
                  {formData.name ? (
                    <span className="font-mono">{formData.name}</span>
                  ) : (
                    <span className="text-gray-400">Enter a permission name</span>
                  )}
                </span>
                {formData.module && (
                  <span className={`ml-2 inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
                    {formData.module}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/admin/permissions')}
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
                'Create Permission'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePermission;