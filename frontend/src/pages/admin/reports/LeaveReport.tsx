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
  ClockIcon,
} from '@heroicons/react/24/outline';
import type { LeaveReportData, LeaveSummaryData, ReportFilters } from '../../../types/report.types';

// Mock data - Replace with API calls
const mockDepartments = [
  { id: 1, name: 'Engineering' },
  { id: 2, name: 'Human Resources' },
  { id: 3, name: 'Finance' },
];

const mockLeaveData: LeaveReportData[] = [
  {
    employee_id: 1,
    employee_name: 'John Doe',
    employee_code: 'EMP001',
    department: 'Engineering',
    leave_type: 'Annual Leave',
    start_date: '2024-12-23',
    end_date: '2024-12-24',
    days: 2,
    status: 'approved',
    reason: 'Year-end vacation',
  },
  {
    employee_id: 2,
    employee_name: 'Jane Smith',
    employee_code: 'EMP002',
    department: 'Engineering',
    leave_type: 'Sick Leave',
    start_date: '2024-12-15',
    end_date: '2024-12-16',
    days: 2,
    status: 'pending',
    reason: 'Medical appointment',
  },
  {
    employee_id: 3,
    employee_name: 'Robert Johnson',
    employee_code: 'EMP003',
    department: 'Engineering',
    leave_type: 'Annual Leave',
    start_date: '2024-12-10',
    end_date: '2024-12-12',
    days: 3,
    status: 'approved',
    reason: 'Personal travel',
  },
  {
    employee_id: 4,
    employee_name: 'Sarah Williams',
    employee_code: 'EMP004',
    department: 'Human Resources',
    leave_type: 'Sick Leave',
    start_date: '2024-12-05',
    end_date: '2024-12-05',
    days: 1,
    status: 'rejected',
    reason: 'Sick day',
  },
  {
    employee_id: 5,
    employee_name: 'Michael Brown',
    employee_code: 'EMP005',
    department: 'Engineering',
    leave_type: 'Personal Leave',
    start_date: '2024-12-18',
    end_date: '2024-12-19',
    days: 2,
    status: 'pending',
    reason: 'Personal emergency',
  },
];

const mockLeaveSummary: LeaveSummaryData[] = [
  {
    employee_id: 1,
    employee_name: 'John Doe',
    employee_code: 'EMP001',
    department: 'Engineering',
    annual_used: 12,
    annual_balance: 8,
    sick_used: 2,
    sick_balance: 8,
    personal_used: 1,
    personal_balance: 4,
    total_used: 15,
    total_balance: 20,
  },
  {
    employee_id: 2,
    employee_name: 'Jane Smith',
    employee_code: 'EMP002',
    department: 'Engineering',
    annual_used: 8,
    annual_balance: 12,
    sick_used: 3,
    sick_balance: 7,
    personal_used: 0,
    personal_balance: 5,
    total_used: 11,
    total_balance: 24,
  },
  {
    employee_id: 3,
    employee_name: 'Robert Johnson',
    employee_code: 'EMP003',
    department: 'Engineering',
    annual_used: 15,
    annual_balance: 5,
    sick_used: 1,
    sick_balance: 9,
    personal_used: 2,
    personal_balance: 3,
    total_used: 18,
    total_balance: 17,
  },
];

const statusColors: Record<string, string> = {
  approved: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  rejected: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

export const LeaveReport: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'requests' | 'summary'>('requests');
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
  const filteredData = mockLeaveData.filter((item) => {
    const matchesDepartment = !filters.department_id || 
      item.department === mockDepartments.find(d => d.id === parseInt(filters.department_id))?.name;
    const matchesStatus = !filters.status || item.status === filters.status;
    const matchesDate = (!filters.date_from || item.start_date >= filters.date_from) &&
      (!filters.date_to || item.end_date <= filters.date_to);
    return matchesDepartment && matchesStatus && matchesDate;
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
    console.log(`Exporting leave report as ${format}...`);
    setShowExportMenu(false);
  };

  const stats = {
    total: filteredData.length,
    approved: filteredData.filter(l => l.status === 'approved').length,
    pending: filteredData.filter(l => l.status === 'pending').length,
    rejected: filteredData.filter(l => l.status === 'rejected').length,
    total_days: filteredData.reduce((sum, l) => sum + l.days, 0),
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Report</h1>
          <p className="mt-1 text-sm text-gray-500">
            Generate leave reports and analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center overflow-hidden border border-gray-200 rounded-lg">
            <button
              onClick={() => setView('requests')}
              className={`px-3 py-1.5 text-sm transition-colors ${
                view === 'requests' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Requests
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
      <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-5">
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-xs text-gray-500">Total Requests</p>
          <p className="text-xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <CheckBadgeIcon className="w-4 h-4 text-green-500" />
            <p className="text-xs text-gray-500">Approved</p>
          </div>
          <p className="text-xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <ClockIcon className="w-4 h-4 text-yellow-500" />
            <p className="text-xs text-gray-500">Pending</p>
          </div>
          <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <XMarkIcon className="w-4 h-4 text-red-500" />
            <p className="text-xs text-gray-500">Rejected</p>
          </div>
          <p className="text-xl font-bold text-red-600">{stats.rejected}</p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-xs text-gray-500">Total Days</p>
          <p className="text-xl font-bold text-primary-600">{stats.total_days}</p>
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
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Date From</label>
            <input
              type="date"
              value={filters.date_from}
              onChange={(e) => handleFilterChange('date_from', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Date To</label>
            <input
              type="date"
              value={filters.date_to}
              onChange={(e) => handleFilterChange('date_to', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
        {view === 'requests' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Employee</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Dates</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Days</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((leave, index) => (
                  <tr key={index} className="transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{leave.employee_name}</p>
                        <p className="text-xs text-gray-500">{leave.employee_code}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{leave.leave_type}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{new Date(leave.start_date).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">to {new Date(leave.end_date).toLocaleDateString()}</div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{leave.days}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[leave.status] || 'bg-gray-100 text-gray-800'}`}>
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </span>
                    </td>
                    <td className="max-w-xs px-4 py-3 text-sm text-gray-500 truncate">{leave.reason}</td>
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
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Employee</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Department</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">Annual</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">Sick</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">Personal</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Total Used</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockLeaveSummary.map((summary) => (
                  <tr key={summary.employee_id} className="transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{summary.employee_name}</p>
                        <p className="text-xs text-gray-500">{summary.employee_code}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{summary.department}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm text-gray-900">{summary.annual_used}</span>
                      <span className="ml-1 text-xs text-gray-400">/ {summary.annual_used + summary.annual_balance}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm text-gray-900">{summary.sick_used}</span>
                      <span className="ml-1 text-xs text-gray-400">/ {summary.sick_used + summary.sick_balance}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm text-gray-900">{summary.personal_used}</span>
                      <span className="ml-1 text-xs text-gray-400">/ {summary.personal_used + summary.personal_balance}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-medium text-gray-900">{summary.total_used}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-medium text-primary-600">{summary.total_balance}</span>
                    </td>
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

export default LeaveReport;