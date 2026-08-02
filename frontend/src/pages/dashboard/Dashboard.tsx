import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  UserGroupIcon,
  UserMinusIcon,
  CheckBadgeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  ClockIcon,
  ArrowPathIcon,
  BellIcon,
  UserPlusIcon,
  Cog6ToothIcon,
  UserIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import { attendanceApi } from "../../api/attendance/attendanceApi";
import { leaveApi } from "../../api/leave/leaveApi";
import { payrollApi } from "../../api/payroll/payrollApi";
import { announcementApi } from "../../api/announcement/announcementApi";
import { employeeApi } from "../../api/employee/employeeApi";
import { departmentApi } from "../../api/department/departmentApi";

// Chart.js imports
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
  Filler,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";

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
  Filler,
);

// ============================================
// TYPES
// ============================================
interface RecentActivity {
  id: number;
  user: string;
  action: string;
  time: string;
  type: "leave" | "attendance" | "payroll" | "employee" | "system";
}

interface UpcomingHoliday {
  id: number;
  name: string;
  date: string;
  daysLeft: number;
  type: "public" | "company" | "religious";
}

// ============================================
// DASHBOARD COMPONENT
// ============================================
// ============================================
// SKELETON LOADER COMPONENT
// ============================================
const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div
    className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
  />
);

const SkeletonCard: React.FC = () => (
  <div className="p-4 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-lg" />
      <div className="flex-1">
        <Skeleton className="w-20 h-3 mb-2" />
        <Skeleton className="w-16 h-4" />
      </div>
    </div>
  </div>
);

const SkeletonWidget: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`p-4 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl ${className}`}>
    <Skeleton className="w-32 h-4 mb-4" />
    <div className="space-y-3">
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-3/4 h-10" />
      <Skeleton className="w-1/2 h-10" />
    </div>
  </div>
);

const SkeletonChart: React.FC = () => (
  <div className="p-4 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
    <Skeleton className="w-40 h-4 mb-4" />
    <Skeleton className="w-full h-[250px] rounded-lg" />
  </div>
);

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Role detection
  const userRole =
    typeof user?.role === "string" ? user.role.toLowerCase() : "";
  const userRoleId = user?.role_id;

  const isEmployee = userRole === "employee" || userRoleId === 4;
  const isManager =
    userRole === "manager" ||
    userRole === "department manager" ||
    userRoleId === 3;
  const isAdmin =
    userRole === "admin" ||
    userRole === "super_admin" ||
    userRoleId === 1 ||
    userRoleId === 2;

  const [pageReady, setPageReady] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Individual section loading states
  const [loadingAttendance, setLoadingAttendance] = useState(true);
  const [loadingMonthlyStats, setLoadingMonthlyStats] = useState(true);
  const [loadingLeaveBalances, setLoadingLeaveBalances] = useState(true);
  const [loadingPendingLeaves, setLoadingPendingLeaves] = useState(true);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [loadingAdminStats, setLoadingAdminStats] = useState(true);
  const [loadingAdminActivities, setLoadingAdminActivities] = useState(true);
  const [loadingCharts, setLoadingCharts] = useState(true);

  // ============================================
  // EMPLOYEE STATE
  // ============================================
  const [todayAttendance, setTodayAttendance] = useState<{
    checked_in: boolean;
    checked_out: boolean;
    check_in_time?: string;
    check_out_time?: string;
    status?: string;
  }>({
    checked_in: false,
    checked_out: false,
  });
  const [attendanceStats, setAttendanceStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    half_day: 0,
    on_leave: 0,
    total_days: 0,
    present_percentage: 0,
  });
  const [leaveBalances, setLeaveBalances] = useState<any[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<any[]>([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState<any[]>([]);
  const [employeeHolidays, setEmployeeHolidays] = useState<UpcomingHoliday[]>(
    [],
  );
  const [employeeActivities, setEmployeeActivities] = useState<
    RecentActivity[]
  >([]);

  // ============================================
  // ADMIN STATE
  // ============================================
  const [adminStats, setAdminStats] = useState<any[]>([]);
  const [adminActivities, setAdminActivities] = useState<RecentActivity[]>([]);
  const [adminHolidays, setAdminHolidays] = useState<UpcomingHoliday[]>([]);
  const [attendanceChartData, setAttendanceChartData] = useState<any>(null);
  const [departmentChartData, setDepartmentChartData] = useState<any>(null);
  const [leaveChartData, setLeaveChartData] = useState<any>(null);

  // ============================================
  // FETCH DATA (parallel with per-section loading)
  // ============================================
  useEffect(() => {
    const fetchAllData = async () => {
      setPageReady(false);
      try {
        const employeeId = user?.employee_id || user?.id;
        console.log("Employee ID:", employeeId);
        console.log("User role:", user?.role);
        console.log("isEmployee:", isEmployee);
        console.log("isAdmin:", isAdmin);
        console.log("isManager:", isManager);

        // ============================================
        // 1. FETCH EMPLOYEE DATA (for all roles)
        // ============================================
        const today = new Date().toISOString().split("T")[0];

        // Today's attendance
        try {
          const attendanceResult = await attendanceApi.getAttendance({
            employee_id: String(employeeId),
            date_from: today,
            date_to: today,
            status: "",
            page: 1,
            per_page: 1,
          });
          if (attendanceResult.data && attendanceResult.data.length > 0) {
            const record = attendanceResult.data[0];
            setTodayAttendance({
              checked_in: !!record.check_in,
              checked_out: !!record.check_out,
              check_in_time: record.check_in,
              check_out_time: record.check_out,
              status: record.status,
            });
          }
        } catch (error) {
          console.log("No attendance data for today");
        }

        // Monthly attendance stats
        const firstDay = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1,
        )
          .toISOString()
          .split("T")[0];
        const lastDay = new Date().toISOString().split("T")[0];

        try {
          const monthlyAttendance = await attendanceApi.getAttendance({
            employee_id: String(employeeId),
            date_from: firstDay,
            date_to: lastDay,
            status: "",
            page: 1,
            per_page: 100,
          });
          const data = monthlyAttendance.data || [];
          const present = data.filter(
            (a: any) => a.status === "present",
          ).length;
          const absent = data.filter((a: any) => a.status === "absent").length;
          const late = data.filter((a: any) => a.status === "late").length;
          const halfDay = data.filter(
            (a: any) => a.status === "half_day",
          ).length;
          const onLeave = data.filter((a: any) => a.status === "leave").length;
          const total = data.length || 1;
          setAttendanceStats({
            present,
            absent,
            late,
            half_day: halfDay,
            on_leave: onLeave,
            total_days: total,
            present_percentage:
              total > 0 ? Math.round((present / total) * 100) : 0,
          });
        } catch (error) {
          console.log("No monthly attendance data");
        }

        // Leave balances
        try {
          const leaveResult = await leaveApi.getLeaveBalance();
          setLeaveBalances(leaveResult || []);
        } catch (error) {
          console.log("No leave balances data");
          try {
            const leaveTypes = await leaveApi.getActiveLeaveTypes();
            const defaultBalances = leaveTypes.map((lt: any) => ({
              leave_type_id: lt.id,
              leave_type_name: lt.name,
              total: lt.days_per_year || 0,
              used: 0,
              pending: 0,
              available: lt.days_per_year || 0,
              carry_forward: 0,
            }));
            setLeaveBalances(defaultBalances);
          } catch (err) {
            console.log("Could not fetch leave types");
          }
        }

        // Pending leave requests
        try {
          const pendingResult = await leaveApi.getLeaveRequests({
            employee_id: String(employeeId),
            status: "pending",
            page: 1,
            per_page: 10,
          });
          setPendingLeaves(pendingResult?.data || []);
        } catch (error) {
          console.log("No pending leave requests");
        }

        // Announcements
        try {
          const announcementsResult = await announcementApi.getAnnouncements({
            search: "",
            type: "",
            status: "",
            priority: "",
            pinned: false,
            important: false,
            page: 1,
            per_page: 5,
          });
          setRecentAnnouncements(announcementsResult?.data || []);
        } catch (error) {
          console.log("No announcements data");
        }

        // Employee activities
        const activities: RecentActivity[] = [];
        let activityId = 1;
        if (todayAttendance.checked_in) {
          activities.push({
            id: activityId++,
            user: user?.name || "You",
            action: `checked in at ${todayAttendance.check_in_time || "today"}`,
            time: "Today",
            type: "attendance",
          });
        }
        if (pendingLeaves.length > 0) {
          activities.push({
            id: activityId++,
            user: user?.name || "You",
            action: `has ${pendingLeaves.length} leave request(s) pending approval`,
            time: "Pending",
            type: "leave",
          });
        }
        setEmployeeActivities(activities);

        // Employee holidays
        setEmployeeHolidays([
          {
            id: 1,
            name: "Independence Day",
            date: "2026-07-21",
            daysLeft: 0,
            type: "public",
          },
          {
            id: 2,
            name: "Full Moon Day",
            date: "2026-08-12",
            daysLeft: 15,
            type: "religious",
          },
        ]);

        // ============================================
        // 2. FETCH ADMIN DATA (for admin/manager only)
        // ============================================
        if (isAdmin || isManager) {
          // Get total employees
          const employeesResult = await employeeApi.getEmployees({
            search: "",
            department_id: "",
            position_id: "",
            status: "",
            page: 1,
            per_page: 1,
          });
          const totalEmployees = employeesResult?.total || 0;

          // Get departments
          const departments = await departmentApi.getAll();
          const deptCount = departments?.length || 0;

          // Get today's summary
          let todaySummary = { present: 0, absent: 0 };
          try {
            const summary = await attendanceApi.getSummary(today);
            todaySummary = {
              present: summary?.present || 0,
              absent: summary?.absent || 0,
            };
          } catch (error) {
            console.log("No attendance summary");
          }

          // Get pending leaves count
          let pendingLeavesCount = 0;
          try {
            const pendingResult = await leaveApi.getLeaveRequests({
              status: "pending",
              page: 1,
              per_page: 1,
            });
            pendingLeavesCount = pendingResult?.total || 0;
          } catch (error) {
            console.log("No pending leaves count");
          }

          setAdminStats([
            {
              title: "Total Employees",
              value: totalEmployees || 0,
              icon: UserGroupIcon,
              color: "bg-blue-500",
              change: "+12%",
              changeType: "increase",
              link: "/admin/employees",
            },
            {
              title: "Present Today",
              value: todaySummary.present || 0,
              icon: CheckBadgeIcon,
              color: "bg-green-500",
              change: "+5%",
              changeType: "increase",
              link: "/admin/attendance",
            },
            {
              title: "Absent Today",
              value: todaySummary.absent || 0,
              icon: UserMinusIcon,
              color: "bg-red-500",
              change: "-3%",
              changeType: "decrease",
              link: "/admin/attendance",
            },
            {
              title: "Pending Leave",
              value: pendingLeavesCount || 0,
              icon: CalendarIcon,
              color: "bg-yellow-500",
              change: "+2",
              changeType: "increase",
              link: "/admin/leaves",
            },
            {
              title: "Payroll This Month",
              value: "$0",
              icon: CurrencyDollarIcon,
              color: "bg-purple-500",
              change: "+8%",
              changeType: "increase",
              link: "/admin/payroll",
            },
            {
              title: "Departments",
              value: deptCount || 0,
              icon: BuildingOfficeIcon,
              color: "bg-indigo-500",
              change: "0",
              changeType: "neutral",
              link: "/admin/departments",
            },
          ]);

          // Admin activities (recent)
          const adminActivitiesList: RecentActivity[] = [];
          let adminId = 1;

          // Get recent leave requests
          try {
            const recentLeaves = await leaveApi.getLeaveRequests({
              page: 1,
              per_page: 3,
            });
            if (recentLeaves?.data) {
              recentLeaves.data.forEach((leave: any) => {
                adminActivitiesList.push({
                  id: adminId++,
                  user: leave.employee?.name || "Unknown",
                  action: `submitted a leave request (${leave.leave_type?.name || "Leave"}, ${leave.days} days)`,
                  time: new Date(leave.created_at).toLocaleDateString(),
                  type: "leave",
                });
              });
            }
          } catch (error) {
            console.log("No recent leaves");
          }

          // Get recent attendance
          try {
            const recentAttendance = await attendanceApi.getAttendance({
              date_from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
              date_to: today,
              page: 1,
              per_page: 3,
            });
            if (recentAttendance?.data) {
              recentAttendance.data.forEach((att: any) => {
                adminActivitiesList.push({
                  id: adminId++,
                  user: att.employee?.name || "Unknown",
                  action: `checked ${att.status === "present" ? "in" : "out"} at ${att.check_in || "N/A"}`,
                  time: new Date(att.date).toLocaleDateString(),
                  type: "attendance",
                });
              });
            }
          } catch (error) {
            console.log("No recent attendance");
          }

          setAdminActivities(adminActivitiesList.slice(0, 5));

          // Admin holidays
          setAdminHolidays([
            {
              id: 1,
              name: "Independence Day",
              date: "2026-07-21",
              daysLeft: 0,
              type: "public",
            },
            {
              id: 2,
              name: "Full Moon Day",
              date: "2026-08-12",
              daysLeft: 15,
              type: "religious",
            },
          ]);

          // ============================================
          // CHART DATA (Admin only)
          // ============================================
          // Attendance chart
          try {
            const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
            const presentData = [];
            const absentData = [];

            for (let i = 6; i >= 0; i--) {
              const date = new Date();
              date.setDate(date.getDate() - i);
              const dateStr = date.toISOString().split("T")[0];
              const dayAttendance = await attendanceApi.getAttendance({
                date_from: dateStr,
                date_to: dateStr,
                page: 1,
                per_page: 100,
              });
              const present =
                dayAttendance.data?.filter((a: any) => a.status === "present")
                  .length || 0;
              const total = dayAttendance.data?.length || 0;
              const absent = total - present;
              presentData.push(present);
              absentData.push(absent);
            }

            setAttendanceChartData({
              labels: weekDays,
              datasets: [
                {
                  label: "Present",
                  data: presentData,
                  borderColor: "rgb(59, 130, 246)",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  fill: true,
                  tension: 0.4,
                },
                {
                  label: "Absent",
                  data: absentData,
                  borderColor: "rgb(239, 68, 68)",
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  fill: true,
                  tension: 0.4,
                },
              ],
            });
          } catch (error) {
            console.log("Error fetching attendance chart data");
            setAttendanceChartData({
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              datasets: [
                {
                  label: "Present",
                  data: [0, 0, 0, 0, 0, 0, 0],
                  borderColor: "rgb(59, 130, 246)",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  fill: true,
                  tension: 0.4,
                },
                {
                  label: "Absent",
                  data: [0, 0, 0, 0, 0, 0, 0],
                  borderColor: "rgb(239, 68, 68)",
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  fill: true,
                  tension: 0.4,
                },
              ],
            });
          }

          // Department chart
          try {
            const depts = await departmentApi.getAll();
            const deptNames = depts.map((d: any) => d.name);
            const deptCounts = await Promise.all(
              depts.map(async (d: any) => {
                const emps = await employeeApi.getEmployees({
                  department_id: String(d.id),
                  page: 1,
                  per_page: 1,
                });
                return emps?.total || 0;
              }),
            );

            const colors = [
              "rgba(59, 130, 246, 0.8)",
              "rgba(16, 185, 129, 0.8)",
              "rgba(251, 191, 36, 0.8)",
              "rgba(236, 72, 153, 0.8)",
              "rgba(139, 92, 246, 0.8)",
              "rgba(236, 72, 153, 0.8)",
            ];
            const borderColors = [
              "rgb(59, 130, 246)",
              "rgb(16, 185, 129)",
              "rgb(251, 191, 36)",
              "rgb(236, 72, 153)",
              "rgb(139, 92, 246)",
              "rgb(236, 72, 153)",
            ];

            setDepartmentChartData({
              labels: deptNames.length > 0 ? deptNames : ["No Departments"],
              datasets: [
                {
                  label: "Employees by Department",
                  data: deptCounts.length > 0 ? deptCounts : [0],
                  backgroundColor: colors.slice(0, deptCounts.length || 1),
                  borderColor: borderColors.slice(0, deptCounts.length || 1),
                  borderWidth: 2,
                },
              ],
            });
          } catch (error) {
            console.log("Error fetching department chart data");
            setDepartmentChartData({
              labels: ["No Data"],
              datasets: [
                {
                  label: "Employees by Department",
                  data: [0],
                  backgroundColor: ["rgba(59, 130, 246, 0.8)"],
                  borderColor: ["rgb(59, 130, 246)"],
                  borderWidth: 2,
                },
              ],
            });
          }

          // Leave chart
          try {
            const leaveTypes = await leaveApi.getActiveLeaveTypes();
            const leaveNames = leaveTypes.map((lt: any) => lt.name);
            const leaveCounts = await Promise.all(
              leaveTypes.map(async (lt: any) => {
                const leaves = await leaveApi.getLeaveRequests({
                  leave_type_id: String(lt.id),
                  page: 1,
                  per_page: 1,
                });
                return leaves?.total || 0;
              }),
            );

            const colors = [
              "rgba(59, 130, 246, 0.8)",
              "rgba(16, 185, 129, 0.8)",
              "rgba(251, 191, 36, 0.8)",
              "rgba(236, 72, 153, 0.8)",
            ];

            setLeaveChartData({
              labels: leaveNames.length > 0 ? leaveNames : ["No Data"],
              datasets: [
                {
                  label: "Leave Requests",
                  data: leaveCounts.length > 0 ? leaveCounts : [0],
                  backgroundColor: colors.slice(0, leaveCounts.length || 1),
                  borderColor: colors.slice(0, leaveCounts.length || 1),
                  borderWidth: 1,
                },
              ],
            });
          } catch (error) {
            console.log("Error fetching leave chart data");
            setLeaveChartData({
              labels: ["No Data"],
              datasets: [
                {
                  label: "Leave Requests",
                  data: [0],
                  backgroundColor: ["rgba(59, 130, 246, 0.8)"],
                  borderColor: ["rgb(59, 130, 246)"],
                  borderWidth: 1,
                },
              ],
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setPageReady(true);
      }
    };

    if (user) {
      fetchAllData();
    }
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "leave":
        return <CalendarIcon className="w-4 h-4 text-yellow-500" />;
      case "attendance":
        return <ClockIcon className="w-4 h-4 text-green-500" />;
      case "payroll":
        return <CurrencyDollarIcon className="w-4 h-4 text-purple-500" />;
      case "employee":
        return <UserPlusIcon className="w-4 h-4 text-blue-500" />;
      case "system":
        return <Cog6ToothIcon className="w-4 h-4 text-gray-500" />;
      default:
        return <BellIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityBgColor = (type: RecentActivity["type"]) => {
    switch (type) {
      case "leave":
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800";
      case "attendance":
        return "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800";
      case "payroll":
        return "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800";
      case "employee":
        return "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800";
      case "system":
        return "bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600";
      default:
        return "bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600";
    }
  };

  const getHolidayTypeColor = (type: UpcomingHoliday["type"]) => {
    switch (type) {
      case "public":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "company":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "religious":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (!pageReady) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary-600"></div>
      </div>
    );
  }

  // ============================================
  // EMPLOYEE DASHBOARD
  // ============================================
  if (isEmployee) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Here's your personal HR dashboard overview
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-gray-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowPathIcon
              className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
          <div className="p-4 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${todayAttendance.checked_in ? "bg-green-100 dark:bg-green-900/30" : "bg-gray-100 dark:bg-gray-700"}`}
              >
                {todayAttendance.checked_in ? (
                  <CheckBadgeIcon className="w-5 h-5 text-green-600" />
                ) : (
                  <ClockIcon className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Today's Status
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {todayAttendance.checked_in ? (
                    todayAttendance.checked_out ? (
                      <span className="text-gray-600">Completed ✅</span>
                    ) : (
                      <span className="text-green-600">Checked In ✅</span>
                    )
                  ) : (
                    <span className="text-gray-500">Not Checked In</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/30">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Leave Balance
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {leaveBalances.length > 0 ? (
                    <span>
                      {leaveBalances.reduce(
                        (sum, l) => sum + (l.available || 0),
                        0,
                      )}{" "}
                      days
                    </span>
                  ) : (
                    <span className="text-gray-500">0 days</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg dark:bg-yellow-900/30">
                <ClockIcon className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Pending Requests
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {pendingLeaves.length > 0 ? (
                    <span className="text-yellow-600">
                      {pendingLeaves.length}
                    </span>
                  ) : (
                    <span className="text-green-600">0</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                <CheckBadgeIcon className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Attendance Rate
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {attendanceStats.present_percentage}% this month
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
          <Link
            to="/admin/attendance/check"
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
          >
            <ClockIcon className="w-5 h-5" />
            {todayAttendance.checked_in && !todayAttendance.checked_out
              ? "Check Out"
              : "Check In"}
          </Link>
          <Link
            to="/admin/leaves/create"
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <CalendarIcon className="w-5 h-5" />
            Apply Leave
          </Link>
          <Link
            to="/admin/leaves"
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <EyeIcon className="w-5 h-5" />
            View Leaves
          </Link>
          <Link
            to="/profile"
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <UserIcon className="w-5 h-5" />
            My Profile
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="p-4 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Recent Activities
              </h2>
              {employeeActivities.length > 0 ? (
                <div className="space-y-3">
                  {employeeActivities.map((activity, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-3 rounded-lg border ${getActivityBgColor(activity.type)} transition-all`}
                    >
                      <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-white rounded-full shadow-sm dark:bg-gray-800">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          <span className="font-medium">{activity.user}</span>{" "}
                          {activity.action}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          <ClockIcon className="inline w-3 h-3 mr-1" />{" "}
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <ClockIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No recent activities
                  </p>
                </div>
              )}

              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Monthly Attendance Summary (
                  {new Date().toLocaleString("default", { month: "long" })})
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  <div className="p-2 text-center rounded-lg bg-green-50 dark:bg-green-900/20">
                    <p className="text-lg font-bold text-green-600">
                      {attendanceStats.present}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Present
                    </p>
                  </div>
                  <div className="p-2 text-center rounded-lg bg-red-50 dark:bg-red-900/20">
                    <p className="text-lg font-bold text-red-600">
                      {attendanceStats.absent}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Absent
                    </p>
                  </div>
                  <div className="p-2 text-center rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                    <p className="text-lg font-bold text-yellow-600">
                      {attendanceStats.late}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Late
                    </p>
                  </div>
                  <div className="p-2 text-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <p className="text-lg font-bold text-blue-600">
                      {attendanceStats.half_day}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Half Day
                    </p>
                  </div>
                  <div className="p-2 text-center rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <p className="text-lg font-bold text-purple-600">
                      {attendanceStats.on_leave}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      On Leave
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Leave Balance
              </h2>
              {leaveBalances.length > 0 ? (
                <div className="space-y-3">
                  {leaveBalances.slice(0, 4).map((balance, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {balance.leave_type_name}
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {balance.available || 0} days
                        </span>
                      </div>
                      <div className="w-full h-1.5 mt-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary-600"
                          style={{
                            width: `${balance.total > 0 ? ((balance.total - (balance.available || 0)) / balance.total) * 100 : 0}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                        <span>Used: {balance.used || 0}</span>
                        <span>Total: {balance.total || 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No leave balances available
                </p>
              )}
            </div>

            <div className="p-4 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Announcements
              </h2>
              {recentAnnouncements.length > 0 ? (
                <div className="space-y-3">
                  {recentAnnouncements.slice(0, 3).map((announcement) => (
                    <Link
                      key={announcement.id}
                      to={`/announcements/${announcement.id}`}
                      className="block p-2 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-start gap-2">
                        {announcement.is_pinned && (
                          <span className="text-xs text-primary-600">📌</span>
                        )}
                        {announcement.is_important && (
                          <span className="text-xs text-red-600">⚠️</span>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                            {announcement.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(announcement.created_at)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {recentAnnouncements.length > 3 && (
                    <Link
                      to="/announcements"
                      className="block text-sm text-primary-600 hover:underline"
                    >
                      View all →
                    </Link>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No announcements
                </p>
              )}
            </div>

            <div className="p-4 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Upcoming Holidays 🎉
              </h2>
              {employeeHolidays.length > 0 ? (
                <div className="space-y-2">
                  {employeeHolidays.map((holiday) => (
                    <div
                      key={holiday.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {holiday.name}
                      </span>
                      <span
                        className={`text-sm px-2 py-0.5 rounded-full ${getHolidayTypeColor(holiday.type)}`}
                      >
                        {formatDate(holiday.date)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No upcoming holidays
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // ADMIN / MANAGER DASHBOARD
  // ============================================
  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {adminStats.map((stat) => (
          <Link
            key={stat.title}
            to={stat.link || "#"}
            className="p-4 transition-all duration-200 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl hover:shadow-md hover:border-primary-200 group dark:hover:border-gray-600"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </p>
              </div>
              <div
                className={`${stat.color} p-2.5 rounded-lg group-hover:scale-105 transition-transform duration-200`}
              >
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="mt-2">
              {stat.changeType === "increase" && (
                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                  ↑ {stat.change}
                </span>
              )}
              {stat.changeType === "decrease" && (
                <span className="text-xs font-medium text-red-600 dark:text-red-400">
                  ↓ {stat.change}
                </span>
              )}
              {stat.changeType === "neutral" && (
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {stat.change}
                </span>
              )}
              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                from last month
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Attendance Chart */}
        <div className="p-4 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl lg:col-span-2">
          <div className="flex flex-col justify-between gap-2 mb-4 sm:flex-row sm:items-center">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Attendance Chart
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Present
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Absent
                </span>
              </div>
            </div>
          </div>
          <div className="h-[250px]">
            {attendanceChartData && (
              <Line
                data={attendanceChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: "rgba(0,0,0,0.05)" },
                    },
                    x: { grid: { display: false } },
                  },
                }}
              />
            )}
          </div>
        </div>

        {/* Employee by Department */}
        <div className="p-4 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
          <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
            Employee by Department
          </h3>
          <div className="h-[250px] flex items-center justify-center">
            {departmentChartData && (
              <Doughnut
                data={departmentChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        boxWidth: 12,
                        padding: 12,
                        font: { size: 11 },
                      },
                    },
                  },
                  cutout: "65%",
                }}
              />
            )}
          </div>
        </div>

        {/* Leave Statistics */}
        <div className="p-4 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
          <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
            Leave Statistics
          </h3>
          <div className="h-[250px]">
            {leaveChartData && (
              <Bar
                data={leaveChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: "rgba(0,0,0,0.05)" },
                    },
                    x: { grid: { display: false } },
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Recent Activities & Holidays */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activities */}
        <div className="p-4 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl lg:col-span-2">
          <div className="flex flex-col justify-between gap-2 mb-4 sm:flex-row sm:items-center">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Recent Activities
            </h3>
            <Link
              to="/admin/activities"
              className="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {adminActivities.length > 0 ? (
              adminActivities.map((activity) => (
                <div
                  key={activity.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${getActivityBgColor(activity.type)} transition-all hover:shadow-sm`}
                >
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-white rounded-full shadow-sm dark:bg-gray-800">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      <span className="font-medium">{activity.user}</span>{" "}
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                      <ClockIcon className="w-3 h-3" /> {activity.time}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <ClockIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No recent activities
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Holidays */}
        <div className="p-4 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
          <div className="flex flex-col justify-between gap-2 mb-4 sm:flex-row sm:items-center">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Upcoming Holidays
            </h3>
            <Link
              to="/admin/holidays"
              className="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {adminHolidays.length > 0 ? (
              adminHolidays.map((holiday) => (
                <div
                  key={holiday.id}
                  className="flex items-center justify-between p-3 transition-colors border border-gray-100 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {holiday.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getHolidayTypeColor(holiday.type)}`}
                      >
                        {holiday.type.charAt(0).toUpperCase() +
                          holiday.type.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(holiday.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full dark:bg-primary-900/30 dark:text-primary-400">
                      {holiday.daysLeft} days
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No upcoming holidays
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="p-2 text-center rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Next Holiday
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {adminHolidays.length > 0 ? adminHolidays[0].name : "None"}
              </p>
            </div>
            <div className="p-2 text-center rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Days Until
              </p>
              <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                {adminHolidays.length > 0
                  ? `${adminHolidays[0].daysLeft} days`
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-4 mt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} HRMS Pro. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              PROSPECTING
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              SALES
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              MARKETING
            </span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Dashboard;
