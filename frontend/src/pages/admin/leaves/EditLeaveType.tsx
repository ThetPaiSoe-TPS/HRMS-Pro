import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CalendarIcon,
  DocumentTextIcon,
  CheckBadgeIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

// Mock data - Replace with API call
const mockLeaveType = {
  id: 1,
  name: 'Annual Leave',
  code: 'ANNUAL',
  description: 'Regular paid annual leave',
  days_per_year: 20,
  is_paid: true,
  requires_approval: true,
  max_consecutive_days: 15,
  carry_forward: true,
  carry_forward_limit: 5,
  status: 'active' as const,
};

export const EditLeaveType: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    days_per_year: 0,
    is_paid: true,
    requires_approval: true,
    max_consecutive_days: null as number | null,
    carry_forward: true,
    carry_forward_limit: null as number | null,
    status: 'active' as const,
  });

  useEffect(() => {
    // TODO: Fetch leave type data from API
    setFormData({
      name: mockLeaveType.name,
      code: mockLeaveType.code,
      description: mockLeaveType.description || '',
      days_per_year: mockLeaveType.days_per_year,
      is_paid: mockLeaveType.is_paid,
      requires_approval: mockLeaveType.requires_approval,
      max_consecutive_days: mockLeaveType.max_consecutive_days,
      carry_forward: mockLeaveType.carry_forward,
      carry_forward_limit: mockLeaveType.carry_forward_limit,
      status: mockLeaveType.status,
    });
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Leave type name is required';
    }
    if (!formData.code.trim()) {
      newErrors.code = 'Code is required';
    } else if (!/^[A-Z_]+$/.test(formData.code)) {
      newErrors.code = 'Code must be uppercase letters and underscores only';
    }
    if (formData.days_per_year < 0) {
      newErrors.days_per_year = 'Days per year must be greater than 0';
    }
    if (formData.max_consecutive_days && formData.max_consecutive_days < 0) {
      newErrors.max_consecutive_days = 'Max consecutive days must be greater than 0';
    }
    if (formData.carry_forward && formData.carry_forward_limit && formData.carry_forward_limit < 0) {
      newErrors.carry_forward_limit = 'Carry forward limit must be greater than 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // TODO: API call to update leave type
      console.log('Updating leave type:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/admin/leave-types');
    } catch (error: any) {
      setErrors({ general: error.response?.data?.message || 'Failed to update leave type' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl p-4 mx-auto sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/leave-types" className="p-2 transition-colors rounded-lg hover:bg-gray-100">
          <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Leave Type</h1>
          <p className="mt-1 text-sm text-gray-500">
            Update leave type policies
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="flex items-start gap-3 p-3 border border-red-200 rounded-lg bg-red-50">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Name */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Leave Type Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <DocumentTextIcon className="w-5 h-5 text-gray-400" />
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

            {/* Code (Read-only) */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.code}
                  className="w-full py-2 pl-10 pr-3 text-gray-500 border border-gray-300 rounded-lg cursor-not-allowed bg-gray-50"
                  disabled
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Code cannot be changed</p>
            </div>
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
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Days Per Year */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Days Per Year *
              </label>
              <input
                type="number"
                name="days_per_year"
                value={formData.days_per_year}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                  errors.days_per_year ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.days_per_year && (
                <p className="mt-1 text-sm text-red-600">{errors.days_per_year}</p>
              )}
            </div>

            {/* Max Consecutive Days */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Max Consecutive Days
              </label>
              <input
                type="number"
                name="max_consecutive_days"
                value={formData.max_consecutive_days || ''}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                  errors.max_consecutive_days ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Leave blank for unlimited"
              />
              {errors.max_consecutive_days && (
                <p className="mt-1 text-sm text-red-600">{errors.max_consecutive_days}</p>
              )}
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Is Paid */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <div className="relative inline-flex items-center">
                <input
                  type="checkbox"
                  name="is_paid"
                  checked={formData.is_paid}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className={`w-11 h-6 rounded-full transition-colors cursor-pointer ${
                    formData.is_paid ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                  onClick={() => setFormData({ ...formData, is_paid: !formData.is_paid })}
                >
                  <div
                    className={`h-5 w-5 rounded-full bg-white shadow transform transition-transform ${
                      formData.is_paid ? 'translate-x-6' : 'translate-x-0.5'
                    } mt-0.5`}
                  />
                </div>
                <span className="ml-3 text-sm text-gray-700">
                  <CurrencyDollarIcon className="inline w-4 h-4 mr-1 text-gray-400" />
                  Paid Leave
                </span>
              </div>
            </div>

            {/* Requires Approval */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <div className="relative inline-flex items-center">
                <input
                  type="checkbox"
                  name="requires_approval"
                  checked={formData.requires_approval}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className={`w-11 h-6 rounded-full transition-colors cursor-pointer ${
                    formData.requires_approval ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                  onClick={() => setFormData({ ...formData, requires_approval: !formData.requires_approval })}
                >
                  <div
                    className={`h-5 w-5 rounded-full bg-white shadow transform transition-transform ${
                      formData.requires_approval ? 'translate-x-6' : 'translate-x-0.5'
                    } mt-0.5`}
                  />
                </div>
                <span className="ml-3 text-sm text-gray-700">
                  <CheckBadgeIcon className="inline w-4 h-4 mr-1 text-gray-400" />
                  Requires Approval
                </span>
              </div>
            </div>
          </div>

          {/* Carry Forward */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="relative inline-flex items-center">
                <input
                  type="checkbox"
                  name="carry_forward"
                  checked={formData.carry_forward}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className={`w-11 h-6 rounded-full transition-colors cursor-pointer ${
                    formData.carry_forward ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                  onClick={() => setFormData({ ...formData, carry_forward: !formData.carry_forward })}
                >
                  <div
                    className={`h-5 w-5 rounded-full bg-white shadow transform transition-transform ${
                      formData.carry_forward ? 'translate-x-6' : 'translate-x-0.5'
                    } mt-0.5`}
                  />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  <UserGroupIcon className="inline w-4 h-4 mr-1 text-gray-400" />
                  Allow Carry Forward
                </span>
              </div>
            </div>

            {formData.carry_forward && (
              <div className="mt-3 pl-14">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Carry Forward Limit
                </label>
                <input
                  type="number"
                  name="carry_forward_limit"
                  value={formData.carry_forward_limit || ''}
                  onChange={handleChange}
                  min="0"
                  className={`w-full sm:w-48 px-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    errors.carry_forward_limit ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Max days to carry forward"
                />
                {errors.carry_forward_limit && (
                  <p className="mt-1 text-sm text-red-600">{errors.carry_forward_limit}</p>
                )}
              </div>
            )}
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
              onClick={() => navigate('/admin/leave-types')}
              className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Leave Type'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLeaveType;