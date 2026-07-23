import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  BuildingOfficeIcon,
  TagIcon,
  DocumentTextIcon,
  UserIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';

// Mock data - Replace with API calls
const mockDepartment = {
  id: 1,
  name: 'Engineering',
  code: 'ENG',
  description: 'Software development and engineering team',
  manager_id: 1,
  status: 'active' as const,
};

const mockEmployees = [
  { id: 1, name: 'John Doe', employee_code: 'EMP001' },
  { id: 2, name: 'Jane Smith', employee_code: 'EMP002' },
  { id: 3, name: 'Robert Johnson', employee_code: 'EMP003' },
  { id: 4, name: 'Sarah Williams', employee_code: 'EMP004' },
  { id: 5, name: 'Michael Brown', employee_code: 'EMP005' },
];

export const EditDepartment: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    manager_id: '',
    status: 'active' as const,
  });

  useEffect(() => {
    // TODO: Fetch department data from API
    setFormData({
      name: mockDepartment.name,
      code: mockDepartment.code,
      description: mockDepartment.description || '',
      manager_id: mockDepartment.manager_id?.toString() || '',
      status: mockDepartment.status,
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
      // TODO: API call to update department
      console.log('Updating department:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/admin/departments');
    } catch (error: any) {
      setErrors({ general: error.response?.data?.message || 'Failed to update department' });
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Department</h1>
          <p className="mt-1 text-sm text-gray-500">
            Update department information
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
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Department Code (Read-only) */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Department Code
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
            <p className="mt-1 text-xs text-gray-500">Department code cannot be changed</p>
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
              {loading ? 'Updating...' : 'Update Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDepartment;