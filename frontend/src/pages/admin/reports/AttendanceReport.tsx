import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  CheckBadgeIcon,
  XMarkIcon,
  ClockIcon,
  UsersIcon,
  DocumentTextIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import type {
  AttendanceReportFilters,
  AttendanceSummary,
  EmployeeAttendanceSummary,
} from "../../../types/attendance.types";
import { attendanceApi } from "../../../api/attendance/attendanceApi";
import { employeeApi } from "../../../api/employeeApi";
import { departmentApi } from "../../../api/department/departmentApi";
import { getStorageUrl } from "../../../api/axios";
import { useAuth } from "../../../hooks/useAuth";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

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

interface Department {
  id: number;
  name: string;
  code: string;
}

interface Employee {
  id: number;
  name: string;
  employee_code: string;
  photo?: string | null;
  department?: { name: string };
}

interface AttendanceRecord {
  id: number;
  employee_id: number;
  employee?: {
    id: number;
    name: string;
    employee_code: string;
    photo?: string | null;
    department?: { id: number; name: string };
    position?: { id: number; title: string };
  };
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: "present" | "absent" | "late" | "half_day" | "leave";
  work_hours: number | null;
  overtime_hours: number | null;
  notes: string | null;
}

const statusColors = {
  present: "#10b981",
  absent: "#ef4444",
  late: "#f59e0b",
  half_day: "#3b82f6",
  leave: "#8b5cf6",
};

export const AttendanceReport: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';
  const isManager = user?.role === 'manager';
  const isReadOnly = !isSuperAdmin;

  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [filters, setFilters] = useState<AttendanceReportFilters>({
    date_from: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    date_to: new Date().toISOString().split("T")[0],
    department_id: "",
    employee_id: "",
    status: "",
  });
  const [summaryData, setSummaryData] = useState<AttendanceSummary[]>([]);
  const [employeeSummary, setEmployeeSummary] = useState<
    EmployeeAttendanceSummary[]
  >([]);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const result = await departmentApi.getAll();
      // If manager, filter departments to only show their department
      if (isManager && user?.employee?.department_id) {
        const managerDept = result.find(d => d.id === user.employee?.department_id);
        setDepartments(managerDept ? [managerDept] : []);
      } else {
        setDepartments(result);
      }
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    }
  };

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const result = await employeeApi.getEmployees({
        search: "",
        department_id: "",
        position_id: "",
        status: "",
        page: 1,
        per_page: 100,
      });
      setEmployees(result.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  // Fetch attendance records
  const fetchAttendanceRecords = async () => {
    setLoading(true);
    try {
      const params = {
        employee_id: filters.employee_id || "",
        date_from: filters.date_from,
        date_to: filters.date_to,
        status: filters.status || "",
        page: 1,
        per_page: 1000,
      };
      
      const result = await attendanceApi.getAttendance(params);
      let records = result.data;
      
      // Filter for manager's department
      if (isManager && user?.employee?.department_id) {
        records = records.filter(
          (record) => record.employee?.department?.id === user.employee?.department_id
        );
      }
      
      setAttendanceRecords(records);
      generateSummary(records);
    } catch (error) {
      console.error("Failed to fetch attendance records:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate summary from attendance records
  const generateSummary = (records: AttendanceRecord[]) => {
    // Daily summary
    const dailyMap = new Map<string, AttendanceSummary>();
    const employeeMap = new Map<
      number,
      {
        name: string;
        code: string;
        department: string;
        photo?: string | null;
        present: number;
        absent: number;
        late: number;
        half_day: number;
        on_leave: number;
        total_days: number;
      }
    >();

    records.forEach((record) => {
      const date = record.date;
      const status = record.status;

      // Daily summary
      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          date: date,
          total_employees: 0,
          present: 0,
          absent: 0,
          late: 0,
          half_day: 0,
          on_leave: 0,
          present_percentage: 0,
        });
      }
      const dayData = dailyMap.get(date)!;
      dayData.total_employees++;
      if (status === "present") dayData.present++;
      else if (status === "absent") dayData.absent++;
      else if (status === "late") dayData.late++;
      else if (status === "half_day") dayData.half_day++;
      else if (status === "leave") dayData.on_leave++;

      // Employee summary
      const empId = record.employee_id;
      if (!employeeMap.has(empId)) {
        const emp = record.employee;
        employeeMap.set(empId, {
          name: emp?.name || "Unknown",
          code: emp?.employee_code || "N/A",
          department: emp?.department?.name || "N/A",
          photo: emp?.photo || null,
          present: 0,
          absent: 0,
          late: 0,
          half_day: 0,
          on_leave: 0,
          total_days: 0,
        });
      }
      const empData = employeeMap.get(empId)!;
      empData.total_days++;
      if (status === "present") empData.present++;
      else if (status === "absent") empData.absent++;
      else if (status === "late") empData.late++;
      else if (status === "half_day") empData.half_day++;
      else if (status === "leave") empData.on_leave++;
    });

    // Calculate percentages
    const dailySummary = Array.from(dailyMap.values()).map((day) => ({
      ...day,
      present_percentage:
        day.total_employees > 0
          ? Math.round((day.present / day.total_employees) * 100)
          : 0,
    }));

    const employeeSummaryData = Array.from(employeeMap.values()).map((emp) => ({
      employee_id: 0,
      employee_name: emp.name,
      employee_code: emp.code,
      department: emp.department,
      photo: emp.photo || null,
      total_days: emp.total_days,
      present: emp.present,
      absent: emp.absent,
      late: emp.late,
      half_day: emp.half_day,
      on_leave: emp.on_leave,
      attendance_rate:
        emp.total_days > 0
          ? Math.round((emp.present / emp.total_days) * 100)
          : 0,
    }));

    setSummaryData(dailySummary);
    setEmployeeSummary(employeeSummaryData);
  };

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, [isManager, user]);

  useEffect(() => {
    if (filters.date_from && filters.date_to) {
      fetchAttendanceRecords();
    }
  }, [filters]);

  // Handlers
  const handleFilterChange = (
    key: keyof AttendanceReportFilters,
    value: string,
  ) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleGenerateReport = () => {
    fetchAttendanceRecords();
  };

  const handleExport = (format: "pdf" | "excel") => {
    if (format === "excel") {
      exportToExcel();
    } else {
      exportToPDF();
    }
    setShowExportMenu(false);
  };

  const exportToExcel = () => {
    const data = employeeSummary.map((emp) => ({
      Employee: emp.employee_name,
      Code: emp.employee_code,
      Department: emp.department,
      Present: emp.present,
      Absent: emp.absent,
      Late: emp.late,
      "Half Day": emp.half_day,
      Leave: emp.on_leave,
      "Total Days": emp.total_days,
      "Attendance Rate": `${emp.attendance_rate}%`,
    }));

    // Use simple CSV export
    const headers = Object.keys(data[0] || {});
    let csv = headers.join(",") + "\n";
    data.forEach((row) => {
      csv +=
        Object.values(row)
          .map((v) => `"${v}"`)
          .join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    // Simple print version
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    let html = `
      <html>
        <head>
          <title>Attendance Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #1a202c; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #3b82f6; color: white; padding: 10px; text-align: left; }
            td { padding: 8px 10px; border: 1px solid #e2e8f0; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
          </style>
        </head>
        <body>
          <h1>Attendance Report</h1>
          <p>Generated: ${new Date().toLocaleString()}</p>
          <p>Period: ${filters.date_from} to ${filters.date_to}</p>
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Code</th>
                <th>Department</th>
                <th class="text-center">Present</th>
                <th class="text-center">Absent</th>
                <th class="text-center">Late</th>
                <th class="text-center">Half Day</th>
                <th class="text-center">Leave</th>
                <th class="text-right">Rate</th>
              </tr>
            </thead>
            <tbody>
    `;

    employeeSummary.forEach((emp) => {
      html += `
        <tr>
          <td>${emp.employee_name}</td>
          <td>${emp.employee_code}</td>
          <td>${emp.department}</td>
          <td class="text-center">${emp.present}</td>
          <td class="text-center">${emp.absent}</td>
          <td class="text-center">${emp.late}</td>
          <td class="text-center">${emp.half_day}</td>
          <td class="text-center">${emp.on_leave}</td>
          <td class="text-right">${emp.attendance_rate}%</td>
        </tr>
      `;
    });

    html += `
            </tbody>
          </table>
          <p style="margin-top: 20px; color: #718096; font-size: 12px;">
            Total Employees: ${employeeSummary.length}
          </p>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || "#6b7280";
  };

  // Chart Data - Daily Trends
  const dailyTrendData = {
    labels: summaryData.map((d) =>
      new Date(d.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    ),
    datasets: [
      {
        label: "Present",
        data: summaryData.map((d) => d.present),
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        borderColor: "#10b981",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Absent",
        data: summaryData.map((d) => d.absent),
        backgroundColor: "rgba(239, 68, 68, 0.5)",
        borderColor: "#ef4444",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Late",
        data: summaryData.map((d) => d.late),
        backgroundColor: "rgba(245, 158, 11, 0.5)",
        borderColor: "#f59e0b",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Chart Data - Status Distribution
  const statusDistributionData = {
    labels: ["Present", "Absent", "Late", "Half Day", "On Leave"],
    datasets: [
      {
        data: [
          summaryData.reduce((sum, d) => sum + d.present, 0),
          summaryData.reduce((sum, d) => sum + d.absent, 0),
          summaryData.reduce((sum, d) => sum + d.late, 0),
          summaryData.reduce((sum, d) => sum + d.half_day, 0),
          summaryData.reduce((sum, d) => sum + d.on_leave, 0),
        ],
        backgroundColor: [
          "rgba(16, 185, 129, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(139, 92, 246, 0.8)",
        ],
        borderColor: ["#10b981", "#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6"],
        borderWidth: 2,
      },
    ],
  };

  // Chart Data - Attendance Rate by Department
  const departmentRateData = {
    labels: departments.map((d) => d.name),
    datasets: [
      {
        label: "Attendance Rate (%)",
        data: departments.map((dept) => {
          const deptEmployees = employeeSummary.filter(
            (e) => e.department === dept.name,
          );
          const avgRate =
            deptEmployees.length > 0
              ? deptEmployees.reduce((sum, e) => sum + e.attendance_rate, 0) /
                deptEmployees.length
              : 0;
          return Math.round(avgRate);
        }),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "#3b82f6",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {isManager ? 'Team Attendance Report' : 'Attendance Report'}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
            {isManager ? 'View team attendance reports (read-only)' : 'Analyze attendance patterns and generate reports'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isManager && (
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
              <EyeIcon className="w-4 h-4" />
              Read Only
            </span>
          )}
          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg shadow-sm bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? (
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
            ) : (
              <ArrowPathIcon className="w-5 h-5" />
            )}
            Generate Report
          </button>
          {!isReadOnly && (
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 transition-colors border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
              >
                <DocumentArrowDownIcon className="w-5 h-5" />
                Export
              </button>
              {showExportMenu && (
                <div className="absolute right-0 z-10 w-40 py-1 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                  <button
                    onClick={() => handleExport("pdf")}
                    className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                  >
                    <DocumentTextIcon className="w-4 h-4" />
                    PDF
                  </button>
                  <button
                    onClick={() => handleExport("excel")}
                    className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                  >
                    <ChartBarIcon className="w-4 h-4" />
                    Excel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 mb-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Date From
            </label>
            <input
              type="date"
              value={filters.date_from}
              onChange={(e) => handleFilterChange("date_from", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Date To
            </label>
            <input
              type="date"
              value={filters.date_to}
              onChange={(e) => handleFilterChange("date_to", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Department
            </label>
            <select
              value={filters.department_id}
              onChange={(e) =>
                handleFilterChange("department_id", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              disabled={isManager}
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
              Employee
            </label>
            <select
              value={filters.employee_id}
              onChange={(e) =>
                handleFilterChange("employee_id", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.employee_code} - {emp.name}
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="half_day">Half Day</option>
              <option value="leave">On Leave</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4 lg:grid-cols-7">
        <div className="p-3 text-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
          <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">Total Days</p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {summaryData.length}
          </p>
        </div>
        <div className="p-3 text-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <CheckBadgeIcon className="w-4 h-4 text-green-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">Present</p>
          </div>
          <p className="text-xl font-bold text-green-600">
            {summaryData.reduce((sum, d) => sum + d.present, 0)}
          </p>
        </div>
        <div className="p-3 text-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <XMarkIcon className="w-4 h-4 text-red-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">Absent</p>
          </div>
          <p className="text-xl font-bold text-red-600">
            {summaryData.reduce((sum, d) => sum + d.absent, 0)}
          </p>
        </div>
        <div className="p-3 text-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <ClockIcon className="w-4 h-4 text-yellow-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">Late</p>
          </div>
          <p className="text-xl font-bold text-yellow-600">
            {summaryData.reduce((sum, d) => sum + d.late, 0)}
          </p>
        </div>
        <div className="p-3 text-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <ClockIcon className="w-4 h-4 text-blue-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">Half Day</p>
          </div>
          <p className="text-xl font-bold text-blue-600">
            {summaryData.reduce((sum, d) => sum + d.half_day, 0)}
          </p>
        </div>
        <div className="p-3 text-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
          <div className="flex items-center justify-center gap-1">
            <CalendarIcon className="w-4 h-4 text-purple-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">On Leave</p>
          </div>
          <p className="text-xl font-bold text-purple-600">
            {summaryData.reduce((sum, d) => sum + d.on_leave, 0)}
          </p>
        </div>
        <div className="p-3 text-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
          <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">Avg Attendance</p>
          <p className="text-xl font-bold text-primary-600">
            {summaryData.length > 0
              ? Math.round(
                  summaryData.reduce(
                    (sum, d) => sum + d.present_percentage,
                    0,
                  ) / summaryData.length,
                )
              : 0}
            %
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
        {/* Daily Trends */}
        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Daily Attendance Trends
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">Present</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">Absent</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <span className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">Late</span>
              </div>
            </div>
          </div>
          <div className="h-[250px]">
            <Line
              data={dailyTrendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Status Distribution */}
        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
          <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
            Attendance Status Distribution
          </h3>
          <div className="h-[250px] flex items-center justify-center">
            <Doughnut
              data={statusDistributionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "right",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Department Attendance Rate */}
      <div className="p-4 mb-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
        <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
          Attendance Rate by Department
        </h3>
        <div className="h-[200px]">
          <Bar
            data={departmentRateData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  ticks: {
                    callback: function (value) {
                      return value + "%";
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Employee Summary Table with Photos */}
      <div className="overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Employee Attendance Summary
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
            {employeeSummary.length} employees
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Present
                </th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Absent
                </th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Late
                </th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Half Day
                </th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Leave
                </th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {employeeSummary.map((emp, index) => (
                <tr key={index} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {emp.photo ? (
                        <img
                          src={getPhotoUrl(emp.photo)}
                          alt={emp.employee_name}
                          className="flex-shrink-0 object-cover rounded-full w-8 h-8"
                        />
                      ) : (
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full ${getRandomColor(index + 1)}`}
                        >
                          <span className="text-xs font-medium">
                            {getInitials(emp.employee_name)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {emp.employee_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                          {emp.employee_code}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">
                      {emp.department}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium text-green-600">
                      {emp.present}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium text-red-600">
                      {emp.absent}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium text-yellow-600">
                      {emp.late}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium text-blue-600">
                      {emp.half_day}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium text-purple-600">
                      {emp.on_leave}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary-600"
                          style={{ width: `${emp.attendance_rate}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {emp.attendance_rate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;