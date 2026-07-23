import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  CalendarIcon,
  CheckBadgeIcon,
  XMarkIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import type { LeaveType } from '../../../types/leave.types';

// Mock data - Replace with API calls
const mockLeaveTypes: LeaveType[] = [
  {
    id: 1,
    name: 'Annual Leave',
    code: 'ANNUAL',
    description: 'Regular paid annual leave',
    days_per_year: 20,
    is_paid: true,
    requires_approval: true,
    max_consecutive_days: 15,
    carry_forward: true,
    carry_forward_limit: 5,
    status: 'active',
    created_at: '2024-01-01T00:00:00.000000Z',
    updated_at: '2024-01-01T00:00:00.000000Z',
  },
  {
    id: 2,
    name: 'Sick Leave',
    code: 'SICK',
    description: 'Paid sick leave with medical certificate',
    days_per_year: 10,
    is_paid: true,
    requires_approval: true,
    max_consecutive_days: 5,
    carry_forward: false,
    carry_forward_limit: null,
    status: 'active',
    created_at: '2024-01-02T00:00:00.000000Z',
    updated_at: '2024-01-02T00:00:00.000000Z',
  },
  {
    id: 3,
    name: 'Personal Leave',
    code: 'PERSONAL',
    description: 'Personal emergency leave',
    days_per_year: 5,
    is_paid: true,
    requires_approval: true,
    max_consecutive_days: 3,
    carry_forward: false,
    carry_forward_limit: null,
    status: 'active',
    created_at: '2024-01-03T00:00:00.000000Z',
    updated_at: '2024-01-03T00:00:00.000000Z',
  },
  {
    id: 4,
    name: 'Maternity Leave',
    code: 'MATERNITY',
    description: 'Paid maternity leave',
    days_per_year: 90,
    is_paid: true,
    requires_approval: true,
    max_consecutive_days: 90,
    carry_forward: false,
    carry_forward_limit: null,
    status: 'active',
    created_at: '2024-01-04T00:00:00.000000Z',
    updated_at: '2024-01-04T00:00:00.000000Z',
  },
  {
    id: 5,
    name: 'Unpaid Leave',
    code: 'UNPAID',
    description: 'Unpaid leave for extended time off',
    days_per_year: 30,
    is_paid: false,
    requires_approval: true,
    max_consecutive_days: 30,
    carry_forward: false,
    carry_forward_limit: null,
    status: 'inactive',
    created_at: '2024-01-05T00:00:00.000000Z',
    updated_at: '2024-01-05T00:00:00.000000Z',
  },
];

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
};

export const LeaveTypes: React.FC = () => {
  const navigate = useNavigate();
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>(mockLeaveTypes);
  const [selectedType, setSelectedType] = useState<LeaveType | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = (type: LeaveType) => {
    setSelectedType(type);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!selectedType) return;
    // TODO: API call to delete leave type
    setLeaveTypes(leaveTypes.filter(t => t.id !== selectedType.id));
    setShowDeleteModal(false);
    setSelectedType(null);
  };

  const handleEdit = (type: LeaveType) => {
    navigate(`/admin/leave-types/${type.id}/edit`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Types</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure leave types and policies
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/leave-types/create')}
          className="inline-flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg shadow-sm bg-primary-600 hover:bg-primary-700"
        >
          <PlusIcon className="w-5 h-5" />
          Create Leave Type
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {leaveTypes.map((type) => (
          <div key={type.id} className="p-4 transition-shadow bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100">
                  <CalendarIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{type.name}</h3>
                  <p className="text-xs text-gray-500">{type.code}</p>
                </div>
              </div>
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[type.status]}`}>
                {type.status}
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{type.description}</p>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="p-2 text-center rounded-lg bg-gray-50">
                <p className="text-xs text-gray-500">Days/Year</p>
                <p className="text-sm font-semibold text-gray-900">{type.days_per_year}</p>
              </div>
              <div className="p-2 text-center rounded-lg bg-gray-50">
                <p className="text-xs text-gray-500">Paid</p>
                <p className="text-sm font-semibold text-gray-900">
                  {type.is_paid ? (
                    <CheckBadgeIcon className="w-4 h-4 mx-auto text-green-500" />
                  ) : (
                    <XMarkIcon className="w-4 h-4 mx-auto text-red-500" />
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                {type.carry_forward && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                    Carry Forward ({type.carry_forward_limit || 0})
                  </span>
                )}
                {type.max_consecutive_days && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                    Max {type.max_consecutive_days}d
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEdit(type)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(type)}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && selectedType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white shadow-lg rounded-xl">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-center text-gray-900">
                Delete Leave Type
              </h3>
              <p className="text-sm text-center text-gray-500">
                Are you sure you want to delete <span className="font-medium text-gray-900">{selectedType.name}</span>?
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