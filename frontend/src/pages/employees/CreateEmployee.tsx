import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  IdentificationIcon,
  CheckBadgeIcon,
  CameraIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

// Mock data - Replace with API calls
const mockDepartments = [
  { id: 1, name: 'Engineering', code: 'ENG' },
  { id: 2, name: 'Human Resources', code: 'HR' },
  { id: 3, name: 'Finance', code: 'FIN' },
  { id: 4, name: 'Marketing', code: 'MKT' },
  { id: 5, name: 'Operations', code: 'OPS' },
];

const mockPositions = [
  { id: 1, title: 'Senior Developer', code: 'SR-DEV' },
  { id: 2, title: 'Software Engineer', code: 'SWE' },
  { id: 3, title: 'Junior Developer', code: 'JR-DEV' },
  { id: 4, title: 'DevOps Engineer', code: 'DEVOPS' },
  { id: 5, title: 'HR Manager', code: 'HR-MGR' },
  { id: 6, title: 'Accountant', code: 'ACC' },
  { id: 7, title: 'Marketing Specialist', code: 'MKT-SPEC' },
];

// Generate employee code
const generateEmployeeCode = () => {
  const count = 5; // In real app, get from database
  return `EMP${String(count + 1).padStart(3, '0')}`;
};

export const CreateEmployee: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    employee_code: generateEmployeeCode(),
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: 'male' as const,
    date_of_birth: '',
    hire_date: new Date().toISOString().split('T')[0],
    department_id: '',
    position_id: '',
    employment_status: 'active' as const,
    profile_photo: null as File | null,
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
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, profile_photo: 'Please upload an image file' });
        return;
      }
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, profile_photo: 'Image size should be less than 2MB' });
        return;
      }
      
      setFormData({ ...formData, profile_photo: file });
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewAvatar(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      setErrors({ ...errors, profile_photo: '' });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required';
    }
    if (!formData.hire_date) {
      newErrors.hire_date = 'Hire date is required';
    }
    if (!formData.department_id) {
      newErrors.department_id = 'Department is required';
    }
    if (!formData.position_id) {
      newErrors.position_id = 'Position is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // TODO: API call to create employee with file upload
      // const formDataToSend = new FormData();
      // Object.entries(formData).forEach(([key, value]) => {
      //   if (value !== null) {
      //     formDataToSend.append(key, value);
      //   }
      // });
      console.log('Creating employee:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/admin/employees');
    } catch (error: any) {
      setErrors({ general: error.response?.data?.message || 'Failed to create employee' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl p-4 mx-auto sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/employees" className="p-2 transition-colors rounded-lg hover:bg-gray-100">
          <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Employee</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add a new employee to the system
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

          {/* Profile Photo */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex items-center justify-center w-20 h-20 overflow-hidden bg-gray-100 rounded-full">
                {previewAvatar ? (
                  <img src={previewAvatar} alt="Avatar preview" className="object-cover w-full h-full" />
                ) : (
                  <UserIcon className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-1.5 bg-primary-600 text-white rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
                <CameraIcon className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Profile Photo</p>
              <p className="text-xs text-gray-500">JPG, PNG, GIF up to 2MB</p>
              {errors.profile_photo && (
                <p className="mt-1 text-sm text-red-600">{errors.profile_photo}</p>
              )}
              {previewAvatar && (
                <button
                  type="button"
                  onClick={() => {
                    setPreviewAvatar(null);
                    setFormData({ ...formData, profile_photo: null });
                  }}
                  className="mt-1 text-xs text-red-600 hover:text-red-700"
                >
                  Remove photo
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Employee Code (Auto-generated) */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Employee Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <IdentificationIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="employee_code"
                  value={formData.employee_code}
                  className="w-full py-2 pl-10 pr-3 text-gray-500 border border-gray-300 rounded-lg cursor-not-allowed bg-gray-50"
                  disabled
                />
              </div>
            </div>

            {/* First Name */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                First Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <UserIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    errors.first_name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="John"
                />
              </div>
              {errors.first_name && (
                <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Last Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <UserIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    errors.last_name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Doe"
                />
              </div>
              {errors.last_name && (
                <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Email */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="john@company.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Phone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <PhoneIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="+1234567890"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Gender */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Date of Birth *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    errors.date_of_birth ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.date_of_birth && (
                <p className="mt-1 text-sm text-red-600">{errors.date_of_birth}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Hire Date */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Hire Date *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="hire_date"
                  value={formData.hire_date}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    errors.hire_date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.hire_date && (
                <p className="mt-1 text-sm text-red-600">{errors.hire_date}</p>
              )}
            </div>

            {/* Employment Status */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Employment Status
              </label>
              <select
                name="employment_status"
                value={formData.employment_status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="active">Active</option>
                <option value="resigned">Resigned</option>
                <option value="terminated">Terminated</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  <option value="">Select department</option>
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

            {/* Position */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Position *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <BriefcaseIcon className="w-5 h-5 text-gray-400" />
                </div>
                <select
                  name="position_id"
                  value={formData.position_id}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    errors.position_id ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select position</option>
                  {mockPositions.map((pos) => (
                    <option key={pos.id} value={pos.id}>
                      {pos.title}
                    </option>
                  ))}
                </select>
              </div>
              {errors.position_id && (
                <p className="mt-1 text-sm text-red-600">{errors.position_id}</p>
              )}
            </div>
          </div>

          {/* Preview Card */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="mb-2 text-sm font-medium text-gray-700">Preview</h4>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100">
                {previewAvatar ? (
                  <img src={previewAvatar} alt="Avatar" className="object-cover w-12 h-12 rounded-full" />
                ) : (
                  <UserIcon className="w-6 h-6 text-primary-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {formData.first_name || 'First'} {formData.last_name || 'Last'}
                </p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-xs text-gray-500">{formData.employee_code}</span>
                  {formData.department_id && (
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {mockDepartments.find(d => d.id === parseInt(formData.department_id))?.name}
                    </span>
                  )}
                  {formData.position_id && (
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {mockPositions.find(p => p.id === parseInt(formData.position_id))?.title}
                    </span>
                  )}
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    formData.employment_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    <CheckBadgeIcon className="w-3 h-3" />
                    {formData.employment_status.charAt(0).toUpperCase() + formData.employment_status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/admin/employees')}
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
                  Adding...
                </span>
              ) : (
                'Add Employee'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEmployee;