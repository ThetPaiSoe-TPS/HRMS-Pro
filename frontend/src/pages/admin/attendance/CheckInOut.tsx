import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ClockIcon,
  CheckBadgeIcon,
  XMarkIcon,
  UserIcon,
  MapPinIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../hooks/useAuth';

// Mock employee data - Replace with API call
const mockEmployee = {
  id: 1,
  name: 'John Doe',
  employee_code: 'EMP001',
  department: 'Engineering',
  position: 'Senior Developer',
};

export const CheckInOut: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [location, setLocation] = useState<string>('Office');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Mock attendance status - Replace with API call
  useEffect(() => {
    // Check if already checked in today
    const today = new Date().toISOString().split('T')[0];
    // Mock: assume not checked in
    setIsCheckedIn(false);
  }, []);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleCheckIn = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // TODO: API call to check in
      // const response = await api.post('/attendance/check-in', {
      //   employee_id: user?.employee_id,
      //   location: location,
      //   notes: notes,
      // });
      
      // Mock successful check-in
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCheckInTime(getCurrentTime());
      setIsCheckedIn(true);
      setSuccess(`Checked in successfully at ${getCurrentTime()}`);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to check in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // TODO: API call to check out
      // const response = await api.post('/attendance/check-out', {
      //   notes: notes,
      // });
      
      // Mock successful check-out
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCheckOutTime(getCurrentTime());
      setIsCheckedIn(false);
      setSuccess(`Checked out successfully at ${getCurrentTime()}`);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to check out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-2xl p-4 mx-auto sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/attendance" className="p-2 transition-colors rounded-lg hover:bg-gray-100">
          <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Check In / Check Out</h1>
          <p className="mt-1 text-sm text-gray-500">
            Record your daily attendance
          </p>
        </div>
      </div>

      {/* Employee Card */}
      <div className="p-6 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center rounded-full h-14 w-14 bg-primary-100">
            <span className="text-xl font-bold text-primary-700">
              {mockEmployee.name.charAt(0)}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{mockEmployee.name}</h2>
            <p className="text-sm text-gray-500">{mockEmployee.employee_code}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-gray-500">{mockEmployee.department}</span>
              <span className="text-xs text-gray-300">•</span>
              <span className="text-xs text-gray-500">{mockEmployee.position}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Date & Time */}
      <div className="p-6 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Today</p>
            <p className="text-lg font-semibold text-gray-900">{getCurrentDate()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Current Time</p>
            <p className="text-lg font-semibold text-gray-900">{getCurrentTime()}</p>
          </div>
        </div>
      </div>

      {/* Status Display */}
      <div className="p-6 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <div className="flex items-center gap-2 mt-1">
              {isCheckedIn ? (
                <>
                  <CheckBadgeIcon className="w-5 h-5 text-green-500" />
                  <span className="text-lg font-semibold text-green-600">Checked In</span>
                </>
              ) : (
                <>
                  <XMarkIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-lg font-semibold text-gray-600">Not Checked In</span>
                </>
              )}
            </div>
          </div>
          {checkInTime && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Check In Time</p>
              <p className="text-sm font-medium text-gray-900">{checkInTime}</p>
            </div>
          )}
          {checkOutTime && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Check Out Time</p>
              <p className="text-sm font-medium text-gray-900">{checkOutTime}</p>
            </div>
          )}
        </div>

        {!isCheckedIn && checkOutTime && (
          <div className="p-3 mt-3 border border-yellow-200 rounded-lg bg-yellow-50">
            <p className="text-sm text-yellow-700">
              You have checked out for the day. You can check in again tomorrow.
            </p>
          </div>
        )}
      </div>

      {/* Check In/Out Form */}
      <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
        {error && (
          <div className="flex items-start gap-3 p-3 mb-4 border border-red-200 rounded-lg bg-red-50">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 p-3 mb-4 border border-green-200 rounded-lg bg-green-50">
            <CheckBadgeIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Location */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              <div className="flex items-center gap-1.5">
                <MapPinIcon className="w-4 h-4 text-gray-400" />
                Location
              </div>
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              disabled={loading}
            >
              <option value="Office">🏢 Office</option>
              <option value="Remote">🏠 Remote</option>
              <option value="Client Site">📍 Client Site</option>
              <option value="Other">📌 Other</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              <div className="flex items-center gap-1.5">
                <DocumentTextIcon className="w-4 h-4 text-gray-400" />
                Notes (Optional)
              </div>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="Add any notes about your attendance..."
              disabled={loading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            {!isCheckedIn && !checkOutTime ? (
              <button
                onClick={handleCheckIn}
                disabled={loading}
                className="flex items-center justify-center flex-1 gap-2 px-4 py-3 text-sm font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Checking In...
                  </span>
                ) : (
                  <>
                    <ClockIcon className="w-5 h-5" />
                    Check In
                  </>
                )}
              </button>
            ) : isCheckedIn && !checkOutTime ? (
              <button
                onClick={handleCheckOut}
                disabled={loading}
                className="flex items-center justify-center flex-1 gap-2 px-4 py-3 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Checking Out...
                  </span>
                ) : (
                  <>
                    <XMarkIcon className="w-5 h-5" />
                    Check Out
                  </>
                )}
              </button>
            ) : (
              <div className="flex-1 py-3 text-sm font-medium text-center text-gray-500 bg-gray-100 rounded-lg">
                You have already checked out for today
              </div>
            )}

            <button
              type="button"
              onClick={() => navigate('/admin/attendance')}
              className="px-4 py-3 text-sm font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="p-4 mt-6 border border-blue-200 bg-blue-50 rounded-xl">
        <div className="flex items-start gap-3">
          <ClockIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-700">Attendance Policy</p>
            <ul className="mt-1 space-y-1 text-sm text-blue-600">
              <li>• Check-in time: 9:00 AM (Late entry after 9:15 AM marked as Late)</li>
              <li>• Check-out time: 6:00 PM</li>
              <li>• Minimum work hours: 8 hours</li>
              <li>• Overtime calculated after 8 hours</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckInOut;