import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  TagIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';

// Mock departments - Replace with API call
const mockDepartments = [
  { id: 1, name: 'Engineering', code: 'ENG' },
  { id: 2, name: 'Human Resources', code: 'HR' },
  { id: 3, name: 'Finance', code: 'FIN' },
  { id: 4, name: 'Marketing', code: 'MKT' },
  { id: 5, name: 'Operations', code: 'OPS' },
];

export const CreatePosition: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    description: '',
    department_id: '',
    min_salary: '',
    max_salary: '',
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
    if (!formData.title.trim()) {
      newErrors.title = 'Position title is required';
    }
    if (!formData.code.trim()) {
      newErrors.code = 'Position code is required';
    } else if (!/^[A-Z0-9\-]{2,10}$/.test(formData.code)) {
      newErrors.code = 'Code must be 2-10 uppercase letters, numbers, or hyphens';
    }
    if (!formData.department_id) {
      newErrors.department_id = 'Department is required';
    }
    if (formData.min_salary && parseFloat(formData.min_salary) < 0) {
      newErrors.min_salary = 'Minimum salary must be greater than 0';
    }
    if (formData.max_salary && parseFloat(formData.max_salary) < 0) {
      newErrors.max_salary = 'Maximum salary must be greater than 0';
    }
    if (formData.min_salary && formData.max_salary && 
        parseFloat(formData.min_salary) > parseFloat(formData.max_salary)) {
      newErrors.max_salary = 'Maximum salary must be greater than minimum salary';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // TODO: API call to create position
      console.log('Creating position:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/admin/positions');
    } catch (error: any) {
      setErrors({ general: error.response?.data?.message || 'Failed to create position' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl p-4 mx-auto sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/positions" className="p-2 transition-colors rounded-lg hover:bg-gray-100">
          <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Position</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add a new job position to the organization
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

          {/* Position Title */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Position Title *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <BriefcaseIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Senior Developer"
              />
            </div>
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Position Code */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Position Code *
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
                placeholder="e.g., SR-DEV"
                maxLength={10}
              />
            </div>
            {errors.code && (
              <p className="mt-1 text-sm text-red-600">{errors.code}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              2-10 uppercase letters, numbers, or hyphens (e.g., SR-DEV, HR-MGR)
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
                placeholder="Describe the position's responsibilities and requirements"
              />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Department *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
              </div>
              <select
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                  errors.department_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select a department</option>
                {mockDepartments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.department_id && (
              <p className="mt-1 text-sm text-red-600">{errors.department_id}</p>
            )}
          </div>

          {/* Salary Range */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Minimum Salary
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CurrencyDollarIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="min_salary"
                  value={formData.min_salary}
                  onChange={handleChange}
                  className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="30000"
                  min="0"
                  step="1000"
                />
              </div>
              {errors.min_salary && (
                <p className="mt-1 text-sm text-red-600">{errors.min_salary}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Maximum Salary
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CurrencyDollarIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="max_salary"
                  value={formData.max_salary}
                  onChange={handleChange}
                  className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="50000"
                  min="0"
                  step="1000"
                />
              </div>
              {errors.max_salary && (
                <p className="mt-1 text-sm text-red-600">{errors.max_salary}</p>
              )}
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
                  <BriefcaseIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {formData.title || <span className="text-gray-400">Position Title</span>}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {formData.code && (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {formData.code}
                      </span>
                    )}
                    {formData.department_id && (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {mockDepartments.find(d => d.id === parseInt(formData.department_id))?.name}
                      </span>
                    )}
                    {formData.status && (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${formData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {formData.status === 'active' ? <CheckBadgeIcon className="w-3 h-3" /> : null}
                        {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                      </span>
                    )}
                  </div>
                  {formData.min_salary || formData.max_salary ? (
                    <p className="mt-1 text-xs text-gray-500">
                      Salary: {formData.min_salary ? `$${parseInt(formData.min_salary).toLocaleString()}` : 'N/A'}
                      {formData.max_salary && ` - $${parseInt(formData.max_salary).toLocaleString()}`}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/admin/positions')}
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
                'Create Position'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePosition;