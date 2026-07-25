import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  BuildingOfficeIcon,
  TagIcon,
  DocumentTextIcon,
  UserIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import { employeeApi } from "../../api/employeeApi";
import { departmentApi } from "../../api/department/departmentApi";

interface Employee {
  id: number;
  name: string;
  employee_code: string;
}

export const EditDepartment: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    manager_id: "",
    status: "active" as const,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        // Fetch department data
        const department = await departmentApi.getDepartment(parseInt(id));
        setFormData({
          name: department.name,
          code: department.code,
          description: department.description || "",
          manager_id: department.manager_id?.toString() || "",
          status: department.status,
        });

        // Fetch employees for manager dropdown
        const result = await employeeApi.getEmployees({
          search: "",
          department_id: "",
          position_id: "",
          status: "active",
          page: 1,
          per_page: 100,
        });
        setEmployees(result.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setErrors({ general: "Failed to load department data" });
      } finally {
        setFetching(false);
      }
    };
    fetchData();
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

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Department name is required";
    }
    if (!formData.code.trim()) {
      newErrors.code = "Department code is required";
    } else if (!/^[A-Z0-9]{2,5}$/.test(formData.code)) {
      newErrors.code = "Code must be 2-5 uppercase letters or numbers";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await departmentApi.updateDepartment(parseInt(id!), {
        ...formData,
        manager_id: formData.manager_id ? parseInt(formData.manager_id) : null,
      });
      navigate("/admin/departments");
    } catch (error: any) {
      setErrors({
        general: error.response?.data?.message || "Failed to update department",
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
          to="/admin/departments"
          className="p-2 transition-colors rounded-lg hover:bg-gray-100"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 dark:text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Department</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Update department information
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

          {/* Department Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Department Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <BuildingOfficeIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
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

          {/* Department Code (Read-only) */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Department Code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <TagIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full py-2 pl-10 pr-3 text-gray-500 dark:text-gray-400 dark:text-gray-500 border border-gray-300 dark:border-gray-600 rounded-lg cursor-not-allowed bg-gray-50 dark:bg-gray-700"
                disabled
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
              Department code cannot be changed
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <DocumentTextIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full py-2 pl-10 pr-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Manager */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Department Manager
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <UserIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
              <select
                name="manager_id"
                value={formData.manager_id}
                onChange={handleChange}
                className="w-full py-2 pl-10 pr-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select a manager</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.employee_code} - {emp.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
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

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate("/admin/departments")}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 transition-colors border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDepartment;
