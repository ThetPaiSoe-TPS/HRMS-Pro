import React, { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
  ArrowPathIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CheckBadgeIcon,
  XMarkIcon,
  EnvelopeIcon,
  PhoneIcon,
  BriefcaseIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import type {
  EmployeeReportData,
  ReportFilters,
} from "../../../types/report.types";
import { reportApi } from "../../../api/report/reportApi";
import { departmentApi } from "../../../api/department/departmentApi";
import { employeeApi } from "../../../api/employeeApi";
import { getStorageUrl } from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";

interface Department {
  id: number;
  name: string;
  code: string;
}

interface Employee {
  id: number;
  name: string;
  employee_code: string;
}

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

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  resigned: "bg-yellow-100 text-yellow-800",
  terminated: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
  resigned: "Resigned",
  terminated: "Terminated",
};

const genderLabels: Record<string, string> = {
  male: "Male",
  female: "Female",
  other: "Other",
};

export const EmployeeReport: React.FC = () => {
  const { user } = useAuth(); // Add this
  const isSuperAdmin = user?.role === "super_admin";
  const isManager = user?.role === "manager";
  const isReadOnly = !isSuperAdmin;
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [reportData, setReportData] = useState<EmployeeReportData[]>([]);
  const [filters, setFilters] = useState<ReportFilters>({
    date_from: "",
    date_to: "",
    department_id: "",
    employee_id: "",
    status: "",
  });
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Fetch departments and employees for filters
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [depts, emps] = await Promise.all([
          departmentApi.getAll(),
          employeeApi.getEmployees({
            search: "",
            department_id: "",
            position_id: "",
            status: "",
            page: 1,
            per_page: 100,
          }),
        ]);
        setDepartments(depts);
        setEmployees(emps.data);
      } catch (error) {
        console.error("Failed to fetch filter data:", error);
      }
    };
    fetchData();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        // If manager, filter by their department
        department_id:
          isManager && user?.employee?.department_id
            ? String(user.employee.department_id)
            : filters.department_id,
      };
      const data = await reportApi.getEmployeeReport(params);
      console.log("Report data:", data);
      setReportData(data);
    } catch (error) {
      console.error("Failed to fetch report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [filters]);

  const handleFilterChange = (key: keyof ReportFilters, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleGenerateReport = () => {
    fetchReport();
  };

  const handleExport = async (format: "pdf" | "excel" | "csv") => {
    try {
      const blob = await reportApi.exportReport("employees", filters, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `employee_report_${new Date().toISOString().split("T")[0]}.${format === "excel" ? "xlsx" : format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      setShowExportMenu(false);
    } catch (error) {
      console.error("Failed to export:", error);
    }
  };

  const stats = {
    total: reportData.length,
    active: reportData.filter((e) => e.employment_status === "active").length,
    inactive: reportData.filter((e) => e.employment_status === "inactive")
      .length,
    resigned: reportData.filter((e) => e.employment_status === "resigned")
      .length,
    terminated: reportData.filter((e) => e.employment_status === "terminated")
      .length,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("my-MM", {
      style: "currency",
      currency: "MMK",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {isManager ? "Team Report" : "Employee Report"}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
            {isManager
              ? "View your team reports (read-only)"
              : "Generate employee reports and analytics"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isManager && (
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
              <EyeIcon className="w-4 h-4" />
              Read Only
            </span>
          )}
          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg shadow-sm bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? (
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
            ) : (
              <ArrowPathIcon className="w-5 h-5" />
            )}
            Generate Report
          </button>
          {!isReadOnly && (
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
              >
                <DocumentArrowDownIcon className="w-5 h-5" />
                Export
              </button>
              {showExportMenu && (
                <div className="absolute right-0 z-10 w-40 py-1 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                  <button
                    onClick={() => handleExport("pdf")}
                    className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-gray-700 transition-colors dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                  >
                    📄 PDF
                  </button>
                  <button
                    onClick={() => handleExport("excel")}
                    className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-gray-700 transition-colors dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                  >
                    📊 Excel
                  </button>
                  <button
                    onClick={() => handleExport("csv")}
                    className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-gray-700 transition-colors dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                  >
                    📋 CSV
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-5">
        <div className="p-4 text-center bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
          <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Total Employees
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.total}
          </p>
        </div>
        <div className="p-4 text-center bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <CheckBadgeIcon className="w-4 h-4 text-green-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
              Active
            </p>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="p-4 text-center bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <XMarkIcon className="w-4 h-4 text-gray-400" />
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
              Inactive
            </p>
          </div>
          <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
        </div>
        <div className="p-4 text-center bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <XMarkIcon className="w-4 h-4 text-yellow-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
              Resigned
            </p>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{stats.resigned}</p>
        </div>
        <div className="p-4 text-center bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <XMarkIcon className="w-4 h-4 text-red-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
              Terminated
            </p>
          </div>
          <p className="text-2xl font-bold text-red-600">{stats.terminated}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Department
            </label>
            <select
              value={filters.department_id}
              onChange={(e) =>
                handleFilterChange("department_id", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
              disabled={isManager} // Disable for managers
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Employee
            </label>
            <select
              value={filters.employee_id || ""}
              onChange={(e) =>
                handleFilterChange("employee_id", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.employee_code} - {emp.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              value={filters.status || ""}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="resigned">Resigned</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Date From
            </label>
            <input
              type="date"
              value={filters.date_from}
              onChange={(e) => handleFilterChange("date_from", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Date To
            </label>
            <input
              type="date"
              value={filters.date_to}
              onChange={(e) => handleFilterChange("date_to", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                      Employee
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                      Department
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                      Position
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                      Gender
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                      Age
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                      Tenure
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {reportData.map((employee) => (
                    <tr
                      key={employee.id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {employee.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                            {employee.employee_code}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">
                        {employee.department}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">
                        {employee.position}
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <EnvelopeIcon className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 truncate max-w-[150px]">
                              {employee.email}
                            </span>
                          </div>
                          {employee.phone && (
                            <div className="flex items-center gap-1.5">
                              <PhoneIcon className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                              <span className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">
                                {employee.phone}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">
                        {genderLabels[
                          employee.gender as keyof typeof genderLabels
                        ] ||
                          employee.gender ||
                          "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {employee.age ?? "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm text-gray-900 dark:text-gray-100">
                            {employee.tenure_years}y
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                            {employee.hire_date
                              ? new Date(
                                  employee.hire_date,
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[employee.employment_status] || "bg-gray-100 text-gray-800"}`}
                        >
                          {statusLabels[
                            employee.employment_status as keyof typeof statusLabels
                          ] || employee.employment_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {reportData.length === 0 && (
              <div className="py-12 text-center">
                <UserGroupIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  No employees found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                  Try adjusting your filters
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeReport;
