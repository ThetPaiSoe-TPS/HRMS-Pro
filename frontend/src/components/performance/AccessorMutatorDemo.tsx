import React, { useState, useEffect } from "react";
import {
  ArrowPathIcon,
  CheckBadgeIcon,
  XMarkIcon,
  EyeIcon,
  PencilSquareIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ClockIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  CodeBracketIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { employeeApi, type Employee } from "../../api/employee/employeeApi";


export const AccessorMutatorDemo: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [accessorDetails, setAccessorDetails] = useState<any>(null);
  const [showRaw, setShowRaw] = useState(false);

  // Mutator form state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    salary: "",
    employee_code: "",
    is_active: true,
  });
  const [mutatorResult, setMutatorResult] = useState<any>(null);
  const [mutatorLoading, setMutatorLoading] = useState(false);

  // Fetch employees with accessors
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeeApi.getWithAccessors();
      setEmployees(data);
      if (data.length > 0) {
        setSelectedEmployee(data[0]);
        // Fetch accessor details for first employee
        await fetchAccessorDetails(data[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccessorDetails = async (id: number) => {
    try {
      const data = await employeeApi.getAccessorDemo(id);
      setAccessorDetails(data);
    } catch (error) {
      console.error("Failed to fetch accessor details:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEmployeeSelect = async (employee: Employee) => {
    setSelectedEmployee(employee);
    await fetchAccessorDetails(employee.id);
  };

  // Handle mutator form
  const handleMutatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMutatorLoading(true);
    try {
      const result = await employeeApi.getMutatorDemo({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        salary: parseFloat(formData.salary) || 0,
        employee_code: formData.employee_code,
        is_active: formData.is_active,
      });
      setMutatorResult(result);
    } catch (error) {
      console.error("Mutator demo failed:", error);
    } finally {
      setMutatorLoading(false);
    }
  };

  const resetMutatorForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      salary: "",
      employee_code: "",
      is_active: true,
    });
    setMutatorResult(null);
  };

  // Accessor Card Component
  const AccessorCard = ({ title, value, description, icon: Icon }: any) => (
    <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-primary-50 flex-shrink-0">
          <Icon className="h-4 w-4 text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500">{title}</p>
          <p className="text-base font-semibold text-gray-900 truncate">
            {value || "N/A"}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto bg-primary-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary-900 flex items-center gap-2">
              <UserIcon className="h-6 w-6 text-primary-600" />
              Accessors & Mutators Demo
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Accessors format data when reading · Mutators format data when
              saving
            </p>
          </div>
          <button
            onClick={fetchEmployees}
            disabled={loading}
            className="px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-secondary-900 hover:text-black transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
          >
            {loading ? (
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowPathIcon className="h-4 w-4" />
            )}
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Employee List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-gray-400" />
              Employees
              <span className="ml-auto text-xs text-gray-500">
                ({employees.length})
              </span>
            </h3>
            <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
              {loading ? (
                <div className="text-center py-4 text-gray-500 text-sm">
                  Loading...
                </div>
              ) : employees.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No employees
                </div>
              ) : (
                employees.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => handleEmployeeSelect(emp)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-3 ${
                      selectedEmployee?.id === emp.id
                        ? "bg-primary-50 border border-primary-200"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-700 text-xs font-bold">
                        {emp.initials || emp.first_name?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {emp.full_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {emp.email}
                      </p>
                    </div>
                    <div
                      className={`h-2 w-2 rounded-full ${emp.is_active ? "bg-green-500" : "bg-red-500"}`}
                    />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Middle: Accessors Display */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                <EyeIcon className="h-4 w-4 text-gray-400" />
                Accessors
              </h3>
              <button
                onClick={() => setShowRaw(!showRaw)}
                className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                {showRaw ? (
                  <EyeIcon className="h-3 w-3" />
                ) : (
                  <CodeBracketIcon className="h-3 w-3" />
                )}
                {showRaw ? "Show Accessors" : "Show Raw Data"}
              </button>
            </div>

            {selectedEmployee ? (
              <div className="space-y-3">
                {showRaw ? (
                  // Raw data view
                  <div className="bg-gray-50 rounded-lg p-3 max-h-[400px] overflow-y-auto">
                    <p className="text-xs text-gray-500 mb-2">
                      Raw Data from Database:
                    </p>
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(
                        {
                          id: selectedEmployee.id,
                          first_name: selectedEmployee.first_name,
                          last_name: selectedEmployee.last_name,
                          email: selectedEmployee.email,
                          phone: selectedEmployee.phone,
                          salary: selectedEmployee.salary,
                          is_active: selectedEmployee.is_active,
                          employee_code: selectedEmployee.employee_code,
                          hire_date: selectedEmployee.hire_date,
                          date_of_birth: selectedEmployee.date_of_birth,
                        },
                        null,
                        2,
                      )}
                    </pre>
                  </div>
                ) : (
                  // Accessors view
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <AccessorCard
                        title="Full Name"
                        value={selectedEmployee.full_name}
                        icon={UserIcon}
                        description="Combined first + last name"
                      />
                      <AccessorCard
                        title="Formatted Salary"
                        value={selectedEmployee.formatted_salary}
                        icon={CurrencyDollarIcon}
                        description="With $ and commas"
                      />
                      <AccessorCard
                        title="Status Badge"
                        value={selectedEmployee.status_badge}
                        icon={CheckBadgeIcon}
                        description="Active / Inactive"
                      />
                      <AccessorCard
                        title="Experience Years"
                        value={
                          selectedEmployee.experience_years
                            ? `${selectedEmployee.experience_years} years`
                            : "N/A"
                        }
                        icon={ClockIcon}
                        description="Since hire date"
                      />
                      <AccessorCard
                        title="Initials"
                        value={selectedEmployee.initials}
                        icon={UserIcon}
                        description="First + Last initials"
                      />
                      <AccessorCard
                        title="Age"
                        value={
                          selectedEmployee.age
                            ? `${selectedEmployee.age} years`
                            : "N/A"
                        }
                        icon={CalendarIcon}
                        description="From date of birth"
                      />
                      <AccessorCard
                        title="Uppercase Name"
                        value={selectedEmployee.uppercase_name}
                        icon={InformationCircleIcon}
                        description="Full name in uppercase"
                      />
                      <AccessorCard
                        title="Formatted Code"
                        value={selectedEmployee.formatted_employee_code}
                        icon={CodeBracketIcon}
                        description="Employee code with prefix"
                      />
                    </div>
                    {accessorDetails?.explanation && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs font-medium text-blue-800">
                          💡 Accessors Explanation
                        </p>
                        <div className="mt-1 text-xs text-blue-700 space-y-0.5">
                          <p>
                            • <strong>full_name</strong>:{" "}
                            {accessorDetails.explanation.full_name}
                          </p>
                          <p>
                            • <strong>formatted_salary</strong>:{" "}
                            {accessorDetails.explanation.formatted_salary}
                          </p>
                          <p>
                            • <strong>status_badge</strong>:{" "}
                            {accessorDetails.explanation.status_badge}
                          </p>
                          <p>
                            • <strong>experience_years</strong>:{" "}
                            {accessorDetails.explanation.experience_years}
                          </p>
                          <p>
                            • <strong>initials</strong>:{" "}
                            {accessorDetails.explanation.initials}
                          </p>
                          <p>
                            • <strong>age</strong>:{" "}
                            {accessorDetails.explanation.age}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">
                Select an employee to view accessors
              </div>
            )}
          </div>
        </div>

        {/* Right: Mutators Demo */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-2">
              <PencilSquareIcon className="h-4 w-4 text-gray-400" />
              Mutators Demo
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Enter data and see how mutators format it:
              <br />• Name → Capitalized
              <br />• Email → Lowercase
              <br />• Phone → Numbers only
              <br />• Salary → Cleaned
            </p>

            <form onSubmit={handleMutatorSubmit} className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <input
                type="email"
                placeholder="Email (will be lowercase)"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <input
                type="text"
                placeholder="Phone (numbers only)"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
              />
              <input
                type="text"
                placeholder="Employee Code"
                value={formData.employee_code}
                onChange={(e) =>
                  setFormData({ ...formData, employee_code: e.target.value })
                }
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <input
                type="text"
                placeholder="Salary ($50,000.00)"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({ ...formData, salary: e.target.value })
                }
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                Active
              </label>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={mutatorLoading}
                  className="flex-1 px-4 py-1.5 bg-primary-700 text-white rounded-lg hover:bg-secondary-900 hover:text-black transition-colors disabled:opacity-50 text-sm"
                >
                  {mutatorLoading ? "..." : "Test Mutators"}
                </button>
                <button
                  type="button"
                  onClick={resetMutatorForm}
                  className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
              </div>
            </form>

            {mutatorResult && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  🔄 Mutator Results
                </p>
                <div className="space-y-1.5">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="font-medium text-gray-500">Before</p>
                      <div className="bg-white rounded p-1.5 mt-0.5">
                        {Object.entries(mutatorResult.before).map(
                          ([key, value]) => (
                            <p key={key} className="text-gray-700">
                              <span className="text-gray-400">{key}:</span>{" "}
                              {String(value)}
                            </p>
                          ),
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-green-600">
                        After (Mutators)
                      </p>
                      <div className="bg-green-50 rounded p-1.5 mt-0.5">
                        {Object.entries(mutatorResult.after).map(
                          ([key, value]) => (
                            <p key={key} className="text-green-700">
                              <span className="text-green-500">{key}:</span>{" "}
                              {String(value)}
                            </p>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                  {mutatorResult.mutators_applied && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-500">
                        Applied Mutators
                      </p>
                      {Object.entries(mutatorResult.mutators_applied).map(
                        ([key, value]) => (
                          <p key={key} className="text-xs text-gray-600">
                            • {key} → {String(value)}
                          </p>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessorMutatorDemo;
