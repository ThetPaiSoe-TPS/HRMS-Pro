import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  UserIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  CheckBadgeIcon,
  XMarkIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { payrollApi } from "../../../api/payroll/payrollApi";
import { getStorageUrl } from "../../../api/axios";
import type { Payroll } from "../../../types/payroll.types";

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

export const PayslipView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [payroll, setPayroll] = useState<Payroll | null>(null);

  useEffect(() => {
    const fetchPayroll = async () => {
      if (!id) return;
      try {
        const result = await payrollApi.getPayroll(parseInt(id));
        setPayroll(result);
      } catch (error) {
        console.error("Failed to fetch payroll:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayroll();
  }, [id]);

  const handleDownload = async () => {
    if (!payroll) return;
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
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary-600"></div>
      </div>
    );
  }

  if (!payroll) {
    return (
      <div className="py-16 text-center">
        <CurrencyDollarIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900">Payslip not found</h3>
        <Link
          to="/admin/payroll"
          className="inline-block mt-2 text-sm text-primary-600 hover:underline"
        >
          Back to Payroll
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl p-4 mx-auto sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/payroll"
            className="p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 dark:text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Payslip
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
              {getMonthYear(payroll.payroll_month)}
            </p>
          </div>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
        >
          <DocumentArrowDownIcon className="w-5 h-5" />
          Download PDF
        </button>
      </div>

      {/* Payslip Card */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                HRMS Pro
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                Payslip for {getMonthYear(payroll.payroll_month)}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[payroll.status]}`}
            >
              {statusLabels[payroll.status]}
            </span>
          </div>
        </div>

        {/* Employee Info */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            {payroll.employee?.photo ? (
              <img
                src={getPhotoUrl(payroll.employee.photo)}
                alt={payroll.employee.name}
                className="flex-shrink-0 object-cover w-16 h-16 rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement("div");
                    fallback.className = `flex items-center justify-center flex-shrink-0 w-16 h-16 rounded-full ${getRandomColor(payroll.employee?.id || 1)}`;
                    fallback.innerHTML = `<span class="text-2xl font-bold">${getInitials(payroll.employee?.name || "U")}</span>`;
                    parent.appendChild(fallback);
                  }
                }}
              />
            ) : (
              <div
                className={`flex items-center justify-center flex-shrink-0 w-16 h-16 rounded-full ${getRandomColor(payroll.employee?.id || 1)}`}
              >
                <span className="text-2xl font-bold">
                  {getInitials(payroll.employee?.name || "U")}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {payroll.employee?.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                {payroll.employee?.employee_code}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                  <BuildingOfficeIcon className="inline w-3 h-3 mr-1" />
                  {payroll.employee?.department?.name}
                </span>
                <span className="text-xs text-gray-300">•</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                  <BriefcaseIcon className="inline w-3 h-3 mr-1" />
                  {payroll.employee?.position?.title}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Salary Breakdown */}
        <div className="p-6">
          <h4 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
            Salary Breakdown
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">
                Basic Salary
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatCurrency(payroll.basic_salary)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">
                Total Allowances
              </span>
              <span className="font-medium text-green-600">
                {formatCurrency(payroll.total_allowances)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">
                Overtime
              </span>
              <span className="font-medium text-blue-600">
                {formatCurrency(payroll.total_overtime)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">
                Bonus
              </span>
              <span className="font-medium text-purple-600">
                {formatCurrency(payroll.total_bonus)}
              </span>
            </div>
            <div className="flex justify-between py-2 text-lg font-bold border-b border-gray-200 dark:border-gray-700">
              <span>Gross Salary</span>
              <span className="text-gray-900 dark:text-gray-100">
                {formatCurrency(payroll.gross_salary)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">
                Total Deductions
              </span>
              <span className="font-medium text-red-600">
                -{formatCurrency(payroll.total_deductions)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">
                Tax
              </span>
              <span className="font-medium text-red-600">
                -{formatCurrency(payroll.tax_amount)}
              </span>
            </div>
            <div className="flex justify-between py-3 text-xl font-bold border-t-2 border-gray-300 dark:border-gray-600">
              <span className="text-gray-900 dark:text-gray-100">
                Net Salary
              </span>
              <span className="text-primary-600">
                {formatCurrency(payroll.net_salary)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        {payroll.payment_date && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Payment Date
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {new Date(payroll.payment_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Payment Method
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {payroll.payment_method
                    ? payroll.payment_method.replace("_", " ").toUpperCase()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 text-center border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
            This is a system-generated payslip. For any discrepancies, please
            contact HR.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PayslipView;
