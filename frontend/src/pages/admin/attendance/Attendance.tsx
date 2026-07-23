import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  CheckBadgeIcon,
  XMarkIcon,
  CalendarIcon,
  UserGroupIcon,
  ArrowPathIcon,
  EyeIcon,
  PencilSquareIcon,
  UserIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import type { Attendance, AttendanceFilters, AttendanceStats } from '../../../types/attendance.types';

// Mock data - Replace with API calls
const mockEmployees = [
  { id: 1, name: 'John Doe', employee_code: 'EMP001' },
  { id: 2, name: 'Jane Smith', employee_code: 'EMP002' },
  { id: 3, name: 'Robert Johnson', employee_code: 'EMP003' },
  { id: 4, name: 'Sarah Williams', employee_code: 'EMP004' },
  { id: 5, name: 'Michael Brown', employee_code: 'EMP005' },
];

const mockAttendance: Attendance[] = [
  {
    id: 1,
    employee_id: 1,
    employee: {
      id: 1,
      name: 'John Doe',
      employee_code: 'EMP001',
      department: { id: 1, name: 'Engineering' },
      position: { id: 1, title: 'Senior Developer' },
    },
    date: '2024-12-01',
    check_in: '09:00:00',
    check_out: '18:00:00',
    status: 'present',
    work_hours: 8,
    overtime_hours: 0,
    notes: null,
    created_at: '2024-12-01T09:00:00.000000Z',
    updated_at: '2024-12-01T18:00:00.000000Z',
  },
  {
    id: 2,
    employee_id: 1,
    employee: {
      id: 1,
      name: 'John Doe',
      employee_code: 'EMP001',
      department: { id: 1, name: 'Engineering' },
      position: { id: 1, title: 'Senior Developer' },
    },
    date: '2024-12-02',
    check_in: '09:15:00',
    check_out: '18:30:00',
    status: 'present',
    work_hours: 8,
    overtime_hours: 0.5,
    notes: 'Traffic delay',
    created_at: '2024-12-02T09:15:00.000000Z',
    updated_at: '2024-12-02T18:30:00.000000Z',
  },
  {
    id: 3,
    employee_id: 2,
    employee: {
      id: 2,
      name: 'Jane Smith',
      employee_code: 'EMP002',
      department: { id: 1, name: 'Engineering' },
      position: { id: 2, title: 'Software Engineer' },
    },
    date: '2024-12-01',
    check_in: null,
    check_out: null,
    status: 'absent',
    work_hours: 0,
    overtime_hours: 0,
    notes: 'Sick leave',
    created_at: '2024-12-01T00:00:00.000000Z',
    updated_at: '2024-12-01T00:00:00.000000Z',
  },
  {
    id: 4,
    employee_id: 3,
    employee: {
      id: 3,
      name: 'Robert Johnson',
      employee_code: 'EMP003',
      department: { id: 1, name: 'Engineering' },
      position: { id: 4, title: 'DevOps Engineer' },
    },
    date: '2024-12-01',
    check_in: '10:00:00',
    check_out: '19:00:00',
    status: 'late',
    work_hours: 8,
    overtime_hours: 1,
    notes: 'Doctor appointment',
    created_at: '2024-12-01T10:00:00.000000Z',
    updated_at: '2024-12-01T19:00:00.000000Z',
  },
  {
    id: 5,
    employee_id: 4,
    employee: {
      id: 4,
      name: 'Sarah Williams',
      employee_code: 'EMP004',
      department: { id: 2, name: 'Human Resources' },
      position: { id: 5, title: 'HR Manager' },
    },
    date: '2024-12-01',
    check_in: '09:00:00',
    check_out: '13:00:00',
    status: 'half_day',
    work_hours: 4,
    overtime_hours: 0,
    notes: 'Half day - personal errand',
    created_at: '2024-12-01T09:00:00.000000Z',
    updated_at: '2024-12-01T13:00:00.000000Z',
  },
];

// Status badge colors
const statusColors: Record<string, string> = {
  present: 'bg-green-100 text-green-800',
  absent: 'bg-red-100 text-red-800',
  late: 'bg-yellow-100 text-yellow-800',
  half_day: 'bg-blue-100 text-blue-800',
  leave: 'bg-purple-100 text-purple-800',
};

const statusIcons: Record<string, any> = {
  present: CheckBadgeIcon,
  absent: XMarkIcon,
  late: ClockIcon,
  half_day: ClockIcon,
  leave: CalendarIcon,
};

const statusLabels: Record<string, string> = {
  present: 'Present',
  absent: 'Absent',
  late: 'Late',
  half_day: 'Half Day',
  leave: 'On Leave',
};

export const AttendancePage: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [attendance, setAttendance] = useState<Attendance[]>(mockAttendance);
  const [employees] = useState(mockEmployees);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<AttendanceFilters>({
    employee_id: '',
    date_from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    date_to: new Date().toISOString().split('T')[0],
    status: '',
    page: 1,
    per_page: 10,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // Calculate stats
  const stats: AttendanceStats = {
    total_employees: 5,
    present: attendance.filter(a => a.status === 'present' && a.date === new Date().toISOString().split('T')[0]).length,
    absent: attendance.filter(a => a.status === 'absent' && a.date === new Date().toISOString().split('T')[0]).length,
    late: attendance.filter(a => a.status === 'late' && a.date === new Date().toISOString().split('T')[0]).length,
    half_day: attendance.filter(a => a.status === 'half_day' && a.date === new Date().toISOString().split('T')[0]).length,
    on_leave: attendance.filter(a => a.status === 'leave' && a.date === new Date().toISOString().split('T')[0]).length,
    present_percentage: 0,
  };
  stats.present_percentage = stats.total_employees > 0 
    ? Math.round((stats.present / stats.total_employees) * 100) 
    : 0;

  // Filter attendance
  const filteredAttendance = attendance.filter((record) => {
    const employeeName = record.employee?.name?.toLowerCase() || '';
    const matchesSearch = employeeName.includes(searchTerm.toLowerCase()) ||
      (record.employee?.employee_code?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesEmployee = !filters.employee_id || record.employee_id === parseInt(filters.employee_id);
    const matchesStatus = !filters.status || record.status === filters.status;
    
    // Date filter
    let matchesDate = true;
    if (filters.date_from) {
      matchesDate = matchesDate && record.date >= filters.date_from;
    }
    if (filters.date_to) {
      matchesDate = matchesDate && record.date <= filters.date_to;
    }
    
    return matchesSearch && matchesEmployee && matchesStatus && matchesDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAttendance.length / filters.per_page);
  const paginatedAttendance = filteredAttendance.slice(
    (filters.page - 1) * filters.per_page,
    filters.page * filters.per_page
  );

  // Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setFilters({ ...filters, page: 1 });
  };

  const handleFilterChange = (key: keyof AttendanceFilters, value: string) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleView = (record: Attendance) => {
    setSelectedAttendance(record);
    setShowViewModal(true);
  };

  const handleEdit = (record: Attendance) => {
    navigate(`/admin/attendance/${record.id}/edit`);
  };

  const getStatusBadge = (status: string) => {
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const Icon = statusIcons[status] || ClockIcon;
    return <Icon className="w-3 h-3" />;
  };

  const formatTime = (time: string | null) => {
    if (!time) return '--:--';
    return time.substring(0, 5);
  };

  const navigateToCheckIn = () => {
    navigate('/admin/attendance/check');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage employee attendance
          </p>
        </div>
        <button
          onClick={navigateToCheckIn}
          className="inline-flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg shadow-sm bg-primary-600 hover:bg-primary-700"
        >
          <ClockIcon className="w-5 h-5" />
          Check In / Check Out
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-3 lg:grid-cols-6">
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-xl font-bold text-gray-900">{stats.total_employees}</p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <CheckBadgeIcon className="w-4 h-4 text-green-500" />
            <p className="text-xs text-gray-500">Present</p>
          </div>
          <p className="text-xl font-bold text-green-600">{stats.present}</p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <XMarkIcon className="w-4 h-4 text-red-500" />
            <p className="text-xs text-gray-500">Absent</p>
          </div>
          <p className="text-xl font-bold text-red-600">{stats.absent}</p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <ClockIcon className="w-4 h-4 text-yellow-500" />
            <p className="text-xs text-gray-500">Late</p>
          </div>
          <p className="text-xl font-bold text-yellow-600">{stats.late}</p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <ClockIcon className="w-4 h-4 text-blue-500" />
            <p className="text-xs text-gray-500">Half Day</p>
          </div>
          <p className="text-xl font-bold text-blue-600">{stats.half_day}</p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <CalendarIcon className="w-4 h-4 text-purple-500" />
            <p className="text-xs text-gray-500">On Leave</p>
          </div>
          <p className="text-xl font-bold text-purple-600">{stats.on_leave}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search by employee name or code..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FunnelIcon className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-700">Filters</span>
          </button>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilters({
                employee_id: '',
                date_from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
                date_to: new Date().toISOString().split('T')[0],
                status: '',
                page: 1,
                per_page: 10,
              });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-500 transition-colors hover:text-gray-700"
          >
            <ArrowPathIcon className="w-5 h-5" />
            <span className="text-sm">Reset</span>
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 gap-4 pt-4 mt-4 border-t border-gray-200 sm:grid-cols-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Employee</label>
              <select
                value={filters.employee_id}
                onChange={(e) => handleFilterChange('employee_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
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
        )}
      </div>

      {/* Attendance Table */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Employee
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Check In
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Check Out
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Hours
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedAttendance.map((record) => (
                <tr key={record.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full bg-primary-100">
                        <span className="text-xs font-medium text-primary-700">
                          {record.employee?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{record.employee?.name}</p>
                        <p className="text-xs text-gray-500">{record.employee?.employee_code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-sm text-gray-900">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      {new Date(record.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-900">
                      {formatTime(record.check_in)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-900">
                      {formatTime(record.check_out)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(record.status)}`}>
                      {getStatusIcon(record.status)}
                      {statusLabels[record.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <div className="text-sm text-gray-900">
                        {record.work_hours !== null ? `${record.work_hours}h` : '--'}
                      </div>
                      {record.overtime_hours && record.overtime_hours > 0 && (
                        <div className="text-xs text-blue-600">
                          +{record.overtime_hours}h overtime
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleView(record)}
                        className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                        title="View"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(record)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {paginatedAttendance.length === 0 && (
          <div className="py-12 text-center">
            <ClockIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900">No attendance records found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Showing {paginatedAttendance.length > 0 ? (filters.page - 1) * filters.per_page + 1 : 0} to{' '}
              {Math.min(filters.page * filters.per_page, filteredAttendance.length)} of {filteredAttendance.length} records
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
                className="px-3 py-1 text-sm transition-colors border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    page === filters.page
                      ? 'bg-primary-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === totalPages}
                className="px-3 py-1 text-sm transition-colors border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ==========================================
          VIEW ATTENDANCE MODAL
          ========================================== */}
      {showViewModal && selectedAttendance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-100">
                  <ClockIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Attendance Details</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedAttendance.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Employee Info */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100">
                  <UserIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{selectedAttendance.employee?.name}</p>
                  <p className="text-xs text-gray-500">{selectedAttendance.employee?.employee_code}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Department</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedAttendance.employee?.department?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Position</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedAttendance.employee?.position?.title || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Check In</label>
                  <p className="mt-1 text-sm font-medium text-gray-900">{formatTime(selectedAttendance.check_in)}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Check Out</label>
                  <p className="mt-1 text-sm font-medium text-gray-900">{formatTime(selectedAttendance.check_out)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Status</label>
                  <p className="mt-1">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedAttendance.status)}`}>
                      {getStatusIcon(selectedAttendance.status)}
                      {statusLabels[selectedAttendance.status]}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Work Hours</label>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {selectedAttendance.work_hours !== null ? `${selectedAttendance.work_hours}h` : '--'}
                    {selectedAttendance.overtime_hours && selectedAttendance.overtime_hours > 0 && (
                      <span className="ml-1 text-blue-600">(+{selectedAttendance.overtime_hours}h OT)</span>
                    )}
                  </p>
                </div>
              </div>

              {selectedAttendance.notes && (
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Notes</label>
                  <p className="p-2 mt-1 text-sm text-gray-900 rounded-lg bg-gray-50">{selectedAttendance.notes}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEdit(selectedAttendance);
                }}
                className="px-4 py-2 text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
              >
                Edit Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;