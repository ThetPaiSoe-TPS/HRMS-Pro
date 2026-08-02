import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  UserGroupIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { userApi } from "../../../api/user/userApi";
import { employeeApi } from "../../../api/employee/employeeApi";

interface Employee {
  id: number;
  name: string;
  employee_code: string;
}

interface Role {
  id: number;
  name: string;
  slug: string;
}

export const EditUser: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role_id: "",
    employee_id: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [userData, emps, rolesData] = await Promise.all([
          userApi.getUser(parseInt(id)),
          employeeApi.getEmployees({
            search: "",
            department_id: "",
            position_id: "",
            status: "active",
            page: 1,
            per_page: 100,
          }),
          userApi.getRoles(),
        ]);

        setFormData({
          name: userData.name,
          email: userData.email,
          role_id: userData.role_id?.toString() || "",
          employee_id: userData.employee_id?.toString() || "",
        });
        setEmployees(emps.data || []);

        // Ensure roles is an array
        const rolesArray = Array.isArray(rolesData) ? rolesData : [];
        setRoles(rolesArray);

        console.log("Roles loaded:", rolesArray); // Debug log
        console.log("Employees loaded:", emps.data); // Debug log
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setErrors({ general: "Failed to load user data" });
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.role_id) newErrors.role_id = "Role is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await userApi.updateUser(parseInt(id!), {
        ...formData,
        role_id: parseInt(formData.role_id),
        employee_id: formData.employee_id
          ? parseInt(formData.employee_id)
          : null,
      });
      navigate("/admin/users");
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({
          general: error.response?.data?.message || "Failed to update user",
        });
      }
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
          to="/admin/users"
          className="p-2 transition-colors rounded-lg hover:bg-gray-100"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 dark:text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Edit User
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Update user information
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="p-6 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="p-3 border border-red-200 rounded-lg bg-red-50">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name *
            </label>
            <div className="relative">
              <UserIcon className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2 dark:text-gray-500" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                  errors.name
                    ? "border-red-300"
                    : "border-gray-300 dark:border-gray-600"
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
              Email Address *
            </label>
            <div className="relative">
              <EnvelopeIcon className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2 dark:text-gray-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                  errors.email
                    ? "border-red-300"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Role *
            </label>
            <div className="relative">
              <UserGroupIcon className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2 dark:text-gray-500" />
              <select
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                  errors.role_id
                    ? "border-red-300"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.role_id && (
              <p className="mt-1 text-sm text-red-600">{errors.role_id}</p>
            )}
          </div>

          {/* Employee Association */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Associate with Employee
            </label>
            <select
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">No employee association</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.employee_code} - {emp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
