import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  UserGroupIcon,
  CheckBadgeIcon,
  XMarkIcon,
  ClockIcon,
  BuildingOfficeIcon,
  UsersIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import type { AttendanceReportFilters, AttendanceSummary, EmployeeAttendanceSummary } from '../../../types/attendance.types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Mock data - Replace with API calls
const mockDepartments = [
  { id: 1, name: 'Engineering' },
  { id: 2, name: 'Human Resources' },
  { id: 3, name: 'Finance' },
  { id: 4, name: 'Marketing' },
  { id: 5, name: 'Operations' },
];

const mockEmployees = [
  { id: 1, name: 'John Doe', employee_code: 'EMP001', department: 'Engineering' },
  { id: 2, name: 'Jane Smith', employee_code: 'EMP002', department: 'Engineering' },
  { id: 3, name: 'Robert Johnson', employee_code: 'EMP003', department: 'Engineering' },
  { id: 4, name: 'Sarah Williams', employee_code: 'EMP004', department: 'Human Resources' },
  { id: 5, name: 'Michael Brown', employee_code: 'EMP005', department: 'Engineering' },
];

// Mock summary data
const mockDailySummary: AttendanceSummary[] = [
  { date: '2024-12-01', total_employees: 5, present: 4, absent: 1, late: 0, half_day: 0, on_leave: 0, present_percentage: 80 },
  { date: '2024-12-02', total_employees: 5, present: 3, absent: 0, late: 1, half_day: 1, on_leave: 0, present_percentage: 60 },
  { date: '2024-12-03', total_employees: 5, present: 5, absent: 0, late: 0, half_day: 0, on_leave: 0, present_percentage: 100 },
  { date: '2024-12-04', total_employees: 5, present: 4, absent: 1, late: 0, half_day: 0, on_leave: 0, present_percentage: 80 },
  { date: '2024-12-05', total_employees: 5, present: 3, absent: 0, late: 0, half_day: 1, on_leave: 1, present_percentage: 60 },
  { date: '2024-12-06', total_employees: 5, present: 2, absent: 1, late: 1, half_day: 0, on_leave: 1, present_percentage: 40 },
  { date: '2024-12-07', total_employees: 5, present: 0, absent: 0, late: 0, half_day: 0, on_leave: 0, present_percentage: 0 },
];

const mockEmployeeSummary: EmployeeAttendanceSummary[] = [
  { employee_id: 1, employee_name: 'John Doe', employee_code: 'EMP001', department: 'Engineering', total_days: 22, present: 18, absent: 2, late: 1, half_day: 1, on_leave: 0, attendance_rate: 95.5 },
  { employee_id: 2, employee_name: 'Jane Smith', employee_code: 'EMP002', department: 'Engineering', total_days: 22, present: 20, absent: 0, late: 2, half_day: 0, on_leave: 0, attendance_rate: 100 },
  { employee_id: 3, employee_name: 'Robert Johnson', employee_code: 'EMP003', department: 'Engineering', total_days: 22, present: 15, absent: 1, late: 0, half_day: 2, on_leave: 4, attendance_rate: 77.3 },
  { employee_id: 4, employee_name: 'Sarah Williams', employee_code: 'EMP004', department: 'Human Resources', total_days: 22, present: 19, absent: 1, late: 0, half_day: 1, on_leave: 1, attendance_rate: 90.9 },
  { employee_id: 5, employee_name: 'Michael Brown', employee_code: 'EMP005', department: 'Engineering', total_days: 22, present: 17, absent: 0, late: 1, half_day: 3, on_leave: 1, attendance_rate: 86.4 },
];

const statusColors = {
  present: '#10b981',
  absent: '#ef4444',
  late: '#f59e0b',
  half_day: '#3b82f6',
  on_leave: '#8b5cf6',
};

export const AttendanceReport: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<AttendanceReportFilters>({
    date_from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    date_to: new Date().toISOString().split('T')[0],
    department_id: '',
    employee_id: '',
    status: '',
  });
  const [summaryData, setSummaryData] = useState<AttendanceSummary[]>(mockDailySummary);
  const [employeeSummary, setEmployeeSummary] = useState<EmployeeAttendanceSummary[]>(mockEmployeeSummary);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Chart Data - Daily Trends
  const dailyTrendData = {
    labels: summaryData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Present',
        data: summaryData.map(d => d.present),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: '#10b981',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Absent',
        data: summaryData.map(d => d.absent),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: '#ef4444',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Late',
        data: summaryData.map(d => d.late),
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
        borderColor: '#f59e0b',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Chart Data - Status Distribution
  const statusDistributionData = {
    labels: ['Present', 'Absent', 'Late', 'Half Day', 'On Leave'],
    datasets: [
      {
        data: [
          summaryData.reduce((sum, d) => sum + d.present, 0),
          summaryData.reduce((sum, d) => sum + d.absent, 0),
          summaryData.reduce((sum, d) => sum + d.late, 0),
          summaryData.reduce((sum, d) => sum + d.half_day, 0),
          summaryData.reduce((sum, d) => sum + d.on_leave, 0),
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          '#10b981',
          '#ef4444',
          '#f59e0b',
          '#3b82f6',
          '#8b5cf6',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Chart Data - Attendance Rate by Department
  const departmentRateData = {
    labels: mockDepartments.map(d => d.name),
    datasets: [
      {
        label: 'Attendance Rate (%)',
        data: mockDepartments.map(dept => {
          const deptEmployees = employeeSummary.filter(e => e.department === dept.name);
          const avgRate = deptEmployees.length > 0 
            ? deptEmployees.reduce((sum, e) => sum + e.attendance_rate, 0) / deptEmployees.length
            : 0;
          return Math.round(avgRate);
        }),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: '#3b82f6',
        borderWidth: 2,
      },
    ],
  };

  // Handlers
  const handleFilterChange = (key: keyof AttendanceReportFilters, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleGenerateReport = () => {
    setLoading(true);
    // TODO: API call to generate report with filters
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    // TODO: API call to export report
    console.log(`Exporting as ${format}...`);
    setShowExportMenu(false);
  };

  const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || '#6b7280';
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Report</h1>
          <p className="mt-1 text-sm text-gray-500">
            Analyze attendance patterns and generate reports
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
                  <DocumentTextIcon className="w-4 h-4" />
                  PDF
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <ChartBarIcon className="w-4 h-4" />
                  Excel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
            <label className="block mb-1 text-sm font-medium text-gray-700">Employee</label>
            <select
              value={filters.employee_id}
              onChange={(e) => handleFilterChange('employee_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Employees</option>
              {mockEmployees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.employee_code} - {emp.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="half_day">Half Day</option>
              <option value="leave">On Leave</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4 lg:grid-cols-7">
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-xs text-gray-500">Total Days</p>
          <p className="text-xl font-bold text-gray-900">{summaryData.length}</p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <CheckBadgeIcon className="w-4 h-4 text-green-500" />
            <p className="text-xs text-gray-500">Present</p>
          </div>
          <p className="text-xl font-bold text-green-600">
            {summaryData.reduce((sum, d) => sum + d.present, 0)}
          </p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <XMarkIcon className="w-4 h-4 text-red-500" />
            <p className="text-xs text-gray-500">Absent</p>
          </div>
          <p className="text-xl font-bold text-red-600">
            {summaryData.reduce((sum, d) => sum + d.absent, 0)}
          </p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <ClockIcon className="w-4 h-4 text-yellow-500" />
            <p className="text-xs text-gray-500">Late</p>
          </div>
          <p className="text-xl font-bold text-yellow-600">
            {summaryData.reduce((sum, d) => sum + d.late, 0)}
          </p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <ClockIcon className="w-4 h-4 text-blue-500" />
            <p className="text-xs text-gray-500">Half Day</p>
          </div>
          <p className="text-xl font-bold text-blue-600">
            {summaryData.reduce((sum, d) => sum + d.half_day, 0)}
          </p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <CalendarIcon className="w-4 h-4 text-purple-500" />
            <p className="text-xs text-gray-500">On Leave</p>
          </div>
          <p className="text-xl font-bold text-purple-600">
            {summaryData.reduce((sum, d) => sum + d.on_leave, 0)}
          </p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-xs text-gray-500">Avg Attendance</p>
          <p className="text-xl font-bold text-primary-600">
            {Math.round(summaryData.reduce((sum, d) => sum + d.present_percentage, 0) / summaryData.length)}%
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
        {/* Daily Trends */}
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Daily Attendance Trends</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-xs text-gray-500">Present</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="text-xs text-gray-500">Absent</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <span className="text-xs text-gray-500">Late</span>
              </div>
            </div>
          </div>
          <div className="h-[250px]">
            <Line
              data={dailyTrendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Status Distribution */}
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Attendance Status Distribution</h3>
          <div className="h-[250px] flex items-center justify-center">
            <Doughnut
              data={statusDistributionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Department Attendance Rate */}
      <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">Attendance Rate by Department</h3>
        <div className="h-[200px]">
          <Bar
            data={departmentRateData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  ticks: {
                    callback: function(value) {
                      return value + '%';
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Employee Summary Table */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Employee Attendance Summary</h3>
          <span className="text-xs text-gray-500">{employeeSummary.length} employees</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Present
                </th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Absent
                </th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Late
                </th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Half Day
                </th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leave
                </th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employeeSummary.map((emp) => (
                <tr key={emp.employee_id} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100">
                        <span className="text-xs font-medium text-primary-700">
                          {emp.employee_name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{emp.employee_name}</p>
                        <p className="text-xs text-gray-500">{emp.employee_code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">{emp.department}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium text-green-600">{emp.present}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium text-red-600">{emp.absent}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium text-yellow-600">{emp.late}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium text-blue-600">{emp.half_day}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium text-purple-600">{emp.on_leave}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary-600"
                          style={{ width: `${emp.attendance_rate}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {emp.attendance_rate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;