import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckBadgeIcon,
  XMarkIcon,
  EyeIcon,
  PencilSquareIcon,
  CalendarIcon,
  UserGroupIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  PaperClipIcon,
  UserIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import type { LeaveFilters, LeaveRequest, LeaveType } from '../../../types/leave.types';

// Mock data - Replace with API calls
const mockLeaveTypes: LeaveType[] = [
  { id: 1, name: 'Annual Leave', code: 'ANNUAL', days_per_year: 20, is_paid: true, requires_approval: true, max_consecutive_days: 15, carry_forward: true, carry_forward_limit: 5, status: 'active', created_at: '', updated_at: '' },
  { id: 2, name: 'Sick Leave', code: 'SICK', days_per_year: 10, is_paid: true, requires_approval: true, max_consecutive_days: 5, carry_forward: false, carry_forward_limit: null, status: 'active', created_at: '', updated_at: '' },
  { id: 3, name: 'Personal Leave', code: 'PERSONAL', days_per_year: 5, is_paid: true, requires_approval: true, max_consecutive_days: 3, carry_forward: false, carry_forward_limit: null, status: 'active', created_at: '', updated_at: '' },
];

const mockLeaveRequests: LeaveRequest[] = [
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
    leave_type_id: 1,
    leave_type: mockLeaveTypes[0],
    start_date: '2024-12-23',
    end_date: '2024-12-24',
    days: 2,
    reason: 'Year-end vacation with family',
    status: 'pending',
    attachment: 'leave_attachment_1.pdf',
    attachment_name: 'vacation_plan.pdf',
    created_at: '2024-12-20T10:00:00.000000Z',
    updated_at: '2024-12-20T10:00:00.000000Z',
  },
  {
    id: 2,
    employee_id: 2,
    employee: {
      id: 2,
      name: 'Jane Smith',
      employee_code: 'EMP002',
      department: { id: 1, name: 'Engineering' },
      position: { id: 2, title: 'Software Engineer' },
    },
    leave_type_id: 2,
    leave_type: mockLeaveTypes[1],
    start_date: '2024-12-15',
    end_date: '2024-12-16',
    days: 2,
    reason: 'Medical appointment and recovery',
    status: 'pending',
    attachment: null,
    attachment_name: null,
    created_at: '2024-12-14T09:30:00.000000Z',
    updated_at: '2024-12-14T09:30:00.000000Z',
  },
  {
    id: 3,
    employee_id: 3,
    employee: {
      id: 3,
      name: 'Robert Johnson',
      employee_code: 'EMP003',
      department: { id: 1, name: 'Engineering' },
      position: { id: 4, title: 'DevOps Engineer' },
    },
    leave_type_id: 1,
    leave_type: mockLeaveTypes[0],
    start_date: '2024-12-10',
    end_date: '2024-12-12',
    days: 3,
    reason: 'Personal travel',
    status: 'approved',
    approved_by: 5,
    approver: { id: 5, name: 'Sarah Williams' },
    approved_at: '2024-12-11T14:00:00.000000Z',
    created_at: '2024-12-09T08:00:00.000000Z',
    updated_at: '2024-12-11T14:00:00.000000Z',
  },
  {
    id: 4,
    employee_id: 4,
    employee: {
      id: 4,
      name: 'Sarah Williams',
      employee_code: 'EMP004',
      department: { id: 2, name: 'Human Resources' },
      position: { id: 5, title: 'HR Manager' },
    },
    leave_type_id: 2,
    leave_type: mockLeaveTypes[1],
    start_date: '2024-12-05',
    end_date: '2024-12-05',
    days: 1,
    reason: 'Sick day',
    status: 'rejected',
    rejected_by: 1,
    rejected_at: '2024-12-06T09:00:00.000000Z',
    rejection_reason: 'Insufficient sick leave balance',
    created_at: '2024-12-04T11:00:00.000000Z',
    updated_at: '2024-12-06T09:00:00.000000Z',
  },
  {
    id: 5,
    employee_id: 5,
    employee: {
      id: 5,
      name: 'Michael Brown',
      employee_code: 'EMP005',
      department: { id: 1, name: 'Engineering' },
      position: { id: 3, title: 'Junior Developer' },
    },
    leave_type_id: 3,
    leave_type: mockLeaveTypes[2],
    start_date: '2024-12-18',
    end_date: '2024-12-19',
    days: 2,
    reason: 'Personal emergency',
    status: 'pending',
    attachment: 'emergency_note.pdf',
    attachment_name: 'emergency_note.pdf',
    created_at: '2024-12-17T16:00:00.000000Z',
    updated_at: '2024-12-17T16:00:00.000000Z',
  },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

const statusIcons: Record<string, any> = {
  pending: ExclamationTriangleIcon,
  approved: CheckCircleIcon,
  rejected: XCircleIcon,
  cancelled: XMarkIcon,
};

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
};

export const LeaveRequests: React.FC = () => {
  const navigate = useNavigate();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<LeaveFilters>({
    employee_id: '',
    leave_type_id: '',
    status: '',
    date_from: '',
    date_to: '',
    page: 1,
    per_page: 10,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [rejectionReason, setRejectionReason] = useState('');

  // Filter leave requests
  const filteredRequests = leaveRequests.filter((req) => {
    const employeeName = req.employee?.name?.toLowerCase() || '';
    const matchesSearch = employeeName.includes(searchTerm.toLowerCase()) ||
      (req.employee?.employee_code?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesEmployee = !filters.employee_id || req.employee_id === parseInt(filters.employee_id);
    const matchesLeaveType = !filters.leave_type_id || req.leave_type_id === parseInt(filters.leave_type_id);
    const matchesStatus = !filters.status || req.status === filters.status;
    
    let matchesDate = true;
    if (filters.date_from) {
      matchesDate = matchesDate && req.start_date >= filters.date_from;
    }
    if (filters.date_to) {
      matchesDate = matchesDate && req.end_date <= filters.date_to;
    }
    
    return matchesSearch && matchesEmployee && matchesLeaveType && matchesStatus && matchesDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / filters.per_page);
  const paginatedRequests = filteredRequests.slice(
    (filters.page - 1) * filters.per_page,
    filters.page * filters.per_page
  );

  // Pending count for badge
  const pendingCount = leaveRequests.filter(r => r.status === 'pending').length;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setFilters({ ...filters, page: 1 });
  };

  const handleFilterChange = (key: keyof LeaveFilters, value: string) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleView = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setShowViewModal(true);
  };

  const handleApproval = (request: LeaveRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setApprovalAction(action);
    setRejectionReason('');
    setShowApprovalModal(true);
  };

  const confirmApproval = async () => {
    if (!selectedRequest) return;
    
    setLoading(true);
    try {
      // TODO: API call to approve/reject leave
      const updatedRequests = leaveRequests.map(req => {
        if (req.id === selectedRequest.id) {
          return {
            ...req,
            status: approvalAction === 'approve' ? 'approved' : 'rejected',
            approved_by: approvalAction === 'approve' ? 1 : undefined,
            approved_at: approvalAction === 'approve' ? new Date().toISOString() : undefined,
            rejected_by: approvalAction === 'reject' ? 1 : undefined,
            rejected_at: approvalAction === 'reject' ? new Date().toISOString() : undefined,
            rejection_reason: approvalAction === 'reject' ? rejectionReason : undefined,
            approver: approvalAction === 'approve' ? { id: 1, name: 'Admin' } : undefined,
          };
        }
        return req;
      });
      setLeaveRequests(updatedRequests);
      setShowApprovalModal(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Approval failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const Icon = statusIcons[status] || ExclamationTriangleIcon;
    return <Icon className="w-3 h-3" />;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Requests</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all leave requests and approvals
          </p>
        </div>
        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              <ExclamationTriangleIcon className="w-4 h-4" />
              {pendingCount} pending
            </span>
          )}
          <button
            onClick={() => navigate('/admin/leaves/create')}
            className="inline-flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg shadow-sm bg-primary-600 hover:bg-primary-700"
          >
            <UserIcon className="w-5 h-5" />
            Apply Leave
          </button>
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
              setFilters({ employee_id: '', leave_type_id: '', status: '', date_from: '', date_to: '', page: 1, per_page: 10 });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-500 transition-colors hover:text-gray-700"
          >
            <ArrowPathIcon className="w-5 h-5" />
            <span className="text-sm">Reset</span>
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 gap-4 pt-4 mt-4 border-t border-gray-200 sm:grid-cols-5">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Leave Type</label>
              <select
                value={filters.leave_type_id}
                onChange={(e) => handleFilterChange('leave_type_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Types</option>
                {mockLeaveTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
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
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Per Page</label>
              <select
                value={filters.per_page}
                onChange={(e) => handleFilterChange('per_page', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
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

      {/* Leave Requests Table */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Employee
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Dates
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Days
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Attachment
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedRequests.map((request) => (
                <tr key={request.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100">
                        <span className="text-xs font-medium text-primary-700">
                          {request.employee?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{request.employee?.name}</p>
                        <p className="text-xs text-gray-500">{request.employee?.employee_code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-900">{request.leave_type?.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">
                      {new Date(request.start_date).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      to {new Date(request.end_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-900">{request.days}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(request.status)}`}>
                      {getStatusIcon(request.status)}
                      {statusLabels[request.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {request.attachment ? (
                      <button className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700">
                        <PaperClipIcon className="w-4 h-4" />
                        View
                      </button>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleView(request)}
                        className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproval(request, 'approve')}
                            className="p-1.5 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                            title="Approve"
                          >
                            <CheckBadgeIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleApproval(request, 'reject')}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="Reject"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {paginatedRequests.length === 0 && (
          <div className="py-12 text-center">
            <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900">No leave requests found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Showing {paginatedRequests.length > 0 ? (filters.page - 1) * filters.per_page + 1 : 0} to{' '}
              {Math.min(filters.page * filters.per_page, filteredRequests.length)} of {filteredRequests.length} requests
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
          VIEW LEAVE REQUEST MODAL
          ========================================== */}
      {showViewModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-100">
                  <DocumentTextIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Leave Request Details</h3>
                  <p className="text-sm text-gray-500">#{selectedRequest.id}</p>
                </div>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100">
                  <UserIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{selectedRequest.employee?.name}</p>
                  <p className="text-xs text-gray-500">{selectedRequest.employee?.employee_code}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Leave Type</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedRequest.leave_type?.name}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Status</label>
                  <p className="mt-1">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedRequest.status)}`}>
                      {getStatusIcon(selectedRequest.status)}
                      {statusLabels[selectedRequest.status]}
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Start Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedRequest.start_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">End Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedRequest.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Days</label>
                  <p className="mt-1 text-sm font-medium text-gray-900">{selectedRequest.days}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Department</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedRequest.employee?.department?.name}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Reason</label>
                <p className="p-3 mt-1 text-sm text-gray-900 rounded-lg bg-gray-50">{selectedRequest.reason}</p>
              </div>

              {selectedRequest.attachment && (
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Attachment</label>
                  <div className="flex items-center gap-2 p-3 mt-1 rounded-lg bg-gray-50">
                    <PaperClipIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-900">{selectedRequest.attachment_name}</span>
                  </div>
                </div>
              )}

              {selectedRequest.status === 'approved' && selectedRequest.approver && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckBadgeIcon className="w-5 h-5" />
                    <span>Approved by {selectedRequest.approver.name}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">
                      {new Date(selectedRequest.approved_at!).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {selectedRequest.status === 'rejected' && selectedRequest.rejection_reason && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-start gap-2 text-sm text-red-600">
                    <XMarkIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">Rejected:</span>
                      <span className="ml-1">{selectedRequest.rejection_reason}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              {selectedRequest.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleApproval(selectedRequest, 'approve');
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    <CheckBadgeIcon className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleApproval(selectedRequest, 'reject');
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          APPROVAL MODAL
          ========================================== */}
      {showApprovalModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white shadow-lg rounded-xl">
            <div className="p-6">
              <div className={`flex items-center justify-center mb-4 ${approvalAction === 'approve' ? 'text-green-600' : 'text-red-600'}`}>
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${approvalAction === 'approve' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {approvalAction === 'approve' ? (
                    <CheckCircleIcon className="w-6 h-6" />
                  ) : (
                    <XCircleIcon className="w-6 h-6" />
                  )}
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-center text-gray-900">
                {approvalAction === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
              </h3>
              <p className="text-sm text-center text-gray-500">
                {approvalAction === 'approve' 
                  ? `Are you sure you want to approve ${selectedRequest.employee?.name}'s leave request?`
                  : `Are you sure you want to reject ${selectedRequest.employee?.name}'s leave request?`
                }
              </p>
              {approvalAction === 'reject' && (
                <div className="mt-4">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Rejection Reason *
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Please provide a reason for rejection..."
                  />
                </div>
              )}
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmApproval}
                  disabled={loading || (approvalAction === 'reject' && !rejectionReason.trim())}
                  className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    approvalAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {loading ? 'Processing...' : approvalAction === 'approve' ? 'Approve' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequests;