import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  PencilSquareIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  CheckBadgeIcon,
  XMarkIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import type { Employee } from "../../types/employee.types";
import { employeeApi } from "../../api/employeeApi";
import { getStorageUrl } from "../../api/axios";

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

const getRandomColor = (id: number) => {
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

const getGenderLabel = (gender: string | null) => {
  if (!gender) return "N/A";
  return gender.charAt(0).toUpperCase() + gender.slice(1);
};

const EmployeeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    employeeApi
      .getEmployee(Number(id))
      .then(setEmployee)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!employee) return;
    try {
      await employeeApi.deleteEmployee(employee.id);
      navigate("/admin/employees");
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary-600"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="py-16 text-center">
        <UserIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Employee not found
        </h3>
        <Link
          to="/admin/employees"
          className="inline-block mt-2 text-sm text-primary-600 hover:underline"
        >
          Back to Employees
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl p-4 mx-auto sm:p-6 lg:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/admin/employees"
          className="p-2 transition-colors rounded-lg hover:bg-gray-100"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 dark:text-gray-500" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Employee Detail</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
            View employee information
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/admin/employees/${employee.id}/edit`)}
            className="inline-flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
          >
            <PencilSquareIcon className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-red-600 transition-colors border border-red-300 rounded-lg hover:bg-red-50"
          >
            <TrashIcon className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
        <div className="flex items-center gap-4 pb-6 mb-6 border-b border-gray-200 dark:border-gray-700">
          {employee.photo ? (
            <img
              src={getPhotoUrl(employee.photo) ?? ""}
              alt={employee.name}
              className="object-cover w-16 h-16 rounded-full"
            />
          ) : (
            <div
              className={`h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold ${getRandomColor(employee.id)}`}
            >
              {getInitials(employee.name)}
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {employee.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{employee.employee_code}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
              Email
            </label>
            <div className="flex items-center gap-2 mt-1">
              <EnvelopeIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <p className="text-sm text-gray-900 dark:text-gray-100">{employee.email}</p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
              Phone
            </label>
            <div className="flex items-center gap-2 mt-1">
              <PhoneIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <p className="text-sm text-gray-900 dark:text-gray-100">{employee.phone || "N/A"}</p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
              Gender
            </label>
            <div className="flex items-center gap-2 mt-1">
              <UserIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {getGenderLabel(employee.gender)}
              </p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
              Date of Birth
            </label>
            <div className="flex items-center gap-2 mt-1">
              <CalendarIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {employee.date_of_birth
                  ? new Date(employee.date_of_birth).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
              Department
            </label>
            <div className="flex items-center gap-2 mt-1">
              <BuildingOfficeIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {employee.department?.name || "N/A"}
              </p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
              Position
            </label>
            <div className="flex items-center gap-2 mt-1">
              <BriefcaseIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {employee.position?.title || "N/A"}
              </p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
              Status
            </label>
            <div className="mt-1">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  employee.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {employee.status === "active" ? (
                  <CheckBadgeIcon className="w-3 h-3" />
                ) : (
                  <XMarkIcon className="w-3 h-3" />
                )}
                {employee.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
              Hire Date
            </label>
            <div className="flex items-center gap-2 mt-1">
              <CalendarIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {employee.hire_date
                  ? new Date(employee.hire_date).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
          <div>
            <label className="block text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
              Created
            </label>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
              {new Date(employee.created_at).toLocaleString()}
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
              Last Updated
            </label>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
              {new Date(employee.updated_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-xl">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                  <TrashIcon className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-center text-gray-900 dark:text-gray-100">
                Delete Employee
              </h3>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400 dark:text-gray-500">
                Are you sure you want to delete{" "}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {employee.name}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
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

export default EmployeeDetail;
