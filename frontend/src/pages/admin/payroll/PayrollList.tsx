import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilSquareIcon,
  CheckBadgeIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserGroupIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  BanknotesIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import type { Payroll, PayrollFilters, PayrollStats } from '../../../types/payroll.types';

// Mock data - Replace with API calls
const mockPayrolls: Payroll[] = [
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
    payroll_month: '2024-12-01',
    basic_salary: 55000,
    hourly_rate: 312.50,
    total_work_days: 22,
    present_days: 20,
    absent_days: 2,
    leave_days: 0,
    overtime_hours: 2.5,
    overtime_rate: 1.5,
    overtime_amount: 1171.88,
    allowances: { housing: 8000, transport: 3000, meal: 2000, medical: 5000, performance: 3000 },
    total_allowances: 21000,
    deductions: { insurance: 2500, pension: 1100, loan: 2000 },
    total_deductions: 5600,
    gross_salary: 77171.88,
    net_salary: 71571.88,
    payment_method: 'bank_transfer',
    bank_name: 'ABC Bank',
    bank_account: '1234567890',
    payment_status: 'pending',
    payment_date: null,
    notes: null,
    created_by: 1,
    creator: { id: 1, name: 'Admin' },
    approved_by: null,
    approver: null,
    approved_at: null,
    created_at: '2024-12-25T10:00:00.000000Z',
    updated_at: '2024-12-25T10:00:00.000000Z',
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
    payroll_month: '2024-12-01',
    basic_salary: 40000,
    hourly_rate: 227.27,
    total_work_days: 22,
    present_days: 22,
    absent_days: 0,
    leave_days: 0,
    overtime_hours: 0,
    overtime_rate: 1.5,
    overtime_amount: 0,
    allowances: { housing: 5000, transport: 2000, meal: 1500, medical: 3000 },
    total_allowances: 11500,
    deductions: { insurance: 2000, pension: 800 },
    total_deductions: 2800,
    gross_salary: 51500,
    net_salary: 48700,
    payment_method: 'bank_transfer',
    bank_name: 'XYZ Bank',
    bank_account: '9876543210',
    payment_status: 'processing',
    payment_date: null,
    notes: null,
    created_by: 1,
    creator: { id: 1, name: 'Admin' },
    approved_by: 1,
    approver: { id: 1, name: 'Admin' },
    approved_at: '2024-12-26T09:00:00.000000Z',
    created_at: '2024-12-25T10:00:00.000000Z',
    updated_at: '2024-12-26T09:00:00.000000Z',
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
    payroll_month: '2024-12-01',
    basic_salary: 48000,
    hourly_rate: 272.73,
    total_work_days: 22,
    present_days: 18,
    absent_days: 0,
    leave_days: 4,
    overtime_hours: 0,
    overtime_rate: 1.5,
    overtime_amount: 0,
    allowances: { housing: 6000, transport: 2500, meal: 1500, medical: 4000 },
    total_allowances: 14000,
    deductions: { insurance: 2200, pension: 960 },
    total_deductions: 3160,
    gross_salary: 62000,
    net_salary: 58840,
    payment_method: 'bank_transfer',
    bank_name: 'ABC Bank',
    bank_account: '5555555555',
    payment_status: 'paid',
    payment_date: '2024-12-28',
    notes: null,
    created_by: 1,
    creator: { id: 1, name: 'Admin' },
    approved_by: 1,
    approver: { id: 1, name: 'Admin' },
    approved_at: '2024-12-27T10:00:00.000000Z',
    created_at: '2024-12-25T10:00:00.000000Z',
    updated_at: '2024-12-28T09:00:00.000000Z',
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
    payroll_month: '2024-12-01',
    basic_salary: 58000,
    hourly_rate: 329.55,
    total_work_days: 22,
    present_days: 21,
    absent_days: 0,
    leave_days: 1,
    overtime_hours: 0,
    overtime_rate: 1.5,
    overtime_amount: 0,
    allowances: { housing: 7000, transport: 3500, meal: 2500, medical: 6000 },
    total_allowances: 19000,
    deductions: { insurance: 2800, pension: 1160 },
    total_deductions: 3960,
    gross_salary: 77000,
    net_salary: 73040,
    payment_method: null,
    bank_name: null,
    bank_account: null,
    payment_status: 'pending',
    payment_date: null,
    notes: null,
    created_by: 1,
    creator: { id: 1, name: 'Admin' },
    approved_by: null,
    approver: null,
    approved_at: null,
    created_at: '2024-12-25T10:00:00.000000Z',
    updated_at: '2024-12-25T10:00:00.000000Z',
  },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  processing: 'Processing',
  paid: 'Paid',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
};

const statusIcons: Record<string, any> = {
  pending: ClockIcon,
  processing: ArrowPathIcon,
  paid: CheckBadgeIcon,
  rejected: XMarkIcon,
  cancelled: XMarkIcon,
};

export const PayrollList: React.FC = () => {
  const navigate = useNavigate();
  const [payrolls, setPayrolls] = useState<Payroll[]>(mockPayrolls);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<PayrollFilters>({
    employee_id: '',
    month: '',
    year: '',
    status: '',
    search: '',
    page: 1,
    per_page: 10,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'pay' | 'reject' | 'cancel'>('approve');
  const [paymentData, setPaymentData] = useState({
    payment_method: 'bank_transfer' as const,
    bank_name: '',
    bank_account: '',
    payment_date: '',
  });

  // Calculate stats
  const stats: PayrollStats = {
    total_payrolls: payrolls.length,
    total_amount: payrolls.reduce((sum, p) => sum + p.net_salary, 0),
    pending: payrolls.filter(p => p.payment_status === 'pending').length,
    processing: payrolls.filter(p => p.payment_status === 'processing').length,
    paid: payrolls.filter(p => p.payment_status === 'paid').length,
    rejected: payrolls.filter(p => p.payment_status === 'rejected').length,
    cancelled: payrolls.filter(p => p.payment_status === 'cancelled').length,
    this_month_total: payrolls
      .filter(p => p.payroll_month.startsWith('2024-12'))
      .reduce((sum, p) => sum + p.net_salary, 0),
    this_month_employees: payrolls.filter(p => p.payroll_month.startsWith('2024-12')).length,
  };

  // Filter payrolls
  const filteredPayrolls = payrolls.filter((p) => {
    const employeeName = p.employee?.name?.toLowerCase() || '';
    const matchesSearch = employeeName.includes(searchTerm.toLowerCase()) ||
      (p.employee?.employee_code?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesEmployee = !filters.employee_id || p.employee_id === parseInt(filters.employee_id);
    const matchesStatus = !filters.status || p.payment_status === filters.status;
    
    let matchesMonth = true;
    if (filters.month) {
      matchesMonth = new Date(p.payroll_month).getMonth() === parseInt(filters.month) - 1;
    }
    let matchesYear = true;
    if (filters.year) {
      matchesYear = new Date(p.payroll_month).getFullYear() === parseInt(filters.year);
    }
    
    return matchesSearch && matchesEmployee && matchesStatus && matchesMonth && matchesYear;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPayrolls.length / filters.per_page);
  const paginatedPayrolls = filteredPayrolls.slice(
    (filters.page - 1) * filters.per_page,
    filters.page * filters.per_page
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setFilters({ ...filters, page: 1 });
  };

  const handleFilterChange = (key: keyof PayrollFilters, value: string) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleView = (payroll: Payroll) => {
    setSelectedPayroll(payroll);
    setShowViewModal(true);
  };

  const handleAction = (payroll: Payroll, action: 'approve' | 'pay' | 'reject' | 'cancel') => {
    setSelectedPayroll(payroll);
    setActionType(action);
    if (action === 'pay') {
      setPaymentData({
        payment_method: 'bank_transfer',
        bank_name: payroll.bank_name || '',
        bank_account: payroll.bank_account || '',
        payment_date: new Date().toISOString().split('T')[0],
      });
    }
    setShowActionModal(true);
  };

  const confirmAction = async () => {
    if (!selectedPayroll) return;
    
    setLoading(true);
    try {
      // TODO: API call based on action type
      const updatedPayrolls = payrolls.map(p => {
        if (p.id === selectedPayroll.id) {
          let updated = { ...p };
          switch (actionType) {
            case 'approve':
              updated.payment_status = 'processing';
              updated.approved_by = 1;
              updated.approver = { id: 1, name: 'Admin' };
              updated.approved_at = new Date().toISOString();
              break;
            case 'pay':
              updated.payment_status = 'paid';
              updated.payment_method = paymentData.payment_method;
              updated.bank_name = paymentData.bank_name;
              updated.bank_account = paymentData.bank_account;
              updated.payment_date = paymentData.payment_date;
              break;
            case 'reject':
              updated.payment_status = 'rejected';
              break;
            case 'cancel':
              updated.payment_status = 'cancelled';
              break;
          }
          return updated;
        }
        return p;
      });
      setPayrolls(updatedPayrolls);
      setShowActionModal(false);
      setSelectedPayroll(null);
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (payroll: Payroll) => {
    // TODO: Download payslip PDF
    console.log('Downloading payslip for payroll:', payroll.id);
  };

  const getStatusBadge = (status: string) => {
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const Icon = statusIcons[status] || ClockIcon;
    return <Icon className="w-3 h-3" />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getMonthYear = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage payroll and payslips
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/payroll/generate')}
            className="inline-flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg shadow-sm bg-primary-600 hover:bg-primary-700"
          >
            <CurrencyDollarIcon className="w-5 h-5" />
            Generate Payroll
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4 lg:grid-cols-7">
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-xl font-bold text-gray-900">{stats.total_payrolls}</p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <ClockIcon className="w-4 h-4 text-yellow-500" />
            <p className="text-xs text-gray-500">Pending</p>
          </div>
          <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <ArrowPathIcon className="w-4 h-4 text-blue-500" />
            <p className="text-xs text-gray-500">Processing</p>
          </div>
          <p className="text-xl font-bold text-blue-600">{stats.processing}</p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <CheckBadgeIcon className="w-4 h-4 text-green-500" />
            <p className="text-xs text-gray-500">Paid</p>
          </div>
          <p className="text-xl font-bold text-green-600">{stats.paid}</p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <BanknotesIcon className="w-4 h-4 text-gray-500" />
            <p className="text-xs text-gray-500">Amount</p>
          </div>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(stats.total_amount)}</p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-xs text-gray-500">This Month</p>
          <p className="text-xl font-bold text-primary-600">{formatCurrency(stats.this_month_total)}</p>
        </div>
        <div className="p-3 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-xs text-gray-500">Employees</p>
          <p className="text-xl font-bold text-gray-900">{stats.this_month_employees}</p>
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
              setFilters({ employee_id: '', month: '', year: '', status: '', search: '', page: 1, per_page: 10 });
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
                <option value="processing">Processing</option>
                <option value="paid">Paid</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Month</label>
              <select
                value={filters.month}
                onChange={(e) => handleFilterChange('month', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Months</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {new Date(2024, m - 1, 1).toLocaleDateString('en-US', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Year</label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Years</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
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

      {/* Payroll Table */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Employee
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Month
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                  Basic
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                  Allowances
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                  Deductions
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                  Net
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
              {paginatedPayrolls.map((payroll) => (
                <tr key={payroll.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100">
                        <span className="text-xs font-medium text-primary-700">
                          {payroll.employee?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{payroll.employee?.name}</p>
                        <p className="text-xs text-gray-500">{payroll.employee?.employee_code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-sm text-gray-900">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      {getMonthYear(payroll.payroll_month)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">
                    {formatCurrency(payroll.basic_salary)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">
                    {formatCurrency(payroll.total_allowances)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-red-600">
                    {formatCurrency(payroll.total_deductions)}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-right text-primary-600">
                    {formatCurrency(payroll.net_salary)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(payroll.payment_status)}`}>
                      {getStatusIcon(payroll.payment_status)}
                      {statusLabels[payroll.payment_status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleView(payroll)}
                        className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                        title="View"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(payroll)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Download Payslip"
                      >
                        <DocumentArrowDownIcon className="w-4 h-4" />
                      </button>
                      {payroll.payment_status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAction(payroll, 'approve')}
                            className="p-1.5 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                            title="Approve"
                          >
                            <CheckBadgeIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAction(payroll, 'reject')}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="Reject"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {payroll.payment_status === 'processing' && (
                        <button
                          onClick={() => handleAction(payroll, 'pay')}
                          className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Mark as Paid"
                        >
                          <CurrencyDollarIcon className="w-4 h-4" />
                        </button>
                      )}
                      {(payroll.payment_status === 'pending' || payroll.payment_status === 'processing') && (
                        <button
                          onClick={() => handleAction(payroll, 'cancel')}
                          className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Cancel"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {paginatedPayrolls.length === 0 && (
          <div className="py-12 text-center">
            <CurrencyDollarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900">No payroll records found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or generate payroll
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Showing {paginatedPayrolls.length > 0 ? (filters.page - 1) * filters.per_page + 1 : 0} to{' '}
              {Math.min(filters.page * filters.per_page, filteredPayrolls.length)} of {filteredPayrolls.length} records
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
          VIEW PAYROLL MODAL
          ========================================== */}
      {showViewModal && selectedPayroll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-100">
                  <DocumentTextIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Payroll Details</h3>
                  <p className="text-sm text-gray-500">
                    {getMonthYear(selectedPayroll.payroll_month)}
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
              {/* Employee Info */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100">
                  <UserGroupIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{selectedPayroll.employee?.name}</p>
                  <p className="text-xs text-gray-500">{selectedPayroll.employee?.employee_code}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Department</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPayroll.employee?.department?.name}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Position</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPayroll.employee?.position?.title}</p>
                </div>
              </div>

              {/* Salary Breakdown */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="mb-3 text-sm font-semibold text-gray-900">Salary Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Basic Salary</span>
                    <span className="font-medium text-gray-900">{formatCurrency(selectedPayroll.basic_salary)}</span>
                  </div>
                  {selectedPayroll.allowances && Object.entries(selectedPayroll.allowances).map(([key, value]) => (
                    <div key={key} className="flex justify-between pl-4 text-sm">
                      <span className="text-gray-500">- {key.charAt(0).toUpperCase() + key.slice(1)}</span>
                      <span className="text-gray-700">{formatCurrency(value)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-medium text-green-600">
                    <span>Total Allowances</span>
                    <span>{formatCurrency(selectedPayroll.total_allowances)}</span>
                  </div>
                  {selectedPayroll.overtime_hours > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Overtime ({selectedPayroll.overtime_hours}h @ {selectedPayroll.overtime_rate}x)</span>
                      <span className="text-blue-600">{formatCurrency(selectedPayroll.overtime_amount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 text-sm font-bold text-gray-900 border-t border-gray-100">
                    <span>Gross Salary</span>
                    <span>{formatCurrency(selectedPayroll.gross_salary)}</span>
                  </div>
                  {selectedPayroll.deductions && Object.entries(selectedPayroll.deductions).map(([key, value]) => (
                    <div key={key} className="flex justify-between pl-4 text-sm">
                      <span className="text-gray-500">- {key.charAt(0).toUpperCase() + key.slice(1)}</span>
                      <span className="text-red-600">-{formatCurrency(value)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-medium text-red-600">
                    <span>Total Deductions</span>
                    <span>-{formatCurrency(selectedPayroll.total_deductions)}</span>
                  </div>
                  <div className="flex justify-between pt-2 text-lg font-bold border-t border-gray-200 text-primary-600">
                    <span>Net Salary</span>
                    <span>{formatCurrency(selectedPayroll.net_salary)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="mb-3 text-sm font-semibold text-gray-900">Payment Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Status</label>
                    <p className="mt-1">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedPayroll.payment_status)}`}>
                        {getStatusIcon(selectedPayroll.payment_status)}
                        {statusLabels[selectedPayroll.payment_status]}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Payment Method</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedPayroll.payment_method ? selectedPayroll.payment_method.replace('_', ' ').toUpperCase() : 'N/A'}
                    </p>
                  </div>
                </div>
                {selectedPayroll.payment_status === 'paid' && selectedPayroll.payment_date && (
                  <div className="mt-2">
                    <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Payment Date</label>
                    <p className="mt-1 text-sm text-gray-900">{new Date(selectedPayroll.payment_date).toLocaleDateString()}</p>
                  </div>
                )}
                {selectedPayroll.approved_by && (
                  <div className="mt-2">
                    <label className="block text-xs font-medium tracking-wider text-gray-500 uppercase">Approved By</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPayroll.approver?.name}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => handleDownload(selectedPayroll)}
                className="flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
              >
                <DocumentArrowDownIcon className="w-4 h-4" />
                Download Payslip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          ACTION MODAL (Approve/Pay/Reject/Cancel)
          ========================================== */}
      {showActionModal && selectedPayroll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white shadow-lg rounded-xl">
            <div className="p-6">
              <div className={`flex items-center justify-center mb-4 ${
                actionType === 'approve' ? 'text-green-600' :
                actionType === 'pay' ? 'text-blue-600' :
                actionType === 'reject' ? 'text-red-600' : 'text-gray-600'
              }`}>
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                  actionType === 'approve' ? 'bg-green-100' :
                  actionType === 'pay' ? 'bg-blue-100' :
                  actionType === 'reject' ? 'bg-red-100' : 'bg-gray-100'
                }`}>
                  {actionType === 'approve' && <CheckBadgeIcon className="w-6 h-6" />}
                  {actionType === 'pay' && <CurrencyDollarIcon className="w-6 h-6" />}
                  {actionType === 'reject' && <XMarkIcon className="w-6 h-6" />}
                  {actionType === 'cancel' && <XMarkIcon className="w-6 h-6" />}
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-center text-gray-900">
                {actionType === 'approve' ? 'Approve Payroll' :
                 actionType === 'pay' ? 'Process Payment' :
                 actionType === 'reject' ? 'Reject Payroll' : 'Cancel Payroll'}
              </h3>
              <p className="text-sm text-center text-gray-500">
                {actionType === 'approve' && `Are you sure you want to approve ${selectedPayroll.employee?.name}'s payroll?`}
                {actionType === 'pay' && `Are you sure you want to mark ${selectedPayroll.employee?.name}'s payroll as paid?`}
                {actionType === 'reject' && `Are you sure you want to reject ${selectedPayroll.employee?.name}'s payroll?`}
                {actionType === 'cancel' && `Are you sure you want to cancel ${selectedPayroll.employee?.name}'s payroll?`}
              </p>

              {actionType === 'pay' && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Payment Method</label>
                    <select
                      value={paymentData.payment_method}
                      onChange={(e) => setPaymentData({ ...paymentData, payment_method: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="cash">Cash</option>
                      <option value="check">Check</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Bank Name</label>
                    <input
                      type="text"
                      value={paymentData.bank_name}
                      onChange={(e) => setPaymentData({ ...paymentData, bank_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Bank name"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Bank Account</label>
                    <input
                      type="text"
                      value={paymentData.bank_account}
                      onChange={(e) => setPaymentData({ ...paymentData, bank_account: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Bank account number"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Payment Date</label>
                    <input
                      type="date"
                      value={paymentData.payment_date}
                      onChange={(e) => setPaymentData({ ...paymentData, payment_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setShowActionModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  disabled={loading}
                  className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                    actionType === 'pay' ? 'bg-blue-600 hover:bg-blue-700' :
                    actionType === 'reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {loading ? 'Processing...' :
                    actionType === 'approve' ? 'Approve' :
                    actionType === 'pay' ? 'Pay' :
                    actionType === 'reject' ? 'Reject' : 'Cancel'
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollList;