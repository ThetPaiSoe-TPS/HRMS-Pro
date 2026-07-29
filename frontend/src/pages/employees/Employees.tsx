import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  CalendarIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  XMarkIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import type { Employee, EmployeeFilters } from "../../types/employee.types";
import { employeeApi, departmentApi, positionApi } from "../../api/employeeApi";
import type { Department, Position } from "../../types/employee.types";
import { getStorageUrl } from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
};

const statusLabels: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
};

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

export const Employees: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";
  const isManager = user?.role === "manager";
  const isReadOnly = !isSuperAdmin;

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, last_page: 1 });

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<EmployeeFilters>({
    search: "",
    department_id: "",
    position_id: "",
    status: "",
    page: 1,
    per_page: 10,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      // If manager, filter by their department
      const params = {
        ...filters,
        department_id:
          isManager && user?.employee?.department_id
            ? String(user.employee.department_id)
            : filters.department_id,
      };
      const result = await employeeApi.getEmployees(params);
      setEmployees(result.data);
      setPagination({ total: result.total, last_page: result.last_page });
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, isManager, user]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [depts, pos] = await Promise.all([
          departmentApi.getAll(),
          positionApi.getAll(),
        ]);
        setDepartments(depts);
        setPositions(pos);
      } catch (error) {
        console.error("Failed to fetch departments/positions:", error);
      }
    };
    fetchLookups();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleFilterChange = (key: keyof EmployeeFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedEmployee) return;
    try {
      await employeeApi.deleteEmployee(selectedEmployee.id);
      setShowDeleteModal(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };

  const handleView = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
  };

  const handleEdit = (employee: Employee) => {
    navigate(`/admin/employees/${employee.id}/edit`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {isManager ? "Team Members" : "Employees"}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isManager
              ? "View your team members"
              : "Manage all employees and their information"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isManager && (
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
              <EyeIcon className="w-4 h-4" />
              Read Only
            </span>
          )}
          {!isReadOnly && (
            <button
              onClick={() => navigate("/admin/employees/create")}
              className="inline-flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg shadow-sm bg-primary-900 hover:bg-secondary-900 hover:text-black"
            >
              <PlusIcon className="w-5 h-5" />
              Add Employee
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/30">
              <UserGroupIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Employees
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {pagination.total}
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/30">
              <CheckBadgeIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {employees.filter((e) => e.status === "active").length}
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-700">
              <UsersIcon className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Inactive
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {employees.filter((e) => e.status === "inactive").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search employees by name, code, or email..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <FunnelIcon className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Filters
            </span>
          </button>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilters({
                search: "",
                department_id: "",
                position_id: "",
                status: "",
                page: 1,
                per_page: 10,
              });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowPathIcon className="w-5 h-5" />
            <span className="text-sm">Reset</span>
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 gap-4 pt-4 mt-4 border-t border-gray-200 sm:grid-cols-4 dark:border-gray-700">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Department
              </label>
              <select
                value={filters.department_id}
                onChange={(e) =>
                  handleFilterChange("department_id", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Position
              </label>
              <select
                value={filters.position_id}
                onChange={(e) =>
                  handleFilterChange("position_id", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              >
                <option value="">All Positions</option>
                {positions.map((pos) => (
                  <option key={pos.id} value={pos.id}>
                    {pos.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
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
                onChange={(e) => handleFilterChange("per_page", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
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

      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Employee
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Contact
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Gender / DOB
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Department / Position
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Joined
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
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {employee.photo ? (
                        <img
                          src={getPhotoUrl(employee.photo) ?? ""}
                          alt={employee.name}
                          className="flex-shrink-0 object-cover rounded-full h-9 w-9"
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
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {employee.name}
                        </p>
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
                        <span className="text-sm text-gray-600 truncate max-w-[150px] dark:text-gray-300">
                          {employee.email}
                        </span>
                      </div>
                      {employee.phone && (
                        <div className="flex items-center gap-1.5">
                          <PhoneIcon className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {employee.phone}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {employee.gender
                          ? employee.gender.charAt(0).toUpperCase() +
                            employee.gender.slice(1)
                          : "N/A"}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {employee.date_of_birth
                          ? new Date(
                              employee.date_of_birth,
                            ).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <BuildingOfficeIcon className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          {employee.department?.name || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BriefcaseIcon className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {employee.position?.title || "N/A"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[employee.status] || "bg-gray-100 text-gray-800"}`}
                    >
                      {employee.status === "active" ? (
                        <CheckBadgeIcon className="w-3 h-3" />
                      ) : (
                        <XMarkIcon className="w-3 h-3" />
                      )}
                      {statusLabels[employee.status] || employee.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                      <CalendarIcon className="w-4 h-4" />
                      {employee.hire_date
                        ? new Date(employee.hire_date).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleView(employee)}
                        className="p-1.5 text-gray-400 hover:text-primary-900 rounded-lg hover:bg-primary-50 transition-colors dark:hover:bg-primary-900/30"
                        title="View"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      {/* Edit - only for super admin */}
                      {!isReadOnly && (
                        <button
                          onClick={() => handleEdit(employee)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors dark:hover:bg-blue-900/30"
                          title="Edit"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                      )}
                      {/* Delete - only for super admin */}
                      {isSuperAdmin && (
                        <button
                          onClick={() => handleDelete(employee)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors dark:hover:bg-red-900/30"
                          title="Delete"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
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
              No employees found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search or add a new employee
            </p>
          </div>
        )}

        {pagination.last_page > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
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

      {showViewModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto dark:bg-gray-800">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                {selectedEmployee.photo ? (
                  <img
                    src={getPhotoUrl(selectedEmployee.photo) ?? ""}
                    alt={selectedEmployee.name}
                    className="object-cover w-12 h-12 rounded-full"
                  />
                ) : (
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center ${getRandomColor(selectedEmployee.id)}`}
                  >
                    <span className="text-lg font-bold">
                      {getInitials(selectedEmployee.name)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {selectedEmployee.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedEmployee.employee_code}
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
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Email
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {selectedEmployee.email}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Phone
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {selectedEmployee.phone || "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Gender
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {selectedEmployee.gender
                      ? selectedEmployee.gender.charAt(0).toUpperCase() +
                        selectedEmployee.gender.slice(1)
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Date of Birth
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {selectedEmployee.date_of_birth
                      ? new Date(
                          selectedEmployee.date_of_birth,
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Department
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {selectedEmployee.department?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Position
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {selectedEmployee.position?.title || "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Status
                  </label>
                  <p className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedEmployee.status] || "bg-gray-100 text-gray-800"}`}
                    >
                      {selectedEmployee.status === "active" ? (
                        <CheckBadgeIcon className="w-3 h-3" />
                      ) : (
                        <XMarkIcon className="w-3 h-3" />
                      )}
                      {statusLabels[selectedEmployee.status] ||
                        selectedEmployee.status}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Hire Date
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {selectedEmployee.hire_date
                      ? new Date(
                          selectedEmployee.hire_date,
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Created
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {new Date(selectedEmployee.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Last Updated
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {new Date(selectedEmployee.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowViewModal(false)}
                className="w-full sm:w-auto px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEdit(selectedEmployee);
                }}
                className="w-full sm:w-auto px-4 py-2 text-white transition-colors rounded-lg bg-primary-900 hover:bg-secondary-900 hover:text-black"
              >
                Edit Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white shadow-lg rounded-xl dark:bg-gray-800">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-center text-gray-900 dark:text-gray-100">
                Delete Employee
              </h3>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                Are you sure you want to delete{" "}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedEmployee.name}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Delete Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
