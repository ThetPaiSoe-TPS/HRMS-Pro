import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  XMarkIcon,
  UsersIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import type { Position, PositionFilters } from '../../../types/position.types';

// Mock data - Replace with API calls
const mockDepartments = [
  { id: 1, name: 'Engineering', code: 'ENG' },
  { id: 2, name: 'Human Resources', code: 'HR' },
  { id: 3, name: 'Finance', code: 'FIN' },
  { id: 4, name: 'Marketing', code: 'MKT' },
  { id: 5, name: 'Operations', code: 'OPS' },
];

const mockPositions: Position[] = [
  {
    id: 1,
    title: 'Senior Developer',
    code: 'SR-DEV',
    description: 'Senior software developer with 5+ years experience',
    department_id: 1,
    department: { id: 1, name: 'Engineering', code: 'ENG' },
    min_salary: 50000,
    max_salary: 80000,
    employees_count: 8,
    status: 'active',
    created_at: '2024-01-01T00:00:00.000000Z',
    updated_at: '2024-01-01T00:00:00.000000Z',
  },
  {
    id: 2,
    title: 'Software Engineer',
    code: 'SWE',
    description: 'Software engineer with 2-5 years experience',
    department_id: 1,
    department: { id: 1, name: 'Engineering', code: 'ENG' },
    min_salary: 30000,
    max_salary: 50000,
    employees_count: 12,
    status: 'active',
    created_at: '2024-01-02T00:00:00.000000Z',
    updated_at: '2024-01-02T00:00:00.000000Z',
  },
  {
    id: 3,
    title: 'Junior Developer',
    code: 'JR-DEV',
    description: 'Entry level software developer',
    department_id: 1,
    department: { id: 1, name: 'Engineering', code: 'ENG' },
    min_salary: 20000,
    max_salary: 30000,
    employees_count: 5,
    status: 'active',
    created_at: '2024-01-03T00:00:00.000000Z',
    updated_at: '2024-01-03T00:00:00.000000Z',
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    code: 'DEVOPS',
    description: 'DevOps and infrastructure engineer',
    department_id: 1,
    department: { id: 1, name: 'Engineering', code: 'ENG' },
    min_salary: 40000,
    max_salary: 60000,
    employees_count: 4,
    status: 'active',
    created_at: '2024-01-04T00:00:00.000000Z',
    updated_at: '2024-01-04T00:00:00.000000Z',
  },
  {
    id: 5,
    title: 'HR Manager',
    code: 'HR-MGR',
    description: 'Human resources manager',
    department_id: 2,
    department: { id: 2, name: 'Human Resources', code: 'HR' },
    min_salary: 45000,
    max_salary: 70000,
    employees_count: 3,
    status: 'active',
    created_at: '2024-01-05T00:00:00.000000Z',
    updated_at: '2024-01-05T00:00:00.000000Z',
  },
  {
    id: 6,
    title: 'Accountant',
    code: 'ACC',
    description: 'Finance and accounting specialist',
    department_id: 3,
    department: { id: 3, name: 'Finance', code: 'FIN' },
    min_salary: 25000,
    max_salary: 40000,
    employees_count: 6,
    status: 'active',
    created_at: '2024-01-06T00:00:00.000000Z',
    updated_at: '2024-01-06T00:00:00.000000Z',
  },
  {
    id: 7,
    title: 'Marketing Specialist',
    code: 'MKT-SPEC',
    description: 'Marketing and brand management specialist',
    department_id: 4,
    department: { id: 4, name: 'Marketing', code: 'MKT' },
    min_salary: 20000,
    max_salary: 35000,
    employees_count: 8,
    status: 'inactive',
    created_at: '2024-01-07T00:00:00.000000Z',
    updated_at: '2024-01-07T00:00:00.000000Z',
  },
];

// Status badge colors
const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
};

export const Positions: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [positions, setPositions] = useState<Position[]>(mockPositions);
  const [departments] = useState(mockDepartments);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<PositionFilters>({
    search: '',
    department_id: '',
    status: '',
    page: 1,
    per_page: 10,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // Filter positions
  const filteredPositions = positions.filter((pos) => {
    const matchesSearch = pos.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pos.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pos.description && pos.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDepartment = !filters.department_id || pos.department_id === parseInt(filters.department_id);
    const matchesStatus = !filters.status || pos.status === filters.status;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPositions.length / filters.per_page);
  const paginatedPositions = filteredPositions.slice(
    (filters.page - 1) * filters.per_page,
    filters.page * filters.per_page
  );

  // Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setFilters({ ...filters, page: 1 });
  };

  const handleFilterChange = (key: keyof PositionFilters, value: string) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleDelete = (position: Position) => {
    setSelectedPosition(position);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedPosition) return;
    // TODO: API call to delete position
    setPositions(positions.filter(p => p.id !== selectedPosition.id));
    setShowDeleteModal(false);
    setSelectedPosition(null);
  };

  const handleView = (position: Position) => {
    setSelectedPosition(position);
    setShowViewModal(true);
  };

  const handleEdit = (position: Position) => {
    navigate(`/admin/positions/${position.id}/edit`);
  };

  const getStatusBadge = (status: string) => {
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatSalary = (amount: number | null) => {
    if (amount === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Positions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage job positions and salary ranges
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/positions/create')}
          className="inline-flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg shadow-sm bg-primary-600 hover:bg-primary-700"
        >
          <PlusIcon className="w-5 h-5" />
          Create Position
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BriefcaseIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Positions</p>
              <p className="text-xl font-bold text-gray-900">{positions.length}</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckBadgeIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-xl font-bold text-gray-900">
                {positions.filter(p => p.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BuildingOfficeIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Departments</p>
              <p className="text-xl font-bold text-gray-900">
                {new Set(positions.map(p => p.department_id)).size}
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <UsersIcon className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Employees</p>
              <p className="text-xl font-bold text-gray-900">
                {positions.reduce((sum, p) => sum + (p.employees_count || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search positions by title or code..."
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
              setFilters({ search: '', department_id: '', status: '', page: 1, per_page: 10 });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-500 transition-colors hover:text-gray-700"
          >
            <ArrowPathIcon className="w-5 h-5" />
            <span className="text-sm">Reset</span>
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 gap-4 pt-4 mt-4 border-t border-gray-200 sm:grid-cols-3">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Department</label>
              <select
                value={filters.department_id}
                onChange={(e) => handleFilterChange('department_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
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
              <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
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

      {/* Positions Table */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Position
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Code
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Department
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Salary Range
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Employees
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
              {paginatedPositions.map((position) => (
                <tr key={position.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center flex-shrink-0 rounded-lg h-9 w-9 bg-primary-100">
                        <BriefcaseIcon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{position.title}</p>
                        {position.description && (
                          <p className="max-w-xs text-xs text-gray-500 truncate">
                            {position.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {position.code}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {position.department?.name || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <CurrencyDollarIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {position.min_salary ? formatSalary(position.min_salary) : 'N/A'}
                        {position.max_salary && ` - ${formatSalary(position.max_salary)}`}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <UsersIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{position.employees_count || 0}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(position.status)}`}>
                      {position.status === 'active' ? (
                        <CheckBadgeIcon className="w-3 h-3" />
                      ) : (
                        <XMarkIcon className="w-3 h-3" />
                      )}
                      {position.status.charAt(0).toUpperCase() + position.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleView(position)}
                        className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                        title="View"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(position)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(position)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete"
                        disabled={position.employees_count > 0}
                      >
                        <TrashIcon className={`h-4 w-4 ${position.employees_count > 0 ? 'opacity-50 cursor-not-allowed' : ''}`} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {paginatedPositions.length === 0 && (
          <div className="py-12 text-center">
            <BriefcaseIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900">No positions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or create a new position
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Showing {paginatedPositions.length > 0 ? (filters.page - 1) * filters.per_page + 1 : 0} to{' '}
              {Math.min(filters.page * filters.per_page, filteredPositions.length)} of {filteredPositions.length} positions
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
          VIEW POSITION MODAL
          ========================================== */}
      {showViewModal && selectedPosition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary-100">
                  <BriefcaseIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedPosition.title}</h3>
                  <p className="text-sm text-gray-500">{selectedPosition.code}</p>
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
              <div>
                <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Description</label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedPosition.description || 'No description provided'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Department</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPosition.department?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Status</label>
                  <p className="mt-1">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedPosition.status)}`}>
                      {selectedPosition.status === 'active' ? (
                        <CheckBadgeIcon className="w-3 h-3" />
                      ) : (
                        <XMarkIcon className="w-3 h-3" />
                      )}
                      {selectedPosition.status.charAt(0).toUpperCase() + selectedPosition.status.slice(1)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Min Salary</label>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {selectedPosition.min_salary ? formatSalary(selectedPosition.min_salary) : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Max Salary</label>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {selectedPosition.max_salary ? formatSalary(selectedPosition.max_salary) : 'N/A'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Total Employees</label>
                <p className="mt-1 text-sm font-medium text-gray-900">{selectedPosition.employees_count || 0}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Created</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedPosition.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Last Updated</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedPosition.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
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
                  handleEdit(selectedPosition);
                }}
                className="px-4 py-2 text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
              >
                Edit Position
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          DELETE CONFIRMATION MODAL
          ========================================== */}
      {showDeleteModal && selectedPosition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white shadow-lg rounded-xl">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-center text-gray-900">
                Delete Position
              </h3>
              <p className="text-sm text-center text-gray-500">
                Are you sure you want to delete <span className="font-medium text-gray-900">{selectedPosition.title}</span>?
                {selectedPosition.employees_count > 0 && (
                  <span className="block mt-2 text-red-600">
                    ⚠️ This position has {selectedPosition.employees_count} employee(s). Delete will unassign them from this position.
                  </span>
                )}
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
                  Delete Position
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Positions;