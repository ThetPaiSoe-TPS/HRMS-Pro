import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  CalendarIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  PaperClipIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import { leaveApi, leaveTypeApi } from "../../../api/leave/leaveApi";
import type {
  LeaveType,
  LeaveRequestFormData,
} from "../../../types/leave.types";
import { getStorageUrl } from "../../../api/axios";
import { employeeApi } from "../../../api/employee/employeeApi";

export const ApplyLeave: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [employee, setEmployee] = useState<any>(null);

  const [formData, setFormData] = useState<LeaveRequestFormData>({
    leave_type_id: 0,
    start_date: "",
    end_date: "",
    reason: "",
    attachment: null,
  });

  const getPhotoUrl = (photo: string | null): string | null => {
    return getStorageUrl(photo);
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
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
      "bg-teal-100 text-teal-700",
      "bg-orange-100 text-orange-700",
      "bg-cyan-100 text-cyan-700",
    ];
    return colors[id % colors.length];
  };

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const result = await employeeApi.getEmployees({
          search: "",
          department_id: "",
          position_id: "",
          status: "active",
          page: 1,
          per_page: 1,
        });
        if (result.data.length > 0) {
          setEmployee(result.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch employee:", error);
      }
    };
    fetchEmployee();
  }, []);
  // Fetch leave types
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const result = await leaveTypeApi.getActiveLeaveTypes();
        setLeaveTypes(result);
      } catch (error) {
        console.error("Failed to fetch leave types:", error);
      }
    };
    fetchLeaveTypes();
  }, []);

  // Calculate days when date changes
  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (end >= start) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        // You can display this somewhere
        console.log("Days:", diffDays);
      }
    }
  }, [formData.start_date, formData.end_date]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          attachment: "File size should be less than 5MB",
        });
        return;
      }
      setFormData({ ...formData, attachment: file });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.leave_type_id || formData.leave_type_id === 0) {
      newErrors.leave_type_id = "Please select a leave type";
    }
    if (!formData.start_date) {
      newErrors.start_date = "Start date is required";
    }
    if (!formData.end_date) {
      newErrors.end_date = "End date is required";
    }
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (end < start) {
        newErrors.end_date = "End date must be after start date";
      }
    }
    if (!formData.reason.trim()) {
      newErrors.reason = "Reason is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await leaveApi.createLeaveRequest(formData);
      navigate("/admin/leaves");
    } catch (error: any) {
      setErrors({
        general:
          error.response?.data?.message || "Failed to create leave request",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get selected leave type details
  const selectedLeaveType = leaveTypes.find(
    (t) => t.id === formData.leave_type_id,
  );

  return (
    <div className="max-w-2xl p-4 mx-auto sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/admin/leaves"
          className="p-2 transition-colors rounded-lg hover:bg-gray-100"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Apply for Leave</h1>
          <p className="mt-1 text-sm text-gray-500">
            Submit a new leave request
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
        {/* Employee Card with Photo */}
        {employee && (
          <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
            <div className="flex items-center gap-3">
              {employee.photo ? (
                <img
                  src={getPhotoUrl(employee.photo)}
                  alt={employee.name}
                  className="flex-shrink-0 object-cover w-12 h-12 rounded-full"
                />
              ) : (
                <div
                  className={`flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full ${getRandomColor(employee.id)}`}
                >
                  <span className="text-base font-medium">
                    {getInitials(employee.name)}
                  </span>
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {employee.name}
                </p>
                <p className="text-xs text-gray-500">
                  {employee.employee_code}
                </p>
                <p className="text-xs text-gray-400">
                  {employee.department?.name || "No Department"} •{" "}
                  {employee.position?.title || "No Position"}
                </p>
              </div>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="p-3 border border-red-200 rounded-lg bg-red-50">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Leave Type */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Leave Type *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <BriefcaseIcon className="w-5 h-5 text-gray-400" />
              </div>
              <select
                name="leave_type_id"
                value={formData.leave_type_id || ""}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                  errors.leave_type_id ? "border-red-300" : "border-gray-300"
                }`}
              >
                <option value="">Select leave type</option>
                {leaveTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name} ({type.days_per_year} days/year)
                  </option>
                ))}
              </select>
            </div>
            {errors.leave_type_id && (
              <p className="mt-1 text-sm text-red-600">
                {errors.leave_type_id}
              </p>
            )}
            {selectedLeaveType && (
              <p className="mt-1 text-xs text-gray-500">
                Available: {selectedLeaveType.days_per_year} days per year
              </p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Start Date *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    errors.start_date ? "border-red-300" : "border-gray-300"
                  }`}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              {errors.start_date && (
                <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                End Date *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                    errors.end_date ? "border-red-300" : "border-gray-300"
                  }`}
                  min={
                    formData.start_date ||
                    new Date().toISOString().split("T")[0]
                  }
                />
              </div>
              {errors.end_date && (
                <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
              )}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Reason *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <DocumentTextIcon className="w-5 h-5 text-gray-400" />
              </div>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={4}
                className={`w-full py-2 pl-10 pr-3 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                  errors.reason ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Describe the reason for your leave..."
              />
            </div>
            {errors.reason && (
              <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
            )}
          </div>

          {/* Attachment */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Attachment (Optional)
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <PaperClipIcon className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">Upload File</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {formData.attachment && (
                <span className="text-sm text-gray-600">
                  {formData.attachment.name}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Max file size: 5MB. Allowed: PDF, DOC, DOCX, JPG, PNG
            </p>
            {errors.attachment && (
              <p className="mt-1 text-sm text-red-600">{errors.attachment}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/admin/leaves")}
              className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit Request"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;
