import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  TagIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';

// Mock data - Replace with API calls
const mockPosition = {
  id: 1,
  title: 'Senior Developer',
  code: 'SR-DEV',
  description: 'Senior software developer with 5+ years experience',
  department_id: 1,
  min_salary: 50000,
  max_salary: 80000,
  status: 'active' as const,
};

const mockDepartments = [
  { id: 1, name: 'Engineering', code: 'ENG' },
  { id: 2, name: 'Human Resources', code: 'HR' },
  { id: 3, name: 'Finance', code: 'FIN' },
  { id: 4, name: 'Marketing', code: 'MKT' },
  { id: 5, name: 'Operations', code: 'OPS' },
];

export const EditPosition: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
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

  useEffect(() => {
    // TODO: Fetch position data from API
    setFormData({
      title: mockPosition.title,
      code: mockPosition.code,
      description: mockPosition.description || '',
      department_id: mockPosition.department_id.toString(),
      min_salary: mockPosition.min_salary?.toString() || '',
      max_salary: mockPosition.max_salary?.toString() || '',
      status: mockPosition.status,
    });
  }, [id]);

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
      // TODO: API call to update position
      console.log('Updating position:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/admin/positions');
    } catch (error: any) {
      setErrors({ general: error.response?.data?.message || 'Failed to update position' });
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Position</h1>
          <p className="mt-1 text-sm text-gray-500">
            Update position information
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
              />
            </div>
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Position Code (Read-only) */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Position Code
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
                className="w-full py-2 pl-10 pr-3 text-gray-500 border border-gray-300 rounded-lg cursor-not-allowed bg-gray-50"
                disabled
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Position code cannot be changed</p>
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
              {loading ? 'Updating...' : 'Update Position'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPosition;