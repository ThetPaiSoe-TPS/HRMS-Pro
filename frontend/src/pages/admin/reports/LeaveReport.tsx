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
  ClockIcon,
} from "@heroicons/react/24/outline";
import type {
  LeaveReportData,
  LeaveSummaryData,
  ReportFilters,
} from "../../../types/report.types";
import { reportApi } from "../../../api/report/reportApi";
import { departmentApi } from "../../../api/department/departmentApi";
import { employeeApi } from "../../../api/employeeApi";

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

const statusColors: Record<string, string> = {
  approved: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};

const statusLabels: Record<string, string> = {
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export const LeaveReport: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"requests" | "summary">("requests");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [reportData, setReportData] = useState<LeaveReportData[]>([]);
  const [summaryData, setSummaryData] = useState<LeaveSummaryData[]>([]);
  const [filters, setFilters] = useState<ReportFilters>({
    date_from: "",
    date_to: "",
    department_id: "",
    employee_id: "",
    status: "",
    format: "pdf",
  });
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    total_days: 0,
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

  // Fetch report data
  const fetchReport = async () => {
    setLoading(true);
    try {
      const result = await reportApi.getLeaveReport(filters);
      console.log("Leave report result:", result);
      setReportData(result.data);
      setSummaryData(result.summary);
      // Update stats
      setStats({
        total: result.data.length,
        approved: result.data.filter((l) => l.status === "approved").length,
        pending: result.data.filter((l) => l.status === "pending").length,
        rejected: result.data.filter((l) => l.status === "rejected").length,
        total_days: result.data.reduce((sum, l) => sum + (l.days || 1), 0),
      });
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
      const blob = await reportApi.exportReport("leave", filters, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leave_report_${new Date().toISOString().split("T")[0]}.${format === "excel" ? "xlsx" : format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      setShowExportMenu(false);
    } catch (error) {
      console.error("Failed to export:", error);
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && reportData.length === 0) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Leave Report
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Generate leave reports and analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center overflow-hidden border border-gray-200 rounded-lg dark:border-gray-700">
            <button
              onClick={() => setView("requests")}
              className={`px-3 py-1.5 text-sm transition-colors ${
                view === "requests"
                  ? "bg-primary-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
              }`}
            >
              Requests
            </button>
            <button
              onClick={() => setView("summary")}
              className={`px-3 py-1.5 text-sm transition-colors ${
                view === "summary"
                  ? "bg-primary-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
              }`}
            >
              Summary
            </button>
          </div>
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
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-5">
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
          <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Total Requests
          </p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {stats.total}
          </p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <CheckBadgeIcon className="w-4 h-4 text-green-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
              Approved
            </p>
          </div>
          <p className="text-xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <ClockIcon className="w-4 h-4 text-yellow-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
              Pending
            </p>
          </div>
          <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <XMarkIcon className="w-4 h-4 text-red-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
              Rejected
            </p>
          </div>
          <p className="text-xl font-bold text-red-600">{stats.rejected}</p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
          <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Total Days
          </p>
          <p className="text-xl font-bold text-primary-600">
            {stats.total_days}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
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
              Status
            </label>
            <select
              value={filters.status || ""}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
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
        {loading && reportData.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary-600"></div>
          </div>
        ) : view === "requests" ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                    Employee
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                    Type
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                    Dates
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                    Days
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {reportData.map((leave, index) => (
                  <tr
                    key={index}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {leave.employee_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                          {leave.employee_code}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">
                      {leave.leave_type}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {formatDate(leave.start_date)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                        to {formatDate(leave.end_date)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {leave.days}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[leave.status] || "bg-gray-100 text-gray-800"}`}
                      >
                        {statusLabels[
                          leave.status as keyof typeof statusLabels
                        ] || leave.status}
                      </span>
                    </td>
                    <td className="max-w-xs px-4 py-3 text-sm text-gray-500 truncate dark:text-gray-400 dark:text-gray-500">
                      {leave.reason || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
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
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                    Annual
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                    Sick
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                    Personal
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                    Total Used
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {summaryData.map((summary, index) => (
                  <tr
                    key={index}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {summary.employee_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                          {summary.employee_code}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">
                      {summary.department}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {summary.annual_used}
                      </span>
                      <span className="ml-1 text-xs text-gray-400 dark:text-gray-500">
                        / {summary.annual_used + summary.annual_balance}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {summary.sick_used}
                      </span>
                      <span className="ml-1 text-xs text-gray-400 dark:text-gray-500">
                        / {summary.sick_used + summary.sick_balance}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {summary.personal_used}
                      </span>
                      <span className="ml-1 text-xs text-gray-400 dark:text-gray-500">
                        / {summary.personal_used + summary.personal_balance}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {summary.total_used}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-medium text-primary-600">
                        {summary.total_balance}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && reportData.length === 0 && (
          <div className="py-12 text-center">
            <UserGroupIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              No leave requests found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveReport;
