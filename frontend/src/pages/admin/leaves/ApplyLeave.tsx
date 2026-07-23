import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CalendarIcon,
  DocumentTextIcon,
  PaperClipIcon,
  UserIcon,
  CheckBadgeIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../hooks/useAuth';

// Mock data - Replace with API calls
const mockLeaveTypes = [
  { id: 1, name: 'Annual Leave', code: 'ANNUAL' },
  { id: 2, name: 'Sick Leave', code: 'SICK' },
  { id: 3, name: 'Personal Leave', code: 'PERSONAL' },
  { id: 4, name: 'Maternity Leave', code: 'MATERNITY' },
];

const mockBalance = {
  total: 20,
  used: 8,
  pending: 2,
  available: 10,
};

export const ApplyLeave: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    leave_type_id: '',
    start_date: '',
    end_date: '',
    reason: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, attachment: 'File size should be less than 5MB' });
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrors({ ...errors, attachment: '' });
    }
  };

  const calculateDays = () => {
    if (!formData.start_date || !formData.end_date) return 0;
    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.leave_type_id) {
      newErrors.leave_type_id = 'Leave type is required';
    }
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }
    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    } else if (formData.start_date && new Date(formData.end_date) < new Date(formData.start_date)) {
      newErrors.end_date = 'End date must be after start date';
    }
    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // TODO: API call to submit leave request
      console.log('Submitting leave request:', {
        ...formData,
        days: calculateDays(),
        attachment: selectedFile,
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/admin/leaves');
    } catch (error: any) {
      setErrors({ general: error.response?.data?.message || 'Failed to submit leave request' });
    } finally {
      setLoading(false);
    }
  };

  const days = calculateDays();

  return (
    <div className="max-w-3xl p-4 mx-auto sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/leaves" className="p-2 transition-colors rounded-lg hover:bg-gray-100">
          <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Apply Leave</h1>
          <p className="mt-1 text-sm text-gray-500">
            Submit a new leave request
          </p>
        </div>
      </div>

      {/* Balance Info */}
      <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Leave Balance</p>
            <p className="text-2xl font-bold text-primary-600">{mockBalance.available} days</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Total: {mockBalance.total} days</p>
            <p className="text-xs text-gray-500">Used: {mockBalance.used} days</p>
            <p className="text-xs text-yellow-500">Pending: {mockBalance.pending} days</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="flex items-start gap-3 p-3 border border-red-200 rounded-lg bg-red-50">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Leave Type */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Leave Type *
            </label>
            <select
              name="leave_type_id"
              value={formData.leave_type_id}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                errors.leave_type_id ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select leave type</option>
              {mockLeaveTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} ({type.code})
                </option>
              ))}
            </select>
            {errors.leave_type_id && (
              <p className="mt-1 text-sm text-red-600">{errors.leave_type_id}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Start Date */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Start Date *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    errors.start_date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.start_date && (
                <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                End Date *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    errors.end_date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.end_date && (
                <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
              )}
            </div>
          </div>

          {/* Days count */}
          {days > 0 && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="text-sm text-gray-600">Total days requested:</span>
              <span className="text-sm font-semibold text-primary-600">{days} day(s)</span>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Reason *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <DocumentTextIcon className="w-5 h-5 text-gray-400" />
              </div>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={4}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                  errors.reason ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Please provide a detailed reason for your leave request..."
              />
            </div>
            {errors.reason && (
              <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
            )}
          </div>

          {/* Attachment */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Attachment (Optional)
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50">
                  <PaperClipIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {selectedFile ? selectedFile.name : 'Upload file (PDF, DOC, JPG)'}
                  </span>
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {selectedFile && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="p-2 text-red-600 transition-colors rounded-lg hover:bg-red-50"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>
            {errors.attachment && (
              <p className="mt-1 text-sm text-red-600">{errors.attachment}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Max file size: 5MB. Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG
            </p>
          </div>

          {/* Preview */}
          {previewUrl && (
            <div className="pt-4 border-t border-gray-200">
              <h4 className="mb-2 text-sm font-medium text-gray-700">Attachment Preview</h4>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
                <PaperClipIcon className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{selectedFile?.name}</p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile?.size || 0 / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/admin/leaves')}
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
                  Submitting...
                </span>
              ) : (
                'Submit Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;