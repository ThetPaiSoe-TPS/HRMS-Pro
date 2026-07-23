import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@heroicons/react/24/outline';
import type { Employee, EmployeeFilters } from '../../types/employee.types';

// Mock data - Replace with API calls
const mockDepartments = [
  { id: 1, name: 'Engineering', code: 'ENG' },
  { id: 2, name: 'Human Resources', code: 'HR' },
  { id: 3, name: 'Finance', code: 'FIN' },
  { id: 4, name: 'Marketing', code: 'MKT' },
  { id: 5, name: 'Operations', code: 'OPS' },
];

const mockPositions = [
  { id: 1, title: 'Senior Developer', code: 'SR-DEV' },
  { id: 2, title: 'Software Engineer', code: 'SWE' },
  { id: 3, title: 'Junior Developer', code: 'JR-DEV' },
  { id: 4, title: 'DevOps Engineer', code: 'DEVOPS' },
  { id: 5, title: 'HR Manager', code: 'HR-MGR' },
  { id: 6, title: 'Accountant', code: 'ACC' },
  { id: 7, title: 'Marketing Specialist', code: 'MKT-SPEC' },
];

const mockEmployees: Employee[] = [
  {
    id: 1,
    employee_code: 'EMP001',
    first_name: 'John',
    last_name: 'Doe',
    full_name: 'John Doe',
    email: 'john.doe@company.com',
    phone: '+1234567890',
    gender: 'male',
    date_of_birth: '1990-01-15',
    hire_date: '2020-01-01',
    department_id: 1,
    department: { id: 1, name: 'Engineering', code: 'ENG' },
    position_id: 1,
    position: { id: 1, title: 'Senior Developer', code: 'SR-DEV' },
    employment_status: 'active',
    profile_photo: null,
    created_at: '2024-01-01T00:00:00.000000Z',
    updated_at: '2024-01-01T00:00:00.000000Z',
  },
  {
    id: 2,
    employee_code: 'EMP002',
    first_name: 'Jane',
    last_name: 'Smith',
    full_name: 'Jane Smith',
    email: 'jane.smith@company.com',
    phone: '+1234567891',
    gender: 'female',
    date_of_birth: '1992-03-20',
    hire_date: '2020-06-15',
    department_id: 1,
    department: { id: 1, name: 'Engineering', code: 'ENG' },
    position_id: 2,
    position: { id: 2, title: 'Software Engineer', code: 'SWE' },
    employment_status: 'active',
    profile_photo: null,
    created_at: '2024-01-02T00:00:00.000000Z',
    updated_at: '2024-01-02T00:00:00.000000Z',
  },
  {
    id: 3,
    employee_code: 'EMP003',
    first_name: 'Robert',
    last_name: 'Johnson',
    full_name: 'Robert Johnson',
    email: 'robert.johnson@company.com',
    phone: '+1234567892',
    gender: 'male',
    date_of_birth: '1988-07-10',
    hire_date: '2021-03-01',
    department_id: 1,
    department: { id: 1, name: 'Engineering', code: 'ENG' },
    position_id: 4,
    position: { id: 4, title: 'DevOps Engineer', code: 'DEVOPS' },
    employment_status: 'active',
    profile_photo: null,
    created_at: '2024-01-03T00:00:00.000000Z',
    updated_at: '2024-01-03T00:00:00.000000Z',
  },
  {
    id: 4,
    employee_code: 'EMP004',
    first_name: 'Sarah',
    last_name: 'Williams',
    full_name: 'Sarah Williams',
    email: 'sarah.williams@company.com',
    phone: '+1234567893',
    gender: 'female',
    date_of_birth: '1985-11-05',
    hire_date: '2019-08-15',
    department_id: 2,
    department: { id: 2, name: 'Human Resources', code: 'HR' },
    position_id: 5,
    position: { id: 5, title: 'HR Manager', code: 'HR-MGR' },
    employment_status: 'active',
    profile_photo: null,
    created_at: '2024-01-04T00:00:00.000000Z',
    updated_at: '2024-01-04T00:00:00.000000Z',
  },
  {
    id: 5,
    employee_code: 'EMP005',
    first_name: 'Michael',
    last_name: 'Brown',
    full_name: 'Michael Brown',
    email: 'michael.brown@company.com',
    phone: '+1234567894',
    gender: 'male',
    date_of_birth: '1995-09-25',
    hire_date: '2024-06-01',
    department_id: 1,
    department: { id: 1, name: 'Engineering', code: 'ENG' },
    position_id: 3,
    position: { id: 3, title: 'Junior Developer', code: 'JR-DEV' },
    employment_status: 'resigned',
    profile_photo: null,
    created_at: '2024-01-05T00:00:00.000000Z',
    updated_at: '2024-01-05T00:00:00.000000Z',
  },
];

// Status badge colors
const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  resigned: 'bg-yellow-100 text-yellow-800',
  terminated: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  active: 'Active',
  resigned: 'Resigned',
  terminated: 'Terminated',
};

// Gender badge colors
const genderColors: Record<string, string> = {
  male: 'bg-blue-100 text-blue-800',
  female: 'bg-pink-100 text-pink-800',
  other: 'bg-purple-100 text-purple-800',
};

export const Employees: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [departments] = useState(mockDepartments);
  const [positions] = useState(mockPositions);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<EmployeeFilters>({
    search: '',
    department_id: '',
    position_id: '',
    employment_status: '',
    page: 1,
    per_page: 10,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
      emp.employee_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filters.department_id || emp.department_id === parseInt(filters.department_id);
    const matchesPosition = !filters.position_id || emp.position_id === parseInt(filters.position_id);
    const matchesStatus = !filters.employment_status || emp.employment_status === filters.employment_status;
    return matchesSearch && matchesDepartment && matchesPosition && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / filters.per_page);
  const paginatedEmployees = filteredEmployees.slice(
    (filters.page - 1) * filters.per_page,
    filters.page * filters.per_page
  );

  // Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setFilters({ ...filters, page: 1 });
  };

  const handleFilterChange = (key: keyof EmployeeFilters, value: string) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedEmployee) return;
    // TODO: API call to delete employee
    setEmployees(employees.filter(e => e.id !== selectedEmployee.id));
    setShowDeleteModal(false);
    setSelectedEmployee(null);
  };

  const handleView = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
  };

  const handleEdit = (employee: Employee) => {
    navigate(`/admin/employees/${employee.id}/edit`);
  };

  const getStatusBadge = (status: string) => {
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getGenderBadge = (gender: string) => {
    return genderColors[gender] || 'bg-gray-100 text-gray-800';
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRandomColor = (id: number) => {
    const colors = [
      'bg-blue-100 text-blue-700',
      'bg-green-100 text-green-700',
      'bg-purple-100 text-purple-700',
      'bg-pink-100 text-pink-700',
      'bg-yellow-100 text-yellow-700',
      'bg-indigo-100 text-indigo-700',
      'bg-red-100 text-red-700',
    ];
    return colors[id % colors.length];
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all employees and their information
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/employees/create')}
          className="inline-flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg shadow-sm bg-primary-600 hover:bg-primary-700"
        >
          <PlusIcon className="w-5 h-5" />
          Add Employee
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserGroupIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Employees</p>
              <p className="text-xl font-bold text-gray-900">{employees.length}</p>
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
                {employees.filter(e => e.employment_status === 'active').length}
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
              <p className="text-sm text-gray-500">Resigned</p>
              <p className="text-xl font-bold text-gray-900">
                {employees.filter(e => e.employment_status === 'resigned').length}
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XMarkIcon className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Terminated</p>
              <p className="text-xl font-bold text-gray-900">
                {employees.filter(e => e.employment_status === 'terminated').length}
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
              placeholder="Search employees by name, code, or email..."
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
              setFilters({ search: '', department_id: '', position_id: '', employment_status: '', page: 1, per_page: 10 });
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
              <label className="block mb-1 text-sm font-medium text-gray-700">Position</label>
              <select
                value={filters.position_id}
                onChange={(e) => handleFilterChange('position_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
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
              <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
              <select
                value={filters.employment_status}
                onChange={(e) => handleFilterChange('employment_status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="resigned">Resigned</option>
                <option value="terminated">Terminated</option>
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

      {/* Employees Table */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Employee
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Contact
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Department / Position
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Joined
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedEmployees.map((employee) => (
                <tr key={employee.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 ${getRandomColor(employee.id)}`}>
                        <span className="text-xs font-bold">
                          {getInitials(employee.first_name, employee.last_name)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{employee.full_name}</p>
                        <p className="text-xs text-gray-500">{employee.employee_code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <EnvelopeIcon className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm text-gray-600 truncate max-w-[150px]">{employee.email}</span>
                      </div>
                      {employee.phone && (
                        <div className="flex items-center gap-1.5">
                          <PhoneIcon className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm text-gray-600">{employee.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <BuildingOfficeIcon className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm text-gray-900">{employee.department?.name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BriefcaseIcon className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm text-gray-600">{employee.position?.title || 'N/A'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(employee.employment_status)}`}>
                        {employee.employment_status === 'active' ? (
                          <CheckBadgeIcon className="w-3 h-3" />
                        ) : employee.employment_status === 'resigned' ? (
                          <XMarkIcon className="w-3 h-3" />
                        ) : (
                          <XMarkIcon className="w-3 h-3" />
                        )}
                        {statusLabels[employee.employment_status]}
                      </span>
                      <span className={`inline-flex ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${getGenderBadge(employee.gender)}`}>
                        {employee.gender.charAt(0).toUpperCase() + employee.gender.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <CalendarIcon className="w-4 h-4" />
                      {new Date(employee.hire_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleView(employee)}
                        className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                        title="View"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(employee)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(employee)}
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
        {paginatedEmployees.length === 0 && (
          <div className="py-12 text-center">
            <UserGroupIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900">No employees found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or add a new employee
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Showing {paginatedEmployees.length > 0 ? (filters.page - 1) * filters.per_page + 1 : 0} to{' '}
              {Math.min(filters.page * filters.per_page, filteredEmployees.length)} of {filteredEmployees.length} employees
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
          VIEW EMPLOYEE MODAL
          ========================================== */}
      {showViewModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${getRandomColor(selectedEmployee.id)}`}>
                  <span className="text-lg font-bold">
                    {getInitials(selectedEmployee.first_name, selectedEmployee.last_name)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedEmployee.full_name}</h3>
                  <p className="text-sm text-gray-500">{selectedEmployee.employee_code}</p>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedEmployee.email}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedEmployee.phone || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Department</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedEmployee.department?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Position</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedEmployee.position?.title || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Date of Birth</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedEmployee.date_of_birth).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Hire Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedEmployee.hire_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Gender</label>
                  <p className="mt-1">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getGenderBadge(selectedEmployee.gender)}`}>
                      {selectedEmployee.gender.charAt(0).toUpperCase() + selectedEmployee.gender.slice(1)}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Status</label>
                  <p className="mt-1">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedEmployee.employment_status)}`}>
                      {selectedEmployee.employment_status === 'active' ? (
                        <CheckBadgeIcon className="w-3 h-3" />
                      ) : (
                        <XMarkIcon className="w-3 h-3" />
                      )}
                      {statusLabels[selectedEmployee.employment_status]}
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Created</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedEmployee.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Last Updated</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedEmployee.updated_at).toLocaleString()}
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
                  handleEdit(selectedEmployee);
                }}
                className="px-4 py-2 text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
              >
                Edit Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          DELETE CONFIRMATION MODAL
          ========================================== */}
      {showDeleteModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white shadow-lg rounded-xl">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-center text-gray-900">
                Delete Employee
              </h3>
              <p className="text-sm text-center text-gray-500">
                Are you sure you want to delete <span className="font-medium text-gray-900">{selectedEmployee.full_name}</span>?
                This action cannot be undone.
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