import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CalendarIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  XMarkIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import type {
  Department,
  DepartmentFilters,
} from "../../types/department.types";
import { departmentApi } from "../../api/department/departmentApi";

// Status badge colors
const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
};

export const Departments: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<DepartmentFilters>({
    search: "",
    status: "",
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
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch departments from API
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const result = await departmentApi.getDepartments(filters);
      setDepartments(result.data);
      setPagination({
        total: result.total,
        last_page: result.last_page,
        current_page: result.current_page,
        per_page: result.per_page,
        from: result.from || 0,
        to: result.to || 0,
      });
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      setErrors({ general: "Failed to load departments" });
    } finally {
      setLoading(false);
    }
  };

  // Initial load and when filters change
  useEffect(() => {
    fetchDepartments();
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

  const handleFilterChange = (key: keyof DepartmentFilters, value: string) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleDelete = (department: Department) => {
    setSelectedDepartment(department);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedDepartment) return;
    try {
      await departmentApi.deleteDepartment(selectedDepartment.id);
      setShowDeleteModal(false);
      setSelectedDepartment(null);
      fetchDepartments(); // Refresh the list
    } catch (error: any) {
      setErrors({
        general: error.response?.data?.message || "Failed to delete department",
      });
    }
  };

  const handleView = (department: Department) => {
    setSelectedDepartment(department);
    setShowViewModal(true);
  };

  const handleEdit = (department: Department) => {
    navigate(`/admin/departments/${department.id}/edit`);
  };

  const getStatusBadge = (status: string) => {
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Departments</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Manage company departments and their managers
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/departments/create")}
          className="inline-flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg shadow-sm bg-primary-900 hover:text-black hover:bg-secondary-900"
        >
          <PlusIcon className="w-5 h-5" />
          Create Department
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BuildingOfficeIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">Total Departments</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {pagination.total}
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckBadgeIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">Active</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {departments.filter((d) => d.status === "active").length}
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <UsersIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">Total Employees</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {departments.reduce(
                  (sum, d) => sum + (d.employees_count || 0),
                  0,
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <UserIcon className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">Managers Assigned</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {departments.filter((d) => d.manager_id).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 mb-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 dark:text-gray-500 -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search departments by name or code..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2 transition-colors border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
          >
            <FunnelIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 dark:text-gray-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Filters</span>
          </button>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilters({ search: "", status: "", page: 1, per_page: 10 });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-300"
          >
            <ArrowPathIcon className="w-5 h-5" />
            <span className="text-sm">Reset</span>
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 gap-4 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 sm:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Per Page
              </label>
              <select
                value={filters.per_page}
                onChange={(e) =>
                  handleFilterChange("per_page", parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
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

      {/* Departments Table */}
      <div className="overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
                      Department
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
                      Code
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
                      Manager
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
                      Employees
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
                      Created
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {departments.map((department) => (
                    <tr
                      key={department.id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center flex-shrink-0 rounded-lg h-9 w-9 bg-primary-100">
                            <BuildingOfficeIcon className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {department.name}
                            </p>
                            {department.description && (
                              <p className="max-w-xs text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 truncate">
                                {department.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {department.code || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {department.manager ? (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full">
                              <UserIcon className="w-3 h-3 text-gray-500 dark:text-gray-400 dark:text-gray-500" />
                            </div>
                            <span className="text-sm text-gray-900 dark:text-gray-100">
                              {department.manager.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 dark:text-gray-500">
                            Not assigned
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <UsersIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {department.employees_count || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <UsersIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {department.employees_count || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(department.status)}`}
                        >
                          {department.status === "active" ? (
                            <CheckBadgeIcon className="w-3 h-3" />
                          ) : (
                            <XMarkIcon className="w-3 h-3" />
                          )}
                          {department.status.charAt(0).toUpperCase() +
                            department.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                          <CalendarIcon className="w-4 h-4" />
                          {new Date(department.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleView(department)}
                            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-primary-900 rounded-lg hover:bg-primary-50 transition-colors"
                            title="View"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(department)}
                            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            <PencilSquareIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(department)}
                            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete"
                            disabled={department.employees_count > 0}
                          >
                            <TrashIcon
                              className={`h-4 w-4 ${department.employees_count > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {departments.length === 0 && (
              <div className="py-12 text-center">
                <BuildingOfficeIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  No departments found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                  Try adjusting your search or create a new department
                </p>
              </div>
            )}

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                  Showing {pagination.from} to {pagination.to} of{" "}
                  {pagination.total} departments
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="px-3 py-1 text-sm transition-colors border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
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
                          : "border border-gray-300 dark:border-gray-600 hover:bg-secondary-900 dark:hover:bg-gray-700 dark:bg-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page === pagination.last_page}
                    className="px-3 py-1 text-sm transition-colors border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
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
          VIEW DEPARTMENT MODAL
          ========================================== */}
      {showViewModal && selectedDepartment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary-100">
                  <BuildingOfficeIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {selectedDepartment.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                    {selectedDepartment.code}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 dark:text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
                  Description
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {selectedDepartment.description || "No description provided"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
                    Status
                  </label>
                  <p className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedDepartment.status)}`}
                    >
                      {selectedDepartment.status === "active" ? (
                        <CheckBadgeIcon className="w-3 h-3" />
                      ) : (
                        <XMarkIcon className="w-3 h-3" />
                      )}
                      {selectedDepartment.status.charAt(0).toUpperCase() +
                        selectedDepartment.status.slice(1)}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
                    Manager
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {selectedDepartment.manager
                      ? selectedDepartment.manager.name
                      : "Not assigned"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
                    Total Employees
                  </label>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {selectedDepartment.employees_count || 0}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
                    Department Code
                  </label>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {selectedDepartment.code}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
                    Created
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {new Date(selectedDepartment.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
                    Last Updated
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {new Date(selectedDepartment.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 transition-colors border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEdit(selectedDepartment);
                }}
                className="px-4 py-2 text-white transition-colors rounded-lg bg-primary-900 hover:text-black hover:bg-secondary-900"
              >
                Edit Department
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          DELETE CONFIRMATION MODAL
          ========================================== */}
      {showDeleteModal && selectedDepartment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-xl">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-center text-gray-900 dark:text-gray-100">
                Delete Department
              </h3>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400 dark:text-gray-500">
                Are you sure you want to delete{" "}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedDepartment.name}
                </span>
                ?
                {selectedDepartment.employees_count > 0 && (
                  <span className="block mt-2 text-red-600">
                    ⚠️ This department has {selectedDepartment.employees_count}{" "}
                    employee(s). Delete will unassign them from this department.
                  </span>
                )}
              </p>
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 transition-colors border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Delete Department
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
