import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { payrollApi } from "../../../api/payroll/payrollApi";
import { employeeApi } from "../../../api/employeeApi";
import { getStorageUrl } from "../../../api/axios";
import type { Payroll, PayrollFilters } from "../../../types/payroll.types";

// Replace the getPhotoUrl function
const getPhotoUrl = (photo: string | null): string | null => {
  if (!photo) return null;
  if (photo.startsWith("http")) return photo;
  const baseUrl =
    import.meta.env.VITE_STORAGE_URL || "http://localhost:8000/storage";
  const cleanPath = photo.startsWith("/") ? photo.substring(1) : photo;
  return `${baseUrl}/${cleanPath}`;
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

export const Payslips: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [payslips, setPayslips] = useState<Payroll[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<PayrollFilters>({
    employee_id: "",
    month: "",
    year: "",
    status: "paid",
    search: "",
    page: 1,
    per_page: 10,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    last_page: 1,
    current_page: 1,
    per_page: 10,
    from: 0,
    to: 0,
  });

  const fetchPayslips = async () => {
    setLoading(true);
    try {
      const result = await payrollApi.getPayrolls(filters);
      setPayslips(result.data);
      setPagination({
        total: result.total,
        last_page: result.last_page,
        current_page: result.current_page,
        per_page: result.per_page,
        from: result.from || 0,
        to: result.to || 0,
      });
    } catch (error) {
      console.error("Failed to fetch payslips:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const result = await employeeApi.getEmployees({
        search: "",
        department_id: "",
        position_id: "",
        status: "",
        page: 1,
        per_page: 100,
      });
      setEmployees(result.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  useEffect(() => {
    fetchPayslips();
    fetchEmployees();
  }, [filters]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleFilterChange = (key: keyof PayrollFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleDownload = async (id: number) => {
    try {
      const blob = await payrollApi.downloadPayslip(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payslip_${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download payslip:", error);
    }
  };

  const handleView = (id: number) => {
    navigate(`/admin/payroll/${id}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("my-MM", {
      style: "currency",
      currency: "MMK",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getMonthYear = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Payslips
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
            View and download employee payslips
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 dark:text-gray-500 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search by employee name or code..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filters.month}
              onChange={(e) => handleFilterChange("month", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Months</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {new Date(2024, m - 1, 1).toLocaleDateString("en-US", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>
            <select
              value={filters.year}
              onChange={(e) => handleFilterChange("year", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Years</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilters({
                  employee_id: "",
                  month: "",
                  year: "",
                  status: "paid",
                  search: "",
                  page: 1,
                  per_page: 10,
                });
              }}
              className="p-2 text-gray-500 transition-colors dark:text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:text-gray-300"
            >
              <ArrowPathIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Payslips Table */}
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
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                      Employee
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                      Month
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400">
                      Gross Salary
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400">
                      Net Salary
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {payslips.map((payroll) => (
                    <tr
                      key={payroll.id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {payroll.employee?.photo ? (
                            <img
                              src={getPhotoUrl(payroll.employee.photo)}
                              alt={payroll.employee.name}
                              className="flex-shrink-0 object-cover w-8 h-8 rounded-full"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                                const parent = (e.target as HTMLImageElement)
                                  .parentElement;
                                if (parent) {
                                  const fallback =
                                    document.createElement("div");
                                  fallback.className = `flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full ${getRandomColor(payroll.employee?.id || 1)}`;
                                  fallback.innerHTML = `<span class="text-xs font-medium">${getInitials(payroll.employee?.name || "U")}</span>`;
                                  parent.appendChild(fallback);
                                }
                              }}
                            />
                          ) : (
                            <div
                              className={`flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full ${getRandomColor(payroll.employee?.id || 1)}`}
                            >
                              <span className="text-xs font-medium">
                                {getInitials(payroll.employee?.name || "U")}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {payroll.employee?.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                              {payroll.employee?.employee_code}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-sm text-gray-900 dark:text-gray-100">
                          <CalendarIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          {getMonthYear(payroll.payroll_month)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-gray-100">
                        {formatCurrency(payroll.gross_salary)}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-right text-primary-600">
                        {formatCurrency(payroll.net_salary)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(payroll.id)}
                            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                            title="View Payslip"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(payroll.id)}
                            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Download Payslip"
                          >
                            <DocumentArrowDownIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {payslips.length === 0 && (
              <div className="py-12 text-center">
                <CurrencyDollarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  No payslips found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                  Try adjusting your search or generate payroll
                </p>
              </div>
            )}

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                  Showing {pagination.from} to {pagination.to} of{" "}
                  {pagination.total} records
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="px-3 py-1 text-sm transition-colors border border-gray-300 rounded-lg dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Previous
                  </button>
                  {Array.from(
                    { length: pagination.last_page },
                    (_, i) => i + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        page === filters.page
                          ? "bg-primary-600 text-white"
                          : "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page === pagination.last_page}
                    className="px-3 py-1 text-sm transition-colors border border-gray-300 rounded-lg dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Payslips;
