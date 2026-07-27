import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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
} from "@heroicons/react/24/outline";
import { employeeApi, departmentApi, positionApi } from "../../api/employeeApi";

interface Department {
  id: number;
  name: string;
  code: string;
}

interface Position {
  id: number;
  title: string;
  department_id: number | null;
}

export const EditEmployee: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [existingPhoto, setExistingPhoto] = useState<string | null>(null);
  const [employeeCode, setEmployeeCode] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "male" as const,
    date_of_birth: "",
    hire_date: "",
    department_id: "",
    position_id: "",
    status: "active" as const,
    profile_photo: null as File | null,
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!id) return;
      try {
        const emp = await employeeApi.getEmployee(Number(id));
        setFormData({
          name: emp.name ?? "",
          email: emp.email ?? "",
          phone: emp.phone ?? "",
          gender: emp.gender ?? "male",
          date_of_birth: emp.date_of_birth?.split("T")[0] ?? "",
          hire_date: emp.hire_date?.split("T")[0] ?? "",
          department_id: emp.department_id?.toString() ?? "",
          position_id: emp.position_id?.toString() ?? "",
          status: emp.status ?? "active",
          profile_photo: null,
        });
        setEmployeeCode(emp.employee_code ?? "");
        if (emp.photo) {
          const photoUrl = emp.photo.startsWith("http")
            ? emp.photo
            : `http://localhost:8000/storage/${emp.photo}`;
          setExistingPhoto(photoUrl);
          setPreviewAvatar(photoUrl);
        }
      } catch (error) {
        console.error("Failed to fetch employee:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchEmployee();

    Promise.all([departmentApi.getAll(), positionApi.getAll()])
      .then(([depts, pos]) => {
        setDepartments(depts);
        setPositions(pos);
      })
      .catch(() => {});
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, profile_photo: "Please upload an image file" });
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors({
          ...errors,
          profile_photo: "Image size should be less than 2MB",
        });
        return;
      }
      setFormData({ ...formData, profile_photo: file });
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewAvatar(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      setErrors({ ...errors, profile_photo: "" });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = "Date of birth is required";
    }
    if (!formData.hire_date) {
      newErrors.hire_date = "Hire date is required";
    }
    if (!formData.department_id) {
      newErrors.department_id = "Department is required";
    }
    if (!formData.position_id) {
      newErrors.position_id = "Position is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { profile_photo, ...submitData } = formData;

      // Update employee
      const employee = await employeeApi.updateEmployee(Number(id), {
        ...submitData,
        department_id: Number(submitData.department_id),
        position_id: Number(submitData.position_id),
      });

      // Upload photo if exists
      if (profile_photo && employee.id) {
        await employeeApi.uploadPhoto(employee.id, profile_photo);
      }

      navigate("/admin/employees");
    } catch (error: any) {
      setErrors({
        general: error.response?.data?.message || "Failed to update employee",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl p-4 mx-auto sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/admin/employees"
          className="p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 dark:text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Employee</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Update employee information
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
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
                  <img
                    src={previewAvatar}
                    alt="Avatar preview"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <UserIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
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
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Profile Photo</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">JPG, PNG, GIF up to 2MB</p>
              {errors.profile_photo && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.profile_photo}
                </p>
              )}
              {previewAvatar && existingPhoto && !formData.profile_photo && (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await employeeApi.deletePhoto(Number(id));
                      setPreviewAvatar(null);
                      setExistingPhoto(null);
                      setFormData({ ...formData, profile_photo: null });
                    } catch (error) {
                      setErrors({ general: "Failed to delete photo" });
                    }
                  }}
                  className="mt-1 text-xs text-red-600 hover:text-red-700"
                >
                  Remove photo
                </button>
              )}
              {formData.profile_photo && (
                <button
                  type="button"
                  onClick={() => {
                    setPreviewAvatar(existingPhoto);
                    setFormData({ ...formData, profile_photo: null });
                  }}
                  className="mt-1 text-xs text-red-600 hover:text-red-700"
                >
                  Cancel new photo
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Employee Code (Read-only) */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Employee Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <IdentificationIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  value={employeeCode}
                  className="w-full py-2 pl-10 pr-3 text-gray-500 dark:text-gray-400 dark:text-gray-500 border border-gray-300 dark:border-gray-600 rounded-lg cursor-not-allowed bg-gray-50 dark:bg-gray-700"
                  disabled
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <UserIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    errors.name ? "border-red-300" : "border-gray-300 dark:border-gray-600"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    errors.email ? "border-red-300" : "border-gray-300 dark:border-gray-600"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <PhoneIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full py-2 pl-10 pr-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Gender */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Date of Birth *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CalendarIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    errors.date_of_birth ? "border-red-300" : "border-gray-300 dark:border-gray-600"
                  }`}
                />
              </div>
              {errors.date_of_birth && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.date_of_birth}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Hire Date */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Hire Date *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CalendarIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="date"
                  name="hire_date"
                  value={formData.hire_date}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    errors.hire_date ? "border-red-300" : "border-gray-300 dark:border-gray-600"
                  }`}
                />
              </div>
              {errors.hire_date && (
                <p className="mt-1 text-sm text-red-600">{errors.hire_date}</p>
              )}
            </div>

            {/* Employment Status */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Employment Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Department */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Department *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <BuildingOfficeIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
                <select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    errors.department_id ? "border-red-300" : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.department_id && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.department_id}
                </p>
              )}
            </div>

            {/* Position */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Position *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <BriefcaseIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
                <select
                  name="position_id"
                  value={formData.position_id}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    errors.position_id ? "border-red-300" : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <option value="">Select position</option>
                  {positions.map((pos) => (
                    <option key={pos.id} value={pos.id}>
                      {pos.title}
                    </option>
                  ))}
                </select>
              </div>
              {errors.position_id && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.position_id}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate("/admin/employees")}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 transition-colors border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-white transition-colors rounded-lg bg-primary-900 hover:bg-secondary-900 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Updating...
                </span>
              ) : (
                "Update Employee"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
