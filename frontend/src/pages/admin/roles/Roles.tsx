import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CalendarIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { Permission, Role, RoleFilters } from "../../../types/role.types";
import { roleApi } from "../../../api/role/roleApi";
import { useAuth } from "../../../hooks/useAuth";

// Role badge colors
const roleColors: Record<string, string> = {
  super_admin: "bg-purple-100 text-purple-800",
  hr_manager: "bg-blue-100 text-blue-800",
  department_manager: "bg-indigo-100 text-indigo-800",
  employee: "bg-gray-100 text-gray-800",
};

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  hr_manager: "HR Manager",
  department_manager: "Dept Manager",
  employee: "Employee",
};

export const Roles: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  // State
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<RoleFilters>({
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
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // Fetch roles
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const result = await roleApi.getRoles(filters);
      setRoles(result.data);
      setPagination({
        total: result.total,
        last_page: result.last_page,
        current_page: result.current_page,
        per_page: result.per_page,
        from: result.from || 0,
        to: result.to || 0,
      });
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [filters]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleDelete = (role: Role) => {
    setSelectedRole(role);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedRole) return;
    try {
      await roleApi.deleteRole(selectedRole.id);
      setShowDeleteModal(false);
      setSelectedRole(null);
      fetchRoles();
    } catch (error) {
      console.error("Failed to delete role:", error);
    }
  };

  const handleView = (role: Role) => {
    setSelectedRole(role);
    setShowViewModal(true);
  };

  const handleEdit = (role: Role) => {
    navigate(`/admin/roles/${role.id}/edit`);
  };

  const getRoleBadge = (roleName: string) => {
    return roleColors[roleName] || "bg-gray-100 text-gray-800";
  };

  const getPermissionCount = (role: Role) => {
    return role.permissions?.length || 0;
  };

  // Group permissions by module
  const getGroupedPermissions = (permissions: Permission[]) => {
    const grouped: Record<string, Permission[]> = {};
    permissions.forEach((p) => {
      const module = p.module || "general";
      if (!grouped[module]) {
        grouped[module] = [];
      }
      grouped[module].push(p);
    });
    return grouped;
  };

  if (loading && roles.length === 0) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Roles Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Manage user roles and their permissions
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/roles/create")}
          className="inline-flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg shadow-sm bg-primary-600 hover:bg-primary-700"
        >
          <PlusIcon className="w-5 h-5" />
          Create Role
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-100">
              <ShieldCheckIcon className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                Total Roles
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {pagination.total}
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <UserGroupIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                Total Users
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {roles.reduce((sum, r) => sum + (r.users_count || 0), 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckBadgeIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                Admin Roles
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {
                  roles.filter(
                    (r) => r.name === "super_admin" || r.name === "hr_manager",
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShieldCheckIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                Total Permissions
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {
                  new Set(
                    roles.flatMap((r) => r.permissions?.map((p) => p.id) || []),
                  ).size
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 mb-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 dark:text-gray-500 -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search roles by name or description..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilters({ search: "", page: 1, per_page: 10 });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-300"
          >
            <ArrowPathIcon className="w-5 h-5" />
            <span className="text-sm">Reset</span>
          </button>
        </div>
      </div>

      {/* Roles Table */}
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
                      Role
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
                      Description
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
                      Permissions
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
                      Users
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
                  {roles.map((role) => (
                    <tr
                      key={role.id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center flex-shrink-0 rounded-lg h-9 w-9 bg-primary-100">
                            <ShieldCheckIcon className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {role.display_name}
                            </p>
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(role.name)}`}
                            >
                              {roleLabels[role.name] || role.name}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="max-w-xs text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 truncate">
                          {role.description || "No description"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {getPermissionCount(role)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                            permissions
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <UserGroupIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {role.users_count || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                          <CalendarIcon className="w-4 h-4" />
                          {new Date(role.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleView(role)}
                            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                            title="View"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(role)}
                            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            <PencilSquareIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(role)}
                            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete"
                            disabled={
                              role.name === "super_admin" ||
                              role.users_count > 0
                            }
                          >
                            <TrashIcon
                              className={`h-4 w-4 ${role.name === "super_admin" || role.users_count > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
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
            {roles.length === 0 && (
              <div className="py-12 text-center">
                <ShieldCheckIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  No roles found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                  Try adjusting your search or create a new role
                </p>
              </div>
            )}

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                  Showing {pagination.from} to {pagination.to} of{" "}
                  {pagination.total} roles
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
                          ? "bg-primary-600 text-white"
                          : "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
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
          VIEW ROLE MODAL
          ========================================== */}
      {showViewModal && selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary-100">
                  <ShieldCheckIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {selectedRole.display_name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(selectedRole.name)}`}
                    >
                      {roleLabels[selectedRole.name] || selectedRole.name}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 dark:text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
                  Description
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {selectedRole.description || "No description provided"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
                    Users with this role
                  </label>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {selectedRole.users_count || 0}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
                    Total Permissions
                  </label>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {getPermissionCount(selectedRole)}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                  Permissions
                </h4>
                {selectedRole.permissions &&
                selectedRole.permissions.length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(
                      getGroupedPermissions(selectedRole.permissions),
                    ).map(([module, perms]) => (
                      <div key={module}>
                        <h5 className="mb-2 text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
                          {module.charAt(0).toUpperCase() + module.slice(1)}
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {perms.map((perm) => (
                            <span
                              key={perm.id}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700"
                            >
                              <CheckBadgeIcon className="w-3 h-3" />
                              {perm.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                    No permissions assigned
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
                      Created
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {new Date(selectedRole.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
                      Last Updated
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {new Date(selectedRole.updated_at).toLocaleString()}
                    </p>
                  </div>
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
                  handleEdit(selectedRole);
                }}
                className="px-4 py-2 text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
              >
                Edit Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          DELETE CONFIRMATION MODAL
          ========================================== */}
      {showDeleteModal && selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-xl">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-center text-gray-900 dark:text-gray-100">
                Delete Role
              </h3>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400 dark:text-gray-500">
                Are you sure you want to delete{" "}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedRole.display_name}
                </span>
                ?
                {selectedRole.users_count > 0 && (
                  <span className="block mt-2 text-red-600">
                    ⚠️ This role is assigned to {selectedRole.users_count}{" "}
                    user(s). Delete will remove the role from these users.
                  </span>
                )}
                {selectedRole.name === "super_admin" && (
                  <span className="block mt-2 text-red-600">
                    ⚠️ This is a system role and cannot be deleted.
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
                  disabled={selectedRole.name === "super_admin"}
                  className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors ${
                    selectedRole.name === "super_admin"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  Delete Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;
