import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  CalendarIcon,
  UserGroupIcon,
  CheckBadgeIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { payrollApi } from "../../../api/payroll/payrollApi";
import { employeeApi } from "../../../api/employeeApi";
import { getStorageUrl } from "../../../api/axios";

export const GeneratePayroll: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    employee_ids: [] as number[],
    all_employees: true,
  });

  const [generatedCount, setGeneratedCount] = useState(0);

  // Helper functions for photos
  const getPhotoUrl = (photo: string | null): string | null => {
    return getStorageUrl(photo);
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomColor = (id: number): string => {
    const colors = [
      "bg-blue-100 text-blue-700",
      "bg-green-100 text-green-700",
      "bg-purple-100 text-purple-700",
      "bg-pink-100 text-pink-700",
      "bg-yellow-100 text-yellow-700",
      "bg-indigo-100 text-indigo-700",
      "bg-red-100 text-red-700",
      "bg-teal-100 text-teal-700",
      "bg-orange-100 text-orange-700",
      "bg-cyan-100 text-cyan-700",
    ];
    return colors[id % colors.length];
  };

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoadingEmployees(true);
      try {
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
        console.error("Failed to fetch employees:", error);
      } finally {
        setLoadingEmployees(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, month: parseInt(e.target.value) });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, year: parseInt(e.target.value) });
  };

  const handleEmployeeToggle = (employeeId: number) => {
    setFormData((prev) => ({
      ...prev,
      employee_ids: prev.employee_ids.includes(employeeId)
        ? prev.employee_ids.filter((id) => id !== employeeId)
        : [...prev.employee_ids, employeeId],
    }));
  };

  const handleSelectAll = () => {
    if (formData.employee_ids.length === employees.length) {
      setFormData({ ...formData, employee_ids: [] });
    } else {
      setFormData({
        ...formData,
        employee_ids: employees.map((e) => e.id),
      });
    }
  };

  const validate = () => {
    if (!formData.month) {
      setErrors({ month: "Month is required" });
      return false;
    }
    if (!formData.year) {
      setErrors({ year: "Year is required" });
      return false;
    }
    if (!formData.all_employees && formData.employee_ids.length === 0) {
      setErrors({ employee_ids: "Select at least one employee" });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSuccess(null);
    try {
      const payload = {
        month: formData.month,
        year: formData.year,
        employee_ids: formData.all_employees
          ? undefined
          : formData.employee_ids,
      };
      const result = await payrollApi.generatePayroll(payload);
      setGeneratedCount(result.length);
      setSuccess(
        `Payroll generated successfully for ${result.length} employees`,
      );

      setTimeout(() => {
        navigate("/admin/payroll");
      }, 2000);
    } catch (error: any) {
      setErrors({
        general: error.response?.data?.message || "Failed to generate payroll",
      });
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (month: number) => {
    return new Date(2024, month - 1, 1).toLocaleDateString("en-US", {
      month: "long",
    });
  };

  return (
    <div className="max-w-3xl p-4 mx-auto sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/admin/payroll"
          className="p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 dark:text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Generate Payroll
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Generate payroll for selected month and employees
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="p-6 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 rounded-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="flex items-start gap-3 p-3 border border-red-200 rounded-lg bg-red-50">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-3 p-3 border border-green-200 rounded-lg bg-green-50">
              <CheckBadgeIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-green-600">{success}</p>
                <p className="mt-1 text-xs text-green-500">
                  Redirecting to payroll list...
                </p>
              </div>
            </div>
          )}

          {/* Month & Year */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Month *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CalendarIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
                <select
                  value={formData.month}
                  onChange={handleMonthChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    errors.month
                      ? "border-red-300"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {getMonthName(m)}
                    </option>
                  ))}
                </select>
              </div>
              {errors.month && (
                <p className="mt-1 text-sm text-red-600">{errors.month}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Year *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CalendarIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
                <select
                  value={formData.year}
                  onChange={handleYearChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    errors.year
                      ? "border-red-300"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {[2023, 2024, 2025].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              {errors.year && (
                <p className="mt-1 text-sm text-red-600">{errors.year}</p>
              )}
            </div>
          </div>

          {/* Employee Selection */}
          <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <UserGroupIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Employees
                </span>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">
                  <input
                    type="checkbox"
                    checked={formData.all_employees}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        all_employees: e.target.checked,
                      })
                    }
                    className="w-4 h-4 border-gray-300 rounded dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                  />
                  All Employees
                </label>
                {!formData.all_employees && employees.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    {formData.employee_ids.length === employees.length
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                )}
              </div>
            </div>

            {loadingEmployees ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-b-2 rounded-full animate-spin border-primary-600"></div>
              </div>
            ) : !formData.all_employees ? (
              <div className="grid grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2 max-h-60">
                {employees.map((employee) => (
                  <label
                    key={employee.id}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                      formData.employee_ids.includes(employee.id)
                        ? "bg-primary-50 border border-primary-200"
                        : "bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.employee_ids.includes(employee.id)}
                      onChange={() => handleEmployeeToggle(employee.id)}
                      className="w-4 h-4 border-gray-300 rounded dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="flex items-center flex-1 min-w-0 gap-2">
                      {employee.photo ? (
                        <img
                          src={getPhotoUrl(employee.photo)}
                          alt={employee.name}
                          className="flex-shrink-0 object-cover w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div
                          className={`flex items-center justify-center flex-shrink-0 w-6 h-6 rounded-full ${getRandomColor(employee.id)}`}
                        >
                          <span className="text-[10px] font-medium">
                            {getInitials(employee.name)}
                          </span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-100">
                          {employee.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate dark:text-gray-400 dark:text-gray-500">
                          {employee.employee_code} •{" "}
                          {employee.department?.name || "N/A"}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            ) : null}

            {!formData.all_employees && errors.employee_ids && (
              <p className="mt-2 text-sm text-red-600">{errors.employee_ids}</p>
            )}
          </div>

          {/* Summary */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CurrencyDollarIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Payroll Summary
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                  {formData.all_employees
                    ? `All ${employees.length} employees`
                    : `${formData.employee_ids.length} employees selected`}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {getMonthName(formData.month)} {formData.year}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate("/admin/payroll")}
              className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
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
                  Generating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <CurrencyDollarIcon className="w-5 h-5" />
                  Generate Payroll
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeneratePayroll;
