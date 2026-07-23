import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

export const CreateLeaveType: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    days_per_year: 20,
    is_paid: true,
    requires_approval: true,
    max_consecutive_days: 15,
    carry_forward: true,
    carry_forward_limit: 5,
    status: 'active' as const,
  });

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
      // TODO: API call to create leave type
      console.log('Creating leave type:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/admin/leave-types');
    } catch (error: any) {
      setErrors({ general: error.response?.data?.message || 'Failed to create leave type' });
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
          <h1 className="text-2xl font-bold text-gray-900">Create Leave Type</h1>
          <p className="mt-1 text-sm text-gray-500">
            Define a new leave type and its policies
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
                  placeholder="e.g., Annual Leave"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Code */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Code *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    errors.code ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., ANNUAL"
                />
              </div>
              {errors.code && (
                <p className="mt-1 text-sm text-red-600">{errors.code}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Uppercase letters and underscores only (e.g., ANNUAL, SICK_LEAVE)
              </p>
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
              placeholder="Describe the leave type and its purpose..."
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

          {/* Preview */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="mb-2 text-sm font-medium text-gray-700">Preview</h4>
            <div className="p-4 rounded-lg bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-100">
                  <CalendarIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {formData.name || <span className="text-gray-400">Leave Type Name</span>}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {formData.code && (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {formData.code}
                      </span>
                    )}
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {formData.days_per_year} days/year
                    </span>
                    {formData.is_paid && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CurrencyDollarIcon className="w-3 h-3" />
                        Paid
                      </span>
                    )}
                    <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${formData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                    </span>
                  </div>
                  {formData.description && (
                    <p className="mt-1 text-xs text-gray-500">{formData.description}</p>
                  )}
                </div>
              </div>
            </div>
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
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Leave Type'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLeaveType;