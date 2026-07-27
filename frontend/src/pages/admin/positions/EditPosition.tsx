import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  TagIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import { positionApi } from "../../../api/position/positionApi";
import { departmentApi } from "../../../api/department/departmentApi";

interface Department {
  id: number;
  name: string;
  code: string;
}

export const EditPosition: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    description: "",
    department_id: "",
    min_salary: "",
    max_salary: "",
    status: "active" as const,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        // Fetch position data
        const position = await positionApi.getPosition(parseInt(id));
        setFormData({
          title: position.title,
          code: position.code,
          description: position.description || "",
          department_id: position.department_id?.toString() || "",
          min_salary: position.min_salary?.toString() || "",
          max_salary: position.max_salary?.toString() || "",
          status: position.status,
        });

        // Fetch departments for dropdown
        const result = await departmentApi.getAll();
        setDepartments(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setErrors({ general: "Failed to load position data" });
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
    if (!formData.title.trim()) {
      newErrors.title = "Position title is required";
    }
    if (!formData.code.trim()) {
      newErrors.code = "Position code is required";
    } else if (!/^[A-Z0-9\-]{2,10}$/.test(formData.code)) {
      newErrors.code =
        "Code must be 2-10 uppercase letters, numbers, or hyphens";
    }
    if (!formData.department_id) {
      newErrors.department_id = "Department is required";
    }
    if (formData.min_salary && parseFloat(formData.min_salary) < 0) {
      newErrors.min_salary = "Minimum salary must be greater than 0";
    }
    if (formData.max_salary && parseFloat(formData.max_salary) < 0) {
      newErrors.max_salary = "Maximum salary must be greater than 0";
    }
    if (
      formData.min_salary &&
      formData.max_salary &&
      parseFloat(formData.min_salary) > parseFloat(formData.max_salary)
    ) {
      newErrors.max_salary =
        "Maximum salary must be greater than minimum salary";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await positionApi.updatePosition(parseInt(id!), {
        ...formData,
        department_id: parseInt(formData.department_id),
        min_salary: formData.min_salary
          ? parseFloat(formData.min_salary)
          : null,
        max_salary: formData.max_salary
          ? parseFloat(formData.max_salary)
          : null,
      });
      navigate("/admin/positions");
    } catch (error: any) {
      setErrors({
        general: error.response?.data?.message || "Failed to update position",
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
          to="/admin/positions"
          className="p-2 transition-colors rounded-lg hover:bg-gray-100"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 dark:text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Position</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Update position information
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

          {/* Position Title */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Position Title *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <BriefcaseIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                  errors.title ? "border-red-300" : "border-gray-300 dark:border-gray-600"
                }`}
              />
            </div>
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Position Code (Read-only) */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Position Code
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
              Position code cannot be changed
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
                <option value="">Select a department</option>
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

          {/* Salary Range */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Minimum Salary
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CurrencyDollarIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="number"
                  name="min_salary"
                  value={formData.min_salary}
                  onChange={handleChange}
                  className="w-full py-2 pl-10 pr-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  min="0"
                  step="1000"
                />
              </div>
              {errors.min_salary && (
                <p className="mt-1 text-sm text-red-600">{errors.min_salary}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Maximum Salary
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CurrencyDollarIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="number"
                  name="max_salary"
                  value={formData.max_salary}
                  onChange={handleChange}
                  className="w-full py-2 pl-10 pr-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
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
              onClick={() => navigate("/admin/positions")}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 transition-colors border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-white transition-colors rounded-lg bg-primary-900 hover:text-black hover:bg-secondary-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Position"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPosition;
