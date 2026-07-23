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
  EnvelopeIcon,
  PhoneIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import type { EmployeeReportData, ReportFilters } from '../../../types/report.types';

// Mock data - Replace with API calls
const mockDepartments = [
  { id: 1, name: 'Engineering' },
  { id: 2, name: 'Human Resources' },
  { id: 3, name: 'Finance' },
  { id: 4, name: 'Marketing' },
  { id: 5, name: 'Operations' },
];

const mockEmployeeData: EmployeeReportData[] = [
  {
    id: 1,
    employee_code: 'EMP001',
    name: 'John Doe',
    department: 'Engineering',
    position: 'Senior Developer',
    email: 'john.doe@company.com',
    phone: '+1234567890',
    hire_date: '2020-01-01',
    employment_status: 'active',
    gender: 'male',
    age: 34,
    tenure_years: 4.5,
  },
  {
    id: 2,
    employee_code: 'EMP002',
    name: 'Jane Smith',
    department: 'Engineering',
    position: 'Software Engineer',
    email: 'jane.smith@company.com',
    phone: '+1234567891',
    hire_date: '2020-06-15',
    employment_status: 'active',
    gender: 'female',
    age: 32,
    tenure_years: 4.2,
  },
  {
    id: 3,
    employee_code: 'EMP003',
    name: 'Robert Johnson',
    department: 'Engineering',
    position: 'DevOps Engineer',
    email: 'robert.johnson@company.com',
    phone: '+1234567892',
    hire_date: '2021-03-01',
    employment_status: 'active',
    gender: 'male',
    age: 36,
    tenure_years: 3.5,
  },
  {
    id: 4,
    employee_code: 'EMP004',
    name: 'Sarah Williams',
    department: 'Human Resources',
    position: 'HR Manager',
    email: 'sarah.williams@company.com',
    phone: '+1234567893',
    hire_date: '2019-08-15',
    employment_status: 'active',
    gender: 'female',
    age: 39,
    tenure_years: 5.2,
  },
  {
    id: 5,
    employee_code: 'EMP005',
    name: 'Michael Brown',
    department: 'Engineering',
    position: 'Junior Developer',
    email: 'michael.brown@company.com',
    phone: '+1234567894',
    hire_date: '2024-06-01',
    employment_status: 'resigned',
    gender: 'male',
    age: 29,
    tenure_years: 0.5,
  },
];

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  resigned: 'bg-yellow-100 text-yellow-800',
  terminated: 'bg-red-100 text-red-800',
};

export const EmployeeReport: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<ReportFilters>({
    date_from: '',
    date_to: '',
    department_id: '',
    employee_id: '',
    format: 'pdf',
  });
  const [data] = useState<EmployeeReportData[]>(mockEmployeeData);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Filter data
  const filteredData = data.filter((item) => {
    const matchesDepartment = !filters.department_id || item.department === mockDepartments.find(d => d.id === parseInt(filters.department_id))?.name;
    const matchesStatus = !filters.status || item.employment_status === filters.status;
    return matchesDepartment && matchesStatus;
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
    console.log(`Exporting employee report as ${format}...`);
    setShowExportMenu(false);
  };

  const stats = {
    total: filteredData.length,
    active: filteredData.filter(e => e.employment_status === 'active').length,
    resigned: filteredData.filter(e => e.employment_status === 'resigned').length,
    terminated: filteredData.filter(e => e.employment_status === 'terminated').length,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Report</h1>
          <p className="mt-1 text-sm text-gray-500">
            Generate employee reports and analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
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
                <button
                  onClick={() => handleExport('pdf')}
                  className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-gray-700 transition-colors hover:bg-gray-50"
                >
                  📄 PDF
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-gray-700 transition-colors hover:bg-gray-50"
                >
                  📊 Excel
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-gray-700 transition-colors hover:bg-gray-50"
                >
                  📋 CSV
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-4">
        <div className="p-4 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-xs text-gray-500">Total Employees</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="p-4 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <CheckBadgeIcon className="w-4 h-4 text-green-500" />
            <p className="text-xs text-gray-500">Active</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="p-4 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <XMarkIcon className="w-4 h-4 text-yellow-500" />
            <p className="text-xs text-gray-500">Resigned</p>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{stats.resigned}</p>
        </div>
        <div className="p-4 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <XMarkIcon className="w-4 h-4 text-red-500" />
            <p className="text-xs text-gray-500">Terminated</p>
          </div>
          <p className="text-2xl font-bold text-red-600">{stats.terminated}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Department</label>
            <select
              value={filters.department_id}
              onChange={(e) => handleFilterChange('department_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Departments</option>
              {mockDepartments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
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
              <option value="active">Active</option>
              <option value="resigned">Resigned</option>
              <option value="terminated">Terminated</option>
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Employee</th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Department</th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Position</th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Contact</th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Tenure</th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((employee) => (
                <tr key={employee.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                      <p className="text-xs text-gray-500">{employee.employee_code}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{employee.department}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{employee.position}</td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <EnvelopeIcon className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm text-gray-600">{employee.email}</span>
                      </div>
                      {employee.phone && (
                        <div className="flex items-center gap-1.5">
                          <PhoneIcon className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm text-gray-600">{employee.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm text-gray-900">{employee.tenure_years}y</p>
                      <p className="text-xs text-gray-500">{new Date(employee.hire_date).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[employee.employment_status] || 'bg-gray-100 text-gray-800'}`}>
                      {employee.employment_status.charAt(0).toUpperCase() + employee.employment_status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="py-12 text-center">
            <UserGroupIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900">No employees found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeReport;