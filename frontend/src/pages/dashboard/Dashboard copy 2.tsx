// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import {
//   UserGroupIcon,
//   UserMinusIcon,
//   CheckBadgeIcon,
//   CalendarIcon,
//   CurrencyDollarIcon,
//   BuildingOfficeIcon,
//   ClockIcon,
//   ArrowPathIcon,
//   BellIcon,
//   UserPlusIcon,
//   Cog6ToothIcon,
//   UserIcon,
//   EyeIcon,
// } from "@heroicons/react/24/outline";
// import { useAuth } from "../../hooks/useAuth";
// import { attendanceApi } from "../../api/attendance/attendanceApi";
// import { leaveApi } from "../../api/leave/leaveApi";
// import { announcementApi } from "../../api/announcement/announcementApi";

// // Chart.js imports
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   Filler,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   Filler,
// );

// // ============================================
// // TYPES
// // ============================================
// interface RecentActivity {
//   id: number;
//   user: string;
//   action: string;
//   time: string;
//   type: "leave" | "attendance" | "payroll" | "employee" | "system";
// }

// interface UpcomingHoliday {
//   id: number;
//   name: string;
//   date: string;
//   daysLeft: number;
//   type: "public" | "company" | "religious";
// }

// // ============================================
// // DASHBOARD COMPONENT
// // ============================================
// export const Dashboard: React.FC = () => {
//   const { user } = useAuth();

//   // DEBUG: Log user object to see what's inside
//   console.log("Full user object:", user);
//   console.log("User role:", user?.role);
//   console.log("User role type:", typeof user?.role);
//   console.log("User role_id:", user?.role_id);

//   // Fix: Check both role string AND role_id
//   const userRole =
//     typeof user?.role === "string" ? user.role.toLowerCase() : "";
//   const userRoleId = user?.role_id;

//   // Employee if role is "employee" OR role_id is 4
//   const isEmployee = userRole === "employee" || userRoleId === 4;
//   const isManager =
//     userRole === "manager" ||
//     userRole === "department manager" ||
//     userRoleId === 3;
//   const isAdmin =
//     userRole === "admin" ||
//     userRole === "super_admin" ||
//     userRoleId === 1 ||
//     userRoleId === 2;

//   console.log("isEmployee:", isEmployee);
//   console.log("isManager:", isManager);
//   console.log("isAdmin:", isAdmin);

//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   // Employee-specific state
//   const [todayAttendance, setTodayAttendance] = useState<{
//     checked_in: boolean;
//     checked_out: boolean;
//     check_in_time?: string;
//     check_out_time?: string;
//     status?: string;
//   }>({
//     checked_in: false,
//     checked_out: false,
//   });
//   const [attendanceStats, setAttendanceStats] = useState({
//     present: 0,
//     absent: 0,
//     late: 0,
//     half_day: 0,
//     on_leave: 0,
//     total_days: 0,
//     present_percentage: 0,
//   });
//   const [leaveBalances, setLeaveBalances] = useState<any[]>([]);
//   const [pendingLeaves, setPendingLeaves] = useState<any[]>([]);
//   const [recentAnnouncements, setRecentAnnouncements] = useState<any[]>([]);
//   const [upcomingHolidays, setUpcomingHolidays] = useState<UpcomingHoliday[]>(
//     [],
//   );
//   const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
//     [],
//   );

//   // Fetch employee-specific data
//   useEffect(() => {
//     const fetchEmployeeData = async () => {
//       setLoading(true);
//       try {
//         // Get employee_id from user object
//         const employeeId = user?.employee_id || user?.id;
//         console.log("Employee ID for dashboard:", employeeId);

//         // 1. Get today's attendance
//         const today = new Date().toISOString().split("T")[0];
//         try {
//           const attendanceResult = await attendanceApi.getAttendance({
//             employee_id: String(employeeId),
//             date_from: today,
//             date_to: today,
//             status: "",
//             page: 1,
//             per_page: 1,
//           });

//           console.log("Today's attendance:", attendanceResult);

//           if (attendanceResult.data && attendanceResult.data.length > 0) {
//             const record = attendanceResult.data[0];
//             setTodayAttendance({
//               checked_in: !!record.check_in,
//               checked_out: !!record.check_out,
//               check_in_time: record.check_in,
//               check_out_time: record.check_out,
//               status: record.status,
//             });
//           }
//         } catch (error) {
//           console.log("No attendance data for today", error);
//         }

//         // 2. Get monthly attendance stats
//         const firstDay = new Date(
//           new Date().getFullYear(),
//           new Date().getMonth(),
//           1,
//         )
//           .toISOString()
//           .split("T")[0];
//         const lastDay = new Date().toISOString().split("T")[0];

//         try {
//           const monthlyAttendance = await attendanceApi.getAttendance({
//             employee_id: String(employeeId),
//             date_from: firstDay,
//             date_to: lastDay,
//             status: "",
//             page: 1,
//             per_page: 100,
//           });

//           console.log("Monthly attendance:", monthlyAttendance);

//           const data = monthlyAttendance.data || [];
//           const present = data.filter(
//             (a: any) => a.status === "present",
//           ).length;
//           const absent = data.filter((a: any) => a.status === "absent").length;
//           const late = data.filter((a: any) => a.status === "late").length;
//           const halfDay = data.filter(
//             (a: any) => a.status === "half_day",
//           ).length;
//           const onLeave = data.filter((a: any) => a.status === "leave").length;
//           const total = data.length || 1;

//           setAttendanceStats({
//             present,
//             absent,
//             late,
//             half_day: halfDay,
//             on_leave: onLeave,
//             total_days: total,
//             present_percentage:
//               total > 0 ? Math.round((present / total) * 100) : 0,
//           });
//         } catch (error) {
//           console.log("No monthly attendance data", error);
//         }

//         // 3. Get leave balances
//         try {
//           const leaveResult = await leaveApi.getLeaveBalance();
//           console.log("Leave balances:", leaveResult);
//           setLeaveBalances(leaveResult || []);
//         } catch (error) {
//           console.log("No leave balances data", error);
//           // Try to get leave types as fallback
//           try {
//             const leaveTypes = await leaveApi.getActiveLeaveTypes();
//             const defaultBalances = leaveTypes.map((lt: any) => ({
//               leave_type_id: lt.id,
//               leave_type_name: lt.name,
//               total: lt.days_per_year || 0,
//               used: 0,
//               pending: 0,
//               available: lt.days_per_year || 0,
//               carry_forward: 0,
//             }));
//             setLeaveBalances(defaultBalances);
//           } catch (err) {
//             console.log("Could not fetch leave types", err);
//           }
//         }

//         // 4. Get pending leave requests
//         try {
//           const pendingResult = await leaveApi.getLeaveRequests({
//             employee_id: String(employeeId),
//             status: "pending",
//             page: 1,
//             per_page: 10,
//           });
//           console.log("Pending leaves:", pendingResult);
//           setPendingLeaves(pendingResult?.data || []);
//         } catch (error) {
//           console.log("No pending leave requests", error);
//         }

//         // 5. Get recent announcements
//         try {
//           const announcementsResult = await announcementApi.getAnnouncements({
//             search: "",
//             type: "",
//             status: "",
//             priority: "",
//             pinned: false,
//             important: false,
//             page: 1,
//             per_page: 5,
//           });
//           console.log("Announcements:", announcementsResult);
//           setRecentAnnouncements(announcementsResult?.data || []);
//         } catch (error) {
//           console.log("No announcements data", error);
//         }

//         // 6. Build recent activities (without payroll for employees)
//         const activities: RecentActivity[] = [];
//         let activityId = 1;

//         if (todayAttendance.checked_in) {
//           activities.push({
//             id: activityId++,
//             user: user?.name || "You",
//             action: `checked in at ${todayAttendance.check_in_time || "today"}`,
//             time: "Today",
//             type: "attendance",
//           });
//         }

//         if (pendingLeaves.length > 0) {
//           activities.push({
//             id: activityId++,
//             user: user?.name || "You",
//             action: `has ${pendingLeaves.length} leave request(s) pending approval`,
//             time: "Pending",
//             type: "leave",
//           });
//         }

//         setRecentActivities(activities);

//         // 7. Set upcoming holidays (mock for now)
//         setUpcomingHolidays([
//           {
//             id: 1,
//             name: "Independence Day",
//             date: "2026-07-21",
//             daysLeft: 0,
//             type: "public",
//           },
//           {
//             id: 2,
//             name: "Full Moon Day",
//             date: "2026-08-12",
//             daysLeft: 15,
//             type: "religious",
//           },
//         ]);
//       } catch (error) {
//         console.error("Failed to fetch dashboard data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user) {
//       fetchEmployeeData();
//     }
//   }, [user]);

//   const handleRefresh = () => {
//     setRefreshing(true);
//     setTimeout(() => {
//       setRefreshing(false);
//     }, 1000);
//   };

//   const getActivityIcon = (type: RecentActivity["type"]) => {
//     switch (type) {
//       case "leave":
//         return <CalendarIcon className="w-4 h-4 text-yellow-500" />;
//       case "attendance":
//         return <ClockIcon className="w-4 h-4 text-green-500" />;
//       case "payroll":
//         return <CurrencyDollarIcon className="w-4 h-4 text-purple-500" />;
//       case "employee":
//         return <UserPlusIcon className="w-4 h-4 text-blue-500" />;
//       case "system":
//         return <Cog6ToothIcon className="w-4 h-4 text-gray-500" />;
//       default:
//         return <BellIcon className="w-4 h-4 text-gray-500" />;
//     }
//   };

//   const getActivityBgColor = (type: RecentActivity["type"]) => {
//     switch (type) {
//       case "leave":
//         return "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800";
//       case "attendance":
//         return "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800";
//       case "payroll":
//         return "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800";
//       case "employee":
//         return "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800";
//       case "system":
//         return "bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600";
//       default:
//         return "bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600";
//     }
//   };

//   const getHolidayTypeColor = (type: UpcomingHoliday["type"]) => {
//     switch (type) {
//       case "public":
//         return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
//       case "company":
//         return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
//       case "religious":
//         return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
//       default:
//         return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//     });
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center py-16">
//         <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary-600"></div>
//       </div>
//     );
//   }

//   // ============================================
//   // EMPLOYEE DASHBOARD
//   // ============================================
//   // Force show employee dashboard if isEmployee is true
//   if (isEmployee) {
//     return (
//       <div className="p-4 sm:p-6 lg:p-8">
//         {/* Welcome Header */}
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
//               Welcome back, {user?.name}! 👋
//             </h1>
//             <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//               Here's your personal HR dashboard overview
//             </p>
//           </div>
//           <button
//             onClick={handleRefresh}
//             disabled={refreshing}
//             className="p-2 text-gray-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
//           >
//             <ArrowPathIcon
//               className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
//             />
//           </button>
//         </div>

//         {/* Employee Stats Cards */}
//         <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
//           {/* Today's Attendance */}
//           <div className="p-4 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
//             <div className="flex items-center gap-3">
//               <div
//                 className={`p-2 rounded-lg ${todayAttendance.checked_in ? "bg-green-100 dark:bg-green-900/30" : "bg-gray-100 dark:bg-gray-700"}`}
//               >
//                 {todayAttendance.checked_in ? (
//                   <CheckBadgeIcon className="w-5 h-5 text-green-600" />
//                 ) : (
//                   <ClockIcon className="w-5 h-5 text-gray-400" />
//                 )}
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">
//                   Today's Status
//                 </p>
//                 <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
//                   {todayAttendance.checked_in ? (
//                     todayAttendance.checked_out ? (
//                       <span className="text-gray-600">Completed ✅</span>
//                     ) : (
//                       <span className="text-green-600">Checked In ✅</span>
//                     )
//                   ) : (
//                     <span className="text-gray-500">Not Checked In</span>
//                   )}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Leave Balance */}
//           <div className="p-4 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/30">
//                 <CalendarIcon className="w-5 h-5 text-blue-600" />
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">
//                   Leave Balance
//                 </p>
//                 <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
//                   {leaveBalances.length > 0 ? (
//                     <span>
//                       {leaveBalances.reduce(
//                         (sum, l) => sum + (l.available || 0),
//                         0,
//                       )}{" "}
//                       days
//                     </span>
//                   ) : (
//                     <span className="text-gray-500">0 days</span>
//                   )}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Pending Requests */}
//           <div className="p-4 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-yellow-100 rounded-lg dark:bg-yellow-900/30">
//                 <ClockIcon className="w-5 h-5 text-yellow-600" />
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">
//                   Pending Requests
//                 </p>
//                 <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
//                   {pendingLeaves.length > 0 ? (
//                     <span className="text-yellow-600">
//                       {pendingLeaves.length}
//                     </span>
//                   ) : (
//                     <span className="text-green-600">0</span>
//                   )}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Attendance Rate */}
//           <div className="p-4 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
//             <div className="flex items-center gap-3">
//               <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
//                 <CheckBadgeIcon className="w-5 h-5 text-primary-600" />
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">
//                   Attendance Rate
//                 </p>
//                 <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
//                   {attendanceStats.present_percentage}% this month
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
//           <Link
//             to="/admin/attendance/check"
//             className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
//           >
//             <ClockIcon className="w-5 h-5" />
//             {todayAttendance.checked_in && !todayAttendance.checked_out
//               ? "Check Out"
//               : "Check In"}
//           </Link>
//           <Link
//             to="/admin/leaves/create"
//             className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
//           >
//             <CalendarIcon className="w-5 h-5" />
//             Apply Leave
//           </Link>
//           <Link
//             to="/admin/leaves"
//             className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
//           >
//             <EyeIcon className="w-5 h-5" />
//             View Leaves
//           </Link>
//           <Link
//             to="/profile"
//             className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
//           >
//             <UserIcon className="w-5 h-5" />
//             My Profile
//           </Link>
//         </div>

//         {/* Main Content Grid */}
//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//           {/* Recent Activities - Left Column */}
//           <div className="lg:col-span-2">
//             <div className="p-4 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
//                   Recent Activities
//                 </h2>
//               </div>

//               {recentActivities.length > 0 ? (
//                 <div className="space-y-3">
//                   {recentActivities.map((activity, index) => (
//                     <div
//                       key={index}
//                       className={`flex items-start gap-3 p-3 rounded-lg border ${getActivityBgColor(activity.type)} transition-all`}
//                     >
//                       <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-white rounded-full shadow-sm dark:bg-gray-800">
//                         {getActivityIcon(activity.type)}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm text-gray-900 dark:text-gray-100">
//                           <span className="font-medium">{activity.user}</span>{" "}
//                           {activity.action}
//                         </p>
//                         <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
//                           <ClockIcon className="inline w-3 h-3 mr-1" />
//                           {activity.time}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="py-8 text-center">
//                   <ClockIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
//                   <p className="text-sm text-gray-500 dark:text-gray-400">
//                     No recent activities
//                   </p>
//                 </div>
//               )}

//               {/* Monthly Attendance Summary */}
//               <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
//                 <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Monthly Attendance Summary (
//                   {new Date().toLocaleString("default", { month: "long" })})
//                 </h3>
//                 <div className="grid grid-cols-5 gap-2">
//                   <div className="p-2 text-center rounded-lg bg-green-50 dark:bg-green-900/20">
//                     <p className="text-lg font-bold text-green-600">
//                       {attendanceStats.present}
//                     </p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                       Present
//                     </p>
//                   </div>
//                   <div className="p-2 text-center rounded-lg bg-red-50 dark:bg-red-900/20">
//                     <p className="text-lg font-bold text-red-600">
//                       {attendanceStats.absent}
//                     </p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                       Absent
//                     </p>
//                   </div>
//                   <div className="p-2 text-center rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
//                     <p className="text-lg font-bold text-yellow-600">
//                       {attendanceStats.late}
//                     </p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                       Late
//                     </p>
//                   </div>
//                   <div className="p-2 text-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
//                     <p className="text-lg font-bold text-blue-600">
//                       {attendanceStats.half_day}
//                     </p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                       Half Day
//                     </p>
//                   </div>
//                   <div className="p-2 text-center rounded-lg bg-purple-50 dark:bg-purple-900/20">
//                     <p className="text-lg font-bold text-purple-600">
//                       {attendanceStats.on_leave}
//                     </p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                       On Leave
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column */}
//           <div className="space-y-6">
//             {/* Leave Balance Details */}
//             <div className="p-4 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
//               <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
//                 Leave Balance
//               </h2>
//               {leaveBalances.length > 0 ? (
//                 <div className="space-y-3">
//                   {leaveBalances.slice(0, 4).map((balance, index) => (
//                     <div key={index}>
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-gray-600 dark:text-gray-400">
//                           {balance.leave_type_name}
//                         </span>
//                         <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
//                           {balance.available || 0} days
//                         </span>
//                       </div>
//                       <div className="w-full h-1.5 mt-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
//                         <div
//                           className="h-full rounded-full bg-primary-600"
//                           style={{
//                             width: `${balance.total > 0 ? ((balance.total - (balance.available || 0)) / balance.total) * 100 : 0}%`,
//                           }}
//                         />
//                       </div>
//                       <div className="flex justify-between mt-0.5 text-xs text-gray-400 dark:text-gray-500">
//                         <span>Used: {balance.used || 0}</span>
//                         <span>Total: {balance.total || 0}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   No leave balances available
//                 </p>
//               )}
//             </div>

//             {/* Recent Announcements */}
//             <div className="p-4 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
//               <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
//                 Announcements
//               </h2>
//               {recentAnnouncements.length > 0 ? (
//                 <div className="space-y-3">
//                   {recentAnnouncements.slice(0, 3).map((announcement) => (
//                     <Link
//                       key={announcement.id}
//                       to={`/announcements/${announcement.id}`}
//                       className="block p-2 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
//                     >
//                       <div className="flex items-start gap-2">
//                         {announcement.is_pinned && (
//                           <span className="text-xs text-primary-600">📌</span>
//                         )}
//                         {announcement.is_important && (
//                           <span className="text-xs text-red-600">⚠️</span>
//                         )}
//                         <div>
//                           <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
//                             {announcement.title}
//                           </p>
//                           <p className="text-xs text-gray-500 dark:text-gray-400">
//                             {formatDate(announcement.created_at)}
//                           </p>
//                         </div>
//                       </div>
//                     </Link>
//                   ))}
//                   {recentAnnouncements.length > 3 && (
//                     <Link
//                       to="/announcements"
//                       className="block text-sm text-primary-600 hover:underline"
//                     >
//                       View all →
//                     </Link>
//                   )}
//                 </div>
//               ) : (
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   No announcements
//                 </p>
//               )}
//             </div>

//             {/* Upcoming Holidays */}
//             <div className="p-4 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
//               <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
//                 Upcoming Holidays 🎉
//               </h2>
//               {upcomingHolidays.length > 0 ? (
//                 <div className="space-y-2">
//                   {upcomingHolidays.map((holiday) => (
//                     <div
//                       key={holiday.id}
//                       className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700"
//                     >
//                       <span className="text-sm text-gray-700 dark:text-gray-300">
//                         {holiday.name}
//                       </span>
//                       <span
//                         className={`text-sm px-2 py-0.5 rounded-full ${getHolidayTypeColor(holiday.type)}`}
//                       >
//                         {formatDate(holiday.date)}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   No upcoming holidays
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ============================================
//   // ADMIN / MANAGER DASHBOARD (Fallback)
//   // ============================================
//   return (
//     <div className="p-4 sm:p-6 lg:p-8">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
//             Dashboard
//           </h1>
//           <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//             Welcome back, {user?.name}!
//           </p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
//         <div className="p-4 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs font-medium text-gray-500 uppercase">
//                 Total Employees
//               </p>
//               <p className="mt-1 text-2xl font-bold text-gray-900">100</p>
//             </div>
//             <div className="p-2.5 rounded-lg bg-blue-500">
//               <UserGroupIcon className="w-5 h-5 text-white" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
