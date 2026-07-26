import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  CalendarIcon,
  CheckBadgeIcon,
  XMarkIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import type { LeaveType } from "../../../types/leave.types";
import { leaveTypeApi } from "../../../api/leave/leaveApi";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
};

export const LeaveTypes: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [selectedType, setSelectedType] = useState<LeaveType | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    last_page: 1,
    current_page: 1,
    per_page: 10,
    from: 0,
    to: 0,
  });

  const fetchLeaveTypes = async () => {
    setLoading(true);
    try {
      const result = await leaveTypeApi.getLeaveTypes({
        search: "",
        status: "",
        page: 1,
        per_page: 100,
      });
      setLeaveTypes(result.data);
      setPagination({
        total: result.total,
        last_page: result.last_page,
        current_page: result.current_page,
        per_page: result.per_page,
        from: result.from || 0,
        to: result.to || 0,
      });
    } catch (error) {
      console.error("Failed to fetch leave types:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const handleDelete = (type: LeaveType) => {
    setSelectedType(type);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedType) return;
    try {
      await leaveTypeApi.deleteLeaveType(selectedType.id);
      setShowDeleteModal(false);
      setSelectedType(null);
      fetchLeaveTypes(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete leave type:", error);
    }
  };

  const handleEdit = (type: LeaveType) => {
    navigate(`/admin/leave-types/${type.id}/edit`);
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
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Leave Types
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Configure leave types and policies
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/leave-types/create")}
          className="inline-flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg shadow-sm bg-primary-600 hover:bg-primary-700"
        >
          <PlusIcon className="w-5 h-5" />
          Create Leave Type
        </button>
      </div>

      {/* Cards */}
      {leaveTypes.length === 0 ? (
        <div className="py-12 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900">
            No leave types found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Create your first leave type to get started
          </p>
          <button
            onClick={() => navigate("/admin/leave-types/create")}
            className="px-4 py-2 mt-4 text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
          >
            Create Leave Type
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {leaveTypes.map((type) => (
            <div
              key={type.id}
              className="p-4 transition-shadow bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100">
                    <CalendarIcon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {type.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                      {type.code}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[type.status]}`}
                >
                  {type.status}
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 line-clamp-2">
                {type.description || "No description provided"}
              </p>

              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="p-2 text-center rounded-lg bg-gray-50 dark:bg-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                    Days/Year
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {type.days_per_year}
                  </p>
                </div>
                <div className="p-2 text-center rounded-lg bg-gray-50 dark:bg-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                    Paid
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {type.is_paid ? (
                      <CheckBadgeIcon className="w-4 h-4 mx-auto text-green-500" />
                    ) : (
                      <XMarkIcon className="w-4 h-4 mx-auto text-red-500" />
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  {type.carry_forward && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                      Carry Forward ({type.carry_forward_limit || 0})
                    </span>
                  )}
                  {type.max_consecutive_days && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600 dark:text-gray-400 dark:text-gray-500">
                      Max {type.max_consecutive_days}d
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(type)}
                    className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(type)}
                    className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white shadow-lg dark:bg-gray-800 rounded-xl">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-center text-gray-900 dark:text-gray-100">
                Delete Leave Type
              </h3>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400 dark:text-gray-500">
                Are you sure you want to delete{" "}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedType.name}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
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

export default LeaveTypes;
