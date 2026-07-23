import React, { useState } from 'react';
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
} from '@heroicons/react/24/outline';

// Mock data - Replace with API calls
const mockDepartments = [
  { id: 1, name: 'Engineering' },
  { id: 2, name: 'Human Resources' },
  { id: 3, name: 'Finance' },
];

const mockPayrollData: PayrollReportData[] = [
  {
    employee_id: 1,
    employee_name: 'John Doe',
    employee_code: 'EMP001',
    department: 'Engineering',
    position: 'Senior Developer',
    month: '2024-12',
    basic_salary: 55000,
    allowances: 21000,
    deductions: 5600,
    overtime: 1171.88,
    gross_salary: 77171.88,
    net_salary: 71571.88,
    payment_status: 'paid',
  },
  {
    employee_id: 2,
    employee_name: 'Jane Smith',
    employee_code: 'EMP002',
    department: 'Engineering',
    position: 'Software Engineer',
    month: '2024-12',
    basic_salary: 40000,
    allowances: 11500,
    deductions: 2800,
    overtime: 0,
    gross_salary: 51500,
    net_salary: 48700,
    payment_status: 'processing',
  },
  {
    employee_id: 3,
    employee_name: 'Robert Johnson',
    employee_code: 'EMP003',
    department: 'Engineering',
    position: 'DevOps Engineer',
    month: '2024-12',
    basic_salary: 48000,
    allowances: 14000,
    deductions: 3160,
    overtime: 0,
    gross_salary: 62000,
    net_salary: 58840,
    payment_status: 'paid',
  },
  {
    employee_id: 4,
    employee_name: 'Sarah Williams',
    employee_code: 'EMP004',
    department: 'Human Resources',
    position: 'HR Manager',
    month: '2024-12',
    basic_salary: 58000,
    allowances: 19000,
    deductions: 3960,
    overtime: 0,
    gross_salary: 77000,
    net_salary: 73040,
    payment_status: 'pending',
  },
  {
    employee_id: 5,
    employee_name: 'Michael Brown',
    employee_code: 'EMP005',
    department: 'Engineering',
    position: 'Junior Developer',
    month: '2024-12',
    basic_salary: 30000,
    allowances: 7500,
    deductions: 2100,
    overtime: 0,
    gross_salary: 37500,
    net_salary: 35400,
    payment_status: 'paid',
  },
];

const mockPayrollSummary: PayrollSummaryData[] = [
  {
    department: 'Engineering',
    total_employees: 4,
    total_basic: 173000,
    total_allowances: 54000,
    total_deductions: 13660,
    total_overtime: 1171.88,
    total_gross: 228171.88,
    total_net: 214511.88,
  },
  {
    department: 'Human Resources',
    total_employees: 1,
    total_basic: 58000,
    total_allowances: 19000,
    total_deductions: 3960,
    total_overtime: 0,
    total_gross: 77000,
    total_net: 73040,
  },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

export const PayrollReport: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'details' | 'summary'>('details');
  const [filters, setFilters] = useState<ReportFilters>({
    date_from: '',
    date_to: '',
    department_id: '',
    employee_id: '',
    status: '',
    format: 'pdf',
  });
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Filter data
  const filteredData = mockPayrollData.filter((item) => {
    const matchesDepartment = !filters.department_id || 
      item.department === mockDepartments.find(d => d.id === parseInt(filters.department_id))?.name;
    const matchesStatus = !filters.status || item.payment_status === filters.status;
    const matchesMonth = !filters.date_from || item.month >= filters.date_from.substring(0, 7);
    return matchesDepartment && matchesStatus && matchesMonth;
  });

  const handleFilterChange = (key: keyof ReportFilters, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleGenerateReport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exporting payroll report as ${format}...`);
    setShowExportMenu(false);
  };

  const stats = {
    total_employees: filteredData.length,
    total_gross: filteredData.reduce((sum, p) => sum + p.gross_salary, 0),
    total_net: filteredData.reduce((sum, p) => sum + p.net_salary, 0),
    total_allowances: filteredData.reduce((sum, p) => sum + p.allowances, 0),
    total_deductions: filteredData.reduce((sum, p) => sum + p.deductions, 0),
    total_overtime: filteredData.reduce((sum, p) => sum + p.overtime, 0),
    paid: filteredData.filter(p => p.payment_status === 'paid').length,
    pending: filteredData.filter(p => p.payment_status === 'pending' || p.payment_status === 'processing').length,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amount);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll Report</h1>
          <p className="mt-1 text-sm text-gray-500">
            Generate payroll reports and analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center overflow-hidden border border-gray-200 rounded-lg">
            <button
              onClick={() => setView('details')}
              className={`px-3 py-1.5 text-sm transition-colors ${
                view === 'details' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setView('summary')}
              className={`px-3 py-1.5 text-sm transition-colors ${
                view === 'summary' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
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
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <ArrowPathIcon className="w-5 h-5" />
            )}
            Generate Report
          </button>
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <DocumentArrowDownIcon className="w-5 h-5" />
              Export
            </button>
            {showExportMenu && (
              <div className="absolute right-0 z-10 w-40 py-1 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                <button onClick={() => handleExport('pdf')} className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-gray-700 transition-colors hover:bg-gray-50">📄 PDF</button>
                <button onClick={() => handleExport('excel')} className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-gray-700 transition-colors hover:bg-gray-50">📊 Excel</button>
                <button onClick={() => handleExport('csv')} className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-gray-700 transition-colors hover:bg-gray-50">📋 CSV</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4 lg:grid-cols-7">
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-xs text-gray-500">Employees</p>
          <p className="text-xl font-bold text-gray-900">{stats.total_employees}</p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-xs text-gray-500">Gross Salary</p>
          <p className="text-sm font-bold text-gray-900">{formatCurrency(stats.total_gross)}</p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-xs text-gray-500">Net Salary</p>
          <p className="text-sm font-bold text-primary-600">{formatCurrency(stats.total_net)}</p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-xs text-gray-500">Allowances</p>
          <p className="text-sm font-bold text-green-600">{formatCurrency(stats.total_allowances)}</p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-xs text-gray-500">Deductions</p>
          <p className="text-sm font-bold text-red-600">{formatCurrency(stats.total_deductions)}</p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <CheckBadgeIcon className="w-4 h-4 text-green-500" />
            <p className="text-xs text-gray-500">Paid</p>
          </div>
          <p className="text-xl font-bold text-green-600">{stats.paid}</p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <ClockIcon className="w-4 h-4 text-yellow-500" />
            <p className="text-xs text-gray-500">Pending</p>
          </div>
          <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Department</label>
            <select
              value={filters.department_id}
              onChange={(e) => handleFilterChange('department_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Departments</option>
              {mockDepartments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="paid">Paid</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Month</label>
            <input
              type="month"
              value={filters.date_from}
              onChange={(e) => handleFilterChange('date_from', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
        {view === 'details' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Employee</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Department</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Basic</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Allowances</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Deductions</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Net</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((payroll) => (
                  <tr key={payroll.employee_id} className="transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{payroll.employee_name}</p>
                        <p className="text-xs text-gray-500">{payroll.employee_code}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{payroll.department}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(payroll.basic_salary)}</td>
                    <td className="px-4 py-3 text-sm text-right text-green-600">{formatCurrency(payroll.allowances)}</td>
                    <td className="px-4 py-3 text-sm text-right text-red-600">{formatCurrency(payroll.deductions)}</td>
                    <td className="px-4 py-3 text-sm font-bold text-right text-primary-600">{formatCurrency(payroll.net_salary)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[payroll.payment_status] || 'bg-gray-100 text-gray-800'}`}>
                        {payroll.payment_status.charAt(0).toUpperCase() + payroll.payment_status.slice(1)}
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
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Department</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Employees</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Basic</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Allowances</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Deductions</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Gross</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Net</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockPayrollSummary.map((summary) => (
                  <tr key={summary.department} className="transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{summary.department}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">{summary.total_employees}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(summary.total_basic)}</td>
                    <td className="px-4 py-3 text-sm text-right text-green-600">{formatCurrency(summary.total_allowances)}</td>
                    <td className="px-4 py-3 text-sm text-right text-red-600">{formatCurrency(summary.total_deductions)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-right text-gray-900">{formatCurrency(summary.total_gross)}</td>
                    <td className="px-4 py-3 text-sm font-bold text-right text-primary-600">{formatCurrency(summary.total_net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayrollReport;

// Import ClockIcon for status
import { ClockIcon } from '@heroicons/react/24/outline';
import type { PayrollReportData, PayrollSummaryData, ReportFilters } from '../../../types/report.types';
