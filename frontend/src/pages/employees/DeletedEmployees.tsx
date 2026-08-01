import React, { useState, useEffect, useCallback } from "react";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  CalendarIcon,
  EnvelopeIcon,
  PhoneIcon,
  ArrowPathIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import type { Employee, EmployeeFilters } from "../../types/employee.types";
import { employeeApi } from "../../api/employeeApi";
import { getStorageUrl } from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const getPhotoUrl = (photo: string | null): string | null => {
  return getStorageUrl(photo);
};

const getInitials = (name: string) => {
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
  ];
  return colors[id % colors.length];
};

const DeletedEmployees: React.FC = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, last_page: 1 });
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<EmployeeFilters>({
    search: "",
    department_id: "",
    position_id: "",
    status: "",
    with_trashed: false,
    page: 1,
    per_page: 10,
  });
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showForceDeleteModal, setShowForceDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
      };
      const result = await employeeApi.getDeletedEmployees(params);
      setEmployees(result.data);
      setPagination({ total: result.total, last_page: result.last_page });
    } catch (error) {
      console.error("Failed to fetch deleted employees:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleRestore = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowRestoreModal(true);
  };

  const confirmRestore = async () => {
    if (!selectedEmployee) return;
    setActionLoading(true);
    try {
      await employeeApi.restoreEmployee(selectedEmployee.id);
      setShowRestoreModal(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (error) {
      console.error("Failed to restore employee:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleForceDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowForceDeleteModal(true);
  };

  const confirmForceDelete = async () => {
    if (!selectedEmployee) return;
    setActionLoading(true);
    try {
      await employeeApi.forceDeleteEmployee(selectedEmployee.id);
      setShowForceDeleteModal(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (error) {
      console.error("Failed to force delete employee:", error);
    } finally {
      setActionLoading(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="py-12 text-center">
          <UserGroupIcon className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Access Denied
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Only administrators can view deleted employees.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Deleted Employees
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View and manage soft-deleted employees. You can restore or
            permanently delete them here.
          </p>
        </div>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300"
        >
          Back to Employee List
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg dark:bg-red-900/30">
              <UserGroupIcon className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total in Trash
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {pagination.total}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search deleted employees by name, code, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
          />
        </div>
      </div>

      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Employee (Deleted)
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Contact
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Department / Position
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Deleted At
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {employees.map((employee) => (
                <tr
                  key={employee.id}
                  className="bg-gray-50/50 hover:bg-gray-100/50 dark:bg-gray-800/30 dark:hover:bg-gray-700/30 opacity-70"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {employee.photo ? (
                        <img
                          src={getPhotoUrl(employee.photo) ?? ""}
                          alt={employee.name}
                          className="flex-shrink-0 object-cover rounded-full h-9 w-9 grayscale"
                        />
                      ) : (
                        <div
                          className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 ${getRandomColor(employee.id)}`}
                        >
                          <span className="text-xs font-bold">
                            {getInitials(employee.name)}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {employee.name}
                          </p>
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-200 rounded-full dark:bg-gray-600 dark:text-gray-300">
                            Deleted
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {employee.employee_code}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <EnvelopeIcon className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm text-gray-400 dark:text-gray-500 truncate max-w-[150px]">
                          {employee.email}
                        </span>
                      </div>
                      {employee.phone && (
                        <div className="flex items-center gap-1.5">
                          <PhoneIcon className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm text-gray-400 dark:text-gray-500">
                            {employee.phone}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <BuildingOfficeIcon className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm text-gray-400 dark:text-gray-500">
                          {employee.department?.name || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BriefcaseIcon className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm text-gray-400 dark:text-gray-500">
                          {employee.position?.title || "N/A"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        employee.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                      <CalendarIcon className="w-4 h-4" />
                      {employee.deleted_at
                        ? new Date(employee.deleted_at).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleRestore(employee)}
                        className="p-1.5 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors dark:hover:bg-green-900/30"
                        title="Restore"
                      >
                        <ArrowPathIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleForceDelete(employee)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors dark:hover:bg-red-900/30"
                        title="Permanently Delete"
                      >
                        <XMarkIcon className="w-5 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary-600"></div>
          </div>
        )}

        {!loading && employees.length === 0 && (
          <div className="py-12 text-center">
            <UserGroupIcon className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              No deleted employees found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              The trash is empty. Soft-deleted employees will appear here.
            </p>
          </div>
        )}

        {pagination.last_page > 1 && (
          <div className="flex flex-col items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 sm:flex-row dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing{" "}
              {employees.length > 0
                ? (filters.page - 1) * filters.per_page + 1
                : 0}{" "}
              to {Math.min(filters.page * filters.per_page, pagination.total)}{" "}
              of {pagination.total} employees
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
                className="px-3 py-1 text-sm transition-colors border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
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
                      ? "bg-primary-900 text-white"
                      : "border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === pagination.last_page}
                className="px-3 py-1 text-sm transition-colors border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {showRestoreModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white shadow-lg rounded-xl dark:bg-gray-800">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                  {/* <RestoreIcon className="w-6 h-6 text-green-600" /> */}
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-center text-gray-900 dark:text-gray-100">
                Restore Employee
              </h3>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                Are you sure you want to restore{" "}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedEmployee.name}
                </span>
                ?<br />
                The employee will reappear in the main employee list.
              </p>
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setShowRestoreModal(false)}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRestore}
                  disabled={actionLoading}
                  className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {actionLoading && (
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  Restore
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showForceDeleteModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white shadow-lg rounded-xl dark:bg-gray-800">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-center text-gray-900 dark:text-gray-100">
                Permanently Delete Employee
              </h3>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                Are you sure you want to permanently delete{" "}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedEmployee.name}
                </span>
                ?<br />
                <strong className="text-red-600">
                  ⚠️ This action cannot be undone! All data will be permanently
                  removed from the database.
                </strong>
              </p>
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setShowForceDeleteModal(false)}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmForceDelete}
                  disabled={actionLoading}
                  className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading && (
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  Permanently Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeletedEmployees;
