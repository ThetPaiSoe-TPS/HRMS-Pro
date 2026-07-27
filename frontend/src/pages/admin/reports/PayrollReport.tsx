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
  CurrencyDollarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import type {
  PayrollReportData,
  PayrollSummaryData,
  ReportFilters,
} from "../../../types/report.types";
import { reportApi } from "../../../api/report/reportApi";
import { departmentApi } from "../../../api/department/departmentApi";

interface Department {
  id: number;
  name: string;
  code: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
  draft: "bg-gray-100 text-gray-800",
  calculated: "bg-blue-100 text-blue-800",
  pending_approval: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  paid: "Paid",
  rejected: "Rejected",
  cancelled: "Cancelled",
  draft: "Draft",
  calculated: "Calculated",
  pending_approval: "Pending Approval",
  approved: "Approved",
};

export const PayrollReport: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"details" | "summary">("details");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [reportData, setReportData] = useState<PayrollReportData[]>([]);
  const [summaryData, setSummaryData] = useState<PayrollSummaryData[]>([]);
  const [filters, setFilters] = useState<ReportFilters>({
    date_from: "",
    date_to: "",
    department_id: "",
    employee_id: "",
    status: "",
    format: "pdf",
  });
  const [stats, setStats] = useState({
    total_employees: 0,
    total_gross: 0,
    total_net: 0,
    total_allowances: 0,
    total_deductions: 0,
    total_overtime: 0,
    paid: 0,
    pending: 0,
  });
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Fetch departments for filters
  useEffect(() => {
    const fetchData = async () => {
      try {
        const depts = await departmentApi.getAll();
        setDepartments(depts);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };
    fetchData();
  }, []);

  // Fetch report data
  const fetchReport = async () => {
    setLoading(true);
    try {
      const result = await reportApi.getPayrollReport(filters);
      console.log("Payroll report result:", result);
      setReportData(result.data);
      setSummaryData(result.summary);

      // Update stats
      const data = result.data;
      setStats({
        total_employees: data.length,
        total_gross: data.reduce((sum, p) => sum + (p.gross_salary || 0), 0),
        total_net: data.reduce((sum, p) => sum + (p.net_salary || 0), 0),
        total_allowances: data.reduce((sum, p) => sum + (p.allowances || 0), 0),
        total_deductions: data.reduce((sum, p) => sum + (p.deductions || 0), 0),
        total_overtime: data.reduce((sum, p) => sum + (p.overtime || 0), 0),
        paid: data.filter(
          (p) => p.payment_status === "paid" || p.payment_status === "approved",
        ).length,
        pending: data.filter(
          (p) =>
            p.payment_status === "pending" ||
            p.payment_status === "processing" ||
            p.payment_status === "pending_approval",
        ).length,
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
      const blob = await reportApi.exportReport("payroll", filters, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payroll_report_${new Date().toISOString().split("T")[0]}.${format === "excel" ? "xlsx" : format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      setShowExportMenu(false);
    } catch (error) {
      console.error("Failed to export:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("my-MM", {
      style: "currency",
      currency: "MMK",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
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
            Payroll Report
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Generate payroll reports and analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center overflow-hidden border border-gray-200 rounded-lg dark:border-gray-700">
            <button
              onClick={() => setView("details")}
              className={`px-3 py-1.5 text-sm transition-colors ${
                view === "details"
                  ? "bg-primary-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
              }`}
            >
              Details
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
      <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4 lg:grid-cols-7">
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
          <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Employees
          </p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {stats.total_employees}
          </p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
          <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Gross Salary
          </p>
          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(stats.total_gross)}
          </p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
          <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Net Salary
          </p>
          <p className="text-sm font-bold text-primary-600">
            {formatCurrency(stats.total_net)}
          </p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
          <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Allowances
          </p>
          <p className="text-sm font-bold text-green-600">
            {formatCurrency(stats.total_allowances)}
          </p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
          <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Deductions
          </p>
          <p className="text-sm font-bold text-red-600">
            {formatCurrency(stats.total_deductions)}
          </p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <CheckBadgeIcon className="w-4 h-4 text-green-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
              Paid
            </p>
          </div>
          <p className="text-xl font-bold text-green-600">{stats.paid}</p>
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
      </div>

      {/* Filters */}
      <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
              <option value="draft">Draft</option>
              <option value="calculated">Calculated</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Month
            </label>
            <input
              type="month"
              value={filters.date_from}
              onChange={(e) => handleFilterChange("date_from", e.target.value)}
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
        ) : view === "details" ? (
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
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                    Basic
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                    Allowances
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                    Deductions
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                    Net
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {reportData.map((payroll, index) => (
                  <tr
                    key={index}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {payroll.employee_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                          {payroll.employee_code}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">
                      {payroll.department}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-gray-100">
                      {formatCurrency(payroll.basic_salary)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-green-600">
                      {formatCurrency(payroll.allowances)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-red-600">
                      {formatCurrency(payroll.deductions)}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-right text-primary-600">
                      {formatCurrency(payroll.net_salary)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[payroll.payment_status] || "bg-gray-100 text-gray-800"}`}
                      >
                        {statusLabels[
                          payroll.payment_status as keyof typeof statusLabels
                        ] || payroll.payment_status}
                      </span>
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
                    Department
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                    Employees
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                    Basic
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                    Allowances
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                    Deductions
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                    Gross
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                    Net
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {summaryData.map((summary, index) => (
                  <tr
                    key={index}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {summary.department}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-gray-100">
                      {summary.total_employees}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-gray-100">
                      {formatCurrency(summary.total_basic)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-green-600">
                      {formatCurrency(summary.total_allowances)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-red-600">
                      {formatCurrency(summary.total_deductions)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-right text-gray-900 dark:text-gray-100">
                      {formatCurrency(summary.total_gross)}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-right text-primary-600">
                      {formatCurrency(summary.total_net)}
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
            <CurrencyDollarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              No payroll records found
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

export default PayrollReport;
