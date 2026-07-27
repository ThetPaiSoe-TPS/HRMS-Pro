import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilSquareIcon,
  CheckBadgeIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserGroupIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  BanknotesIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import type {
  Payroll,
  PayrollFilters,
  PayrollStats,
} from "../../../types/payroll.types";
import { payrollApi } from "../../../api/payroll/payrollApi";
import { employeeApi } from "../../../api/employeeApi";
import { getStorageUrl } from "../../../api/axios";

// Replace the getPhotoUrl function
const getPhotoUrl = (photo: string | null): string | null => {
  if (!photo) return null;
  if (photo.startsWith("http")) return photo;
  // Use the storage URL from environment or fallback
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

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  calculated: "bg-blue-100 text-blue-800",
  pending_approval: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  paid: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  draft: "Draft",
  calculated: "Calculated",
  pending_approval: "Pending Approval",
  approved: "Approved",
  paid: "Paid",
  cancelled: "Cancelled",
};

const statusIcons: Record<string, any> = {
  draft: ClockIcon,
  calculated: ArrowPathIcon,
  pending_approval: ClockIcon,
  approved: CheckBadgeIcon,
  paid: CheckBadgeIcon,
  cancelled: XMarkIcon,
};

export const PayrollList: React.FC = () => {
  const navigate = useNavigate();
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<PayrollFilters>({
    employee_id: "",
    month: "",
    year: "",
    status: "",
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
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<
    "approve" | "pay" | "reject" | "cancel"
  >("approve");
  const [paymentData, setPaymentData] = useState({
    payment_method: "bank_transfer" as const,
    bank_name: "",
    bank_account: "",
    payment_date: "",
  });

  // Fetch payrolls
  const fetchPayrolls = async () => {
    setLoading(true);
    try {
      const result = await payrollApi.getPayrolls(filters);
      setPayrolls(result.data);
      setPagination({
        total: result.total,
        last_page: result.last_page,
        current_page: result.current_page,
        per_page: result.per_page,
        from: result.from || 0,
        to: result.to || 0,
      });
    } catch (error) {
      console.error("Failed to fetch payrolls:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch employees for filter
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
    fetchPayrolls();
    fetchEmployees();
  }, [filters]);

  // Calculate stats from real data
  const stats: PayrollStats = {
    total_payrolls: payrolls.length,
    total_amount: payrolls.reduce((sum, p) => sum + (p.net_salary || 0), 0),
    pending: payrolls.filter(
      (p) => p.status === "pending_approval" || p.status === "draft",
    ).length,
    processing: payrolls.filter((p) => p.status === "calculated").length,
    paid: payrolls.filter((p) => p.status === "paid" || p.status === "approved")
      .length,
    rejected: 0,
    cancelled: payrolls.filter((p) => p.status === "cancelled").length,
    this_month_total: payrolls
      .filter((p) =>
        p.payroll_month?.startsWith(new Date().toISOString().slice(0, 7)),
      )
      .reduce((sum, p) => sum + (p.net_salary || 0), 0),
    this_month_employees: payrolls.filter((p) =>
      p.payroll_month?.startsWith(new Date().toISOString().slice(0, 7)),
    ).length,
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (key: keyof PayrollFilters, value: string) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleView = (payroll: Payroll) => {
    setSelectedPayroll(payroll);
    setShowViewModal(true);
  };

  const handleAction = (
    payroll: Payroll,
    action: "approve" | "pay" | "reject" | "cancel",
  ) => {
    setSelectedPayroll(payroll);
    setActionType(action);
    if (action === "pay") {
      setPaymentData({
        payment_method: "bank_transfer",
        bank_name: payroll.bank_name || "",
        bank_account: payroll.bank_account || "",
        payment_date: new Date().toISOString().split("T")[0],
      });
    }
    setShowActionModal(true);
  };

  const confirmAction = async () => {
    if (!selectedPayroll) return;

    setLoading(true);
    try {
      switch (actionType) {
        case "approve":
          await payrollApi.approvePayroll(selectedPayroll.id);
          break;
        case "pay":
          await payrollApi.markAsPaid(selectedPayroll.id, {
            payment_method: paymentData.payment_method,
            bank_name: paymentData.bank_name,
            bank_account: paymentData.bank_account,
            payment_date: paymentData.payment_date,
          });
          break;
        case "reject":
          await payrollApi.cancelPayroll(
            selectedPayroll.id,
            "Rejected by manager",
          );
          break;
        case "cancel":
          await payrollApi.cancelPayroll(
            selectedPayroll.id,
            "Cancelled by user",
          );
          break;
      }
      setShowActionModal(false);
      setSelectedPayroll(null);
      fetchPayrolls(); // Refresh list
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (payroll: Payroll) => {
    try {
      const blob = await payrollApi.downloadPayslip(payroll.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payslip_${payroll.id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download payslip:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    const Icon = statusIcons[status] || ClockIcon;
    return <Icon className="w-3 h-3" />;
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
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  if (loading && payrolls.length === 0) {
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
            Payroll
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Manage payroll and payslips
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/payroll/generate")}
            className="inline-flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg shadow-sm bg-primary-600 hover:bg-primary-700"
          >
            <CurrencyDollarIcon className="w-5 h-5" />
            Generate Payroll
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4 lg:grid-cols-7">
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
          <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Total
          </p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {stats.total_payrolls}
          </p>
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
            <ArrowPathIcon className="w-4 h-4 text-blue-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
              Processing
            </p>
          </div>
          <p className="text-xl font-bold text-blue-600">{stats.processing}</p>
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
            <BanknotesIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 dark:text-gray-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
              Amount
            </p>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(stats.total_amount)}
          </p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
          <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
            This Month
          </p>
          <p className="text-xl font-bold text-primary-600">
            {formatCurrency(stats.this_month_total)}
          </p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
          <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Employees
          </p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {stats.this_month_employees}
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
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2 transition-colors border border-gray-300 rounded-lg dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
          >
            <FunnelIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 dark:text-gray-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Filters
            </span>
          </button>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilters({
                employee_id: "",
                month: "",
                year: "",
                status: "",
                search: "",
                page: 1,
                per_page: 10,
              });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-500 transition-colors dark:text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:text-gray-300"
          >
            <ArrowPathIcon className="w-5 h-5" />
            <span className="text-sm">Reset</span>
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 gap-4 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 sm:grid-cols-5">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                value={filters.status}
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
              <select
                value={filters.month}
                onChange={(e) => handleFilterChange("month", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
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
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Year
              </label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Years</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Per Page
              </label>
              <select
                value={filters.per_page}
                onChange={(e) => handleFilterChange("per_page", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Payroll Table */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                  Employee
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                  Month
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
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {payrolls.map((payroll) => (
                <tr
                  key={payroll.id}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {payroll.employee?.photo ? (
                        <img
                          src={getPhotoUrl(payroll.employee.photo)}
                          alt={payroll.employee.name}
                          className="flex-shrink-0 object-cover w-8 h-8 rounded-full"
                          onError={(e) => {
                            // If image fails to load, show fallback
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent) {
                              const fallback = document.createElement("div");
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
                        <p className="text-xs text-gray-500 dark:text-gray-400">
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
                    {formatCurrency(payroll.basic_salary)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-gray-100">
                    {formatCurrency(payroll.total_allowances)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-red-600">
                    {formatCurrency(payroll.total_deductions)}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-right text-primary-600">
                    {formatCurrency(payroll.net_salary)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(payroll.status)}`}
                    >
                      {getStatusIcon(payroll.status)}
                      {statusLabels[payroll.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleView(payroll)}
                        className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                        title="View"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(payroll)}
                        className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Download Payslip"
                      >
                        <DocumentArrowDownIcon className="w-4 h-4" />
                      </button>
                      {(payroll.status === "draft" ||
                        payroll.status === "calculated") && (
                        <>
                          <button
                            onClick={() => handleAction(payroll, "approve")}
                            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                            title="Approve"
                          >
                            <CheckBadgeIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAction(payroll, "reject")}
                            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="Reject"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {payroll.status === "approved" && (
                        <button
                          onClick={() => handleAction(payroll, "pay")}
                          className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Mark as Paid"
                        >
                          <CurrencyDollarIcon className="w-4 h-4" />
                        </button>
                      )}
                      {(payroll.status === "draft" ||
                        payroll.status === "calculated" ||
                        payroll.status === "pending_approval") && (
                        <button
                          onClick={() => handleAction(payroll, "cancel")}
                          className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="Cancel"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {payrolls.length === 0 && (
          <div className="py-12 text-center">
            <CurrencyDollarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              No payroll records found
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
              Showing {pagination.from} to {pagination.to} of {pagination.total}{" "}
              records
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
                className="px-3 py-1 text-sm transition-colors border border-gray-300 rounded-lg dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
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
                      : "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === pagination.last_page}
                className="px-3 py-1 text-sm transition-colors border border-gray-300 rounded-lg dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {showViewModal && selectedPayroll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-100">
                  <DocumentTextIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Payroll Details
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                    {getMonthYear(selectedPayroll.payroll_month)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 dark:text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Employee Info */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                {selectedPayroll.employee?.photo ? (
                  <img
                    src={getPhotoUrl(selectedPayroll.employee.photo)}
                    alt={selectedPayroll.employee.name}
                    className="flex-shrink-0 object-cover w-10 h-10 rounded-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      const parent = (e.target as HTMLImageElement)
                        .parentElement;
                      if (parent) {
                        const fallback = document.createElement("div");
                        fallback.className = `flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full ${getRandomColor(selectedPayroll.employee?.id || 1)}`;
                        fallback.innerHTML = `<span class="text-sm font-medium">${getInitials(selectedPayroll.employee?.name || "U")}</span>`;
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                ) : (
                  <div
                    className={`flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full ${getRandomColor(selectedPayroll.employee?.id || 1)}`}
                  >
                    <span className="text-sm font-medium">
                      {getInitials(selectedPayroll.employee?.name || "U")}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {selectedPayroll.employee?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedPayroll.employee?.employee_code}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                    Department
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {selectedPayroll.employee?.department?.name}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                    Position
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {selectedPayroll.employee?.position?.title}
                  </p>
                </div>
              </div>

              {/* Salary Breakdown */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Salary Breakdown
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">
                      Basic Salary
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(selectedPayroll.basic_salary)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-green-600">
                    <span>Total Allowances</span>
                    <span>
                      {formatCurrency(selectedPayroll.total_allowances)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 text-sm font-bold text-gray-900 border-t border-gray-100 dark:text-gray-100 dark:border-gray-700">
                    <span>Gross Salary</span>
                    <span>{formatCurrency(selectedPayroll.gross_salary)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-red-600">
                    <span>Total Deductions</span>
                    <span>
                      -{formatCurrency(selectedPayroll.total_deductions)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 text-lg font-bold border-t border-gray-200 dark:border-gray-700 text-primary-600">
                    <span>Net Salary</span>
                    <span>{formatCurrency(selectedPayroll.net_salary)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Payment Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                      Status
                    </label>
                    <p className="mt-1">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedPayroll.status)}`}
                      >
                        {getStatusIcon(selectedPayroll.status)}
                        {statusLabels[selectedPayroll.status]}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                      Payment Method
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {selectedPayroll.payment_method
                        ? selectedPayroll.payment_method
                            .replace("_", " ")
                            .toUpperCase()
                        : "N/A"}
                    </p>
                  </div>
                </div>
                {selectedPayroll.status === "paid" &&
                  selectedPayroll.payment_date && (
                    <div className="mt-2">
                      <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400 dark:text-gray-500">
                        Payment Date
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                        {new Date(
                          selectedPayroll.payment_date,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
              >
                Close
              </button>
              <button
                onClick={() => handleDownload(selectedPayroll)}
                className="flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
              >
                <DocumentArrowDownIcon className="w-4 h-4" />
                Download Payslip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && selectedPayroll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white shadow-lg dark:bg-gray-800 rounded-xl">
            <div className="p-6">
              <div
                className={`flex items-center justify-center mb-4 ${
                  actionType === "approve"
                    ? "text-green-600"
                    : actionType === "pay"
                      ? "text-blue-600"
                      : actionType === "reject"
                        ? "text-red-600"
                        : "text-gray-600 dark:text-gray-400 dark:text-gray-500"
                }`}
              >
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center ${
                    actionType === "approve"
                      ? "bg-green-100"
                      : actionType === "pay"
                        ? "bg-blue-100"
                        : actionType === "reject"
                          ? "bg-red-100"
                          : "bg-gray-100"
                  }`}
                >
                  {actionType === "approve" && (
                    <CheckBadgeIcon className="w-6 h-6" />
                  )}
                  {actionType === "pay" && (
                    <CurrencyDollarIcon className="w-6 h-6" />
                  )}
                  {actionType === "reject" && <XMarkIcon className="w-6 h-6" />}
                  {actionType === "cancel" && <XMarkIcon className="w-6 h-6" />}
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-center text-gray-900 dark:text-gray-100">
                {actionType === "approve"
                  ? "Approve Payroll"
                  : actionType === "pay"
                    ? "Process Payment"
                    : actionType === "reject"
                      ? "Reject Payroll"
                      : "Cancel Payroll"}
              </h3>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400 dark:text-gray-500">
                {actionType === "approve" &&
                  `Are you sure you want to approve ${selectedPayroll.employee?.name}'s payroll?`}
                {actionType === "pay" &&
                  `Are you sure you want to mark ${selectedPayroll.employee?.name}'s payroll as paid?`}
                {actionType === "reject" &&
                  `Are you sure you want to reject ${selectedPayroll.employee?.name}'s payroll?`}
                {actionType === "cancel" &&
                  `Are you sure you want to cancel ${selectedPayroll.employee?.name}'s payroll?`}
              </p>

              {actionType === "pay" && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Payment Method
                    </label>
                    <select
                      value={paymentData.payment_method}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          payment_method: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="cash">Cash</option>
                      <option value="check">Check</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={paymentData.bank_name}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          bank_name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Bank name"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Bank Account
                    </label>
                    <input
                      type="text"
                      value={paymentData.bank_account}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          bank_account: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Bank account number"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Payment Date
                    </label>
                    <input
                      type="date"
                      value={paymentData.payment_date}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          payment_date: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setShowActionModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  disabled={loading}
                  className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    actionType === "approve"
                      ? "bg-green-600 hover:bg-green-700"
                      : actionType === "pay"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : actionType === "reject"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-gray-600 hover:bg-gray-700"
                  }`}
                >
                  {loading
                    ? "Processing..."
                    : actionType === "approve"
                      ? "Approve"
                      : actionType === "pay"
                        ? "Pay"
                        : actionType === "reject"
                          ? "Reject"
                          : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollList;
