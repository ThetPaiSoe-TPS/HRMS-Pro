import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  CheckBadgeIcon,
  XMarkIcon,
  CalendarIcon,
  UserIcon,
  DocumentTextIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { leaveApi } from "../../../api/leave/leaveApi";
import { getStorageUrl } from "../../../api/axios";
import type { LeaveRequest } from "../../../types/leave.types";

// Helper functions
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

export const LeaveApproval: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<LeaveRequest[]>([]);
  const [rejectionReason, setRejectionReason] = useState<
    Record<number, string>
  >({});
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
    null,
  );
  const [showRejectModal, setShowRejectModal] = useState(false);

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const result = await leaveApi.getLeaveRequests({
        employee_id: "",
        leave_type_id: "",
        status: "pending",
        date_from: "",
        date_to: "",
        search: "",
        page: 1,
        per_page: 50,
      });
      setPendingRequests(result.data);
    } catch (error) {
      console.error("Failed to fetch pending requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await leaveApi.approveLeaveRequest(id);
      fetchPendingRequests();
    } catch (error) {
      console.error("Failed to approve:", error);
    }
  };

  const handleReject = async (id: number) => {
    const reason = rejectionReason[id] || "";
    try {
      await leaveApi.rejectLeaveRequest(id, {
        rejection_reason: reason || "No reason provided",
      });
      setRejectionReason((prev) => {
        const newReasons = { ...prev };
        delete newReasons[id];
        return newReasons;
      });
      setShowRejectModal(false);
      setSelectedRequest(null);
      fetchPendingRequests();
    } catch (error) {
      console.error("Failed to reject:", error);
    }
  };

  const openRejectModal = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/admin/leaves"
          className="p-2 transition-colors rounded-lg hover:bg-gray-100"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Approval</h1>
          <p className="mt-1 text-sm text-gray-500">
            Review and approve pending leave requests
          </p>
        </div>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length === 0 ? (
        <div className="py-12 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <CheckBadgeIcon className="w-12 h-12 mx-auto mb-4 text-green-300" />
          <h3 className="text-lg font-medium text-gray-900">
            No pending leave requests
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            All leave requests have been reviewed
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map((request) => (
            <div
              key={request.id}
              className="p-4 transition-shadow bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {/* Employee Photo */}
                  {request.employee?.photo ? (
                    <img
                      src={getPhotoUrl(request.employee.photo)}
                      alt={request.employee.name}
                      className="flex-shrink-0 object-cover w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div
                      className={`flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full ${getRandomColor(request.employee?.id || 1)}`}
                    >
                      <span className="text-base font-medium">
                        {getInitials(request.employee?.name || "U")}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {request.employee?.name || "Unknown"}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {request.employee?.employee_code || ""}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {request.leave_type?.name || "N/A"}
                      </span>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(request.start_date)} -{" "}
                        {formatDate(request.end_date)}
                      </span>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs font-medium text-gray-700">
                        {request.days} day{request.days > 1 ? "s" : ""}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {request.reason}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApprove(request.id)}
                    className="px-3 py-1.5 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    <CheckBadgeIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openRejectModal(request)}
                    className="px-3 py-1.5 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white shadow-lg rounded-xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
                  <XMarkIcon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Reject Leave Request
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedRequest.employee?.name} -{" "}
                    {selectedRequest.leave_type?.name}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectionReason[selectedRequest.id] || ""}
                  onChange={(e) =>
                    setRejectionReason({
                      ...rejectionReason,
                      [selectedRequest.id]: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter reason for rejection..."
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setSelectedRequest(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(selectedRequest.id)}
                  className="flex-1 px-4 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveApproval;
