import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckBadgeIcon,
  XMarkIcon,
  CalendarIcon,
  UserIcon,
  ArrowPathIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import type {
  LeaveRequest,
  LeaveFilters,
  LeaveType,
} from "../../../types/leave.types";
import { leaveApi } from "../../../api/leave/leaveApi";
import { leaveTypeApi } from "../../../api/leave/leaveApi";
import { getStorageUrl } from "../../../api/axios";

// Status badge colors
const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export const LeaveRequests: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<LeaveFilters>({
    employee_id: "",
    leave_type_id: "",
    status: "",
    date_from: "",
    date_to: "",
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

  // Fetch leave requests
  const fetchLeaveRequests = async () => {
    setLoading(true);
    try {
      const result = await leaveApi.getLeaveRequests(filters);
      setLeaveRequests(result.data);
      setPagination({
        total: result.total,
        last_page: result.last_page,
        current_page: result.current_page,
        per_page: result.per_page,
        from: result.from || 0,
        to: result.to || 0,
      });
    } catch (error) {
      console.error("Failed to fetch leave requests:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch leave types for filter
  const fetchLeaveTypes = async () => {
    try {
      const result = await leaveTypeApi.getActiveLeaveTypes();
      setLeaveTypes(result);
    } catch (error) {
      console.error("Failed to fetch leave types:", error);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
    fetchLeaveTypes();
  }, [filters]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const getPhotoUrl = (photo: string | null): string | null => {
    return getStorageUrl(photo);
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

  const handleFilterChange = (
    key: keyof LeaveFilters,
    value: string | number,
  ) => {
    setFilters({ ...filters, [key]: value as any, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleView = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
    setShowViewModal(true);
  };

  const handleEdit = (leave: LeaveRequest) => {
    navigate(`/admin/leaves/${leave.id}/edit`);
  };

  const handleDelete = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedLeave) return;
    try {
      await leaveApi.deleteLeaveRequest(selectedLeave.id);
      setShowDeleteModal(false);
      setSelectedLeave(null);
      fetchLeaveRequests();
    } catch (error) {
      console.error("Failed to delete leave request:", error);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await leaveApi.approveLeaveRequest(id);
      fetchLeaveRequests();
    } catch (error) {
      console.error("Failed to approve leave request:", error);
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt("Enter rejection reason:");
    try {
      await leaveApi.rejectLeaveRequest(id, {
        rejection_reason: reason || undefined,
      });
      fetchLeaveRequests();
    } catch (error) {
      console.error("Failed to reject leave request:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Requests</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage employee leave requests
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/leaves/create")}
          className="inline-flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg shadow-sm bg-primary-600 hover:bg-primary-700"
        >
          <PlusIcon className="w-5 h-5" />
          Apply Leave
        </button>
      </div>

      {/* Search & Filters */}
      <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search leave requests..."
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
              setSearchTerm("");
              setFilters({
                employee_id: "",
                leave_type_id: "",
                status: "",
                date_from: "",
                date_to: "",
                search: "",
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
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Leave Type
              </label>
              <select
                value={filters.leave_type_id}
                onChange={(e) =>
                  handleFilterChange("leave_type_id", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Types</option>
                {leaveTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
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
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Date From
              </label>
              <input
                type="date"
                value={filters.date_from}
                onChange={(e) =>
                  handleFilterChange("date_from", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Date To
              </label>
              <input
                type="date"
                value={filters.date_to}
                onChange={(e) => handleFilterChange("date_to", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Leave Requests Table */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Employee
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Leave Type
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Date Range
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Days
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leaveRequests.map((leave) => (
                    <tr
                      key={leave.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {leave.employee?.photo ? (
                            <img
                              src={getPhotoUrl(leave.employee.photo)}
                              alt={leave.employee.name}
                              className="flex-shrink-0 object-cover w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div
                              className={`flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full ${getRandomColor(leave.employee?.id || 1)}`}
                            >
                              <span className="text-xs font-medium">
                                {getInitials(leave.employee?.name || "U")}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {leave.employee?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {leave.employee?.employee_code || ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-900">
                          {leave.leave_type?.name || leave.leave_type || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-900">
                            {formatDate(leave.start_date)}
                          </span>
                          <span className="text-xs text-gray-500">
                            to {formatDate(leave.end_date)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-gray-900">
                          {leave.days} day{leave.days > 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(leave.status)}`}
                        >
                          {leave.status === "approved" && (
                            <CheckBadgeIcon className="w-3 h-3" />
                          )}
                          {leave.status === "rejected" && (
                            <XMarkIcon className="w-3 h-3" />
                          )}
                          {leave.status === "pending" && (
                            <ClockIcon className="w-3 h-3" />
                          )}
                          {statusLabels[leave.status] || leave.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleView(leave)}
                            className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                            title="View"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(leave)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            <PencilSquareIcon className="w-4 h-4" />
                          </button>
                          {leave.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(leave.id)}
                                className="p-1.5 text-green-500 hover:text-green-700 rounded-lg hover:bg-green-50 transition-colors"
                                title="Approve"
                              >
                                <CheckBadgeIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReject(leave.id)}
                                className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                                title="Reject"
                              >
                                <XMarkIcon className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(leave)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {leaveRequests.length === 0 && (
              <div className="py-12 text-center">
                <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900">
                  No leave requests found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or apply for leave
                </p>
              </div>
            )}

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Showing {pagination.from} to {pagination.to} of{" "}
                  {pagination.total} requests
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="px-3 py-1 text-sm transition-colors border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page === pagination.last_page}
                    className="px-3 py-1 text-sm transition-colors border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ==========================================
          VIEW LEAVE MODAL
          ========================================== */}
      {showViewModal && selectedLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                {selectedLeave.employee?.photo ? (
                  <img
                    src={getPhotoUrl(selectedLeave.employee.photo)}
                    alt={selectedLeave.employee.name}
                    className="flex-shrink-0 object-cover w-10 h-10 rounded-full"
                  />
                ) : (
                  <div
                    className={`flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full ${getRandomColor(selectedLeave.employee?.id || 1)}`}
                  >
                    <span className="text-sm font-medium">
                      {getInitials(selectedLeave.employee?.name || "U")}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedLeave.employee?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedLeave.employee?.employee_code || ""}
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

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Leave Type
                  </label>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {selectedLeave.leave_type?.name ||
                      selectedLeave.leave_type ||
                      "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Status
                  </label>
                  <p className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedLeave.status)}`}
                    >
                      {statusLabels[selectedLeave.status] ||
                        selectedLeave.status}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Date Range
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(selectedLeave.start_date)} -{" "}
                  {formatDate(selectedLeave.end_date)}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedLeave.days} day{selectedLeave.days > 1 ? "s" : ""}
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Reason
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedLeave.reason || "No reason provided"}
                </p>
              </div>

              {selectedLeave.rejection_reason && (
                <div>
                  <label className="block text-xs font-medium tracking-wider text-red-500 uppercase">
                    Rejection Reason
                  </label>
                  <p className="mt-1 text-sm text-red-600">
                    {selectedLeave.rejection_reason}
                  </p>
                </div>
              )}

              {selectedLeave.approved_at && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Approved At
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedLeave.approved_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Approved By
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedLeave.approver?.name || "System"}
                    </p>
                  </div>
                </div>
              )}

              {selectedLeave.attachment && (
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Attachment
                  </label>
                  <a
                    href={selectedLeave.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-sm text-primary-600 hover:underline"
                  >
                    View Attachment
                  </a>
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
              {selectedLeave.status === "pending" && (
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleApprove(selectedLeave.id);
                  }}
                  className="px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          DELETE CONFIRMATION MODAL
          ========================================== */}
      {showDeleteModal && selectedLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white shadow-lg rounded-xl">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                  <TrashIcon className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-center text-gray-900">
                Delete Leave Request
              </h3>
              <p className="text-sm text-center text-gray-500">
                Are you sure you want to delete this leave request?
                <br />
                <span className="font-medium text-gray-900">
                  {selectedLeave.employee?.name || "Unknown"} -{" "}
                  {selectedLeave.leave_type?.name || "N/A"}
                </span>
              </p>
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Delete
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
