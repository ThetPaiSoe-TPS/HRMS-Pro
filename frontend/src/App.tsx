import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
// import { Layout } from './components/layout/Layout';

// Auth Pages
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { ForgotPassword } from "./pages/auth/ForgotPassword";

// Announcements
import { Dashboard } from "./pages/dashboard/Dashboard";
import Profile from "./pages/profile/Profile";
import EmployeeList from "./pages/employee/EmployeeList";
import EmployeeCreate from "./pages/employee/EmployeeCreate";
import EmployeeDetail from "./pages/employee/EmployeeDetail";
import Department from "./pages/department/Department";
import Position from "./pages/position/Position";
import AttendanceList from "./pages/attendance/AttendanceList";
import AttendanceReport from "./pages/reports/AttendanceReport";
import LeaveList from "./pages/leave/LeaveList";
import PayrollList from "./pages/payroll/PayrollList";
import EmployeeReport from "./pages/reports/EmployeeReport";
import LeaveReport from "./pages/reports/LeaveReport";
import PayrollReport from "./pages/reports/PayrollReport";
import Announcements from "./pages/announcements/Announcements";
import UserSettings from "./components/settings/UserSettings";
import Roles from "./pages/roles/Roles";
import Permissions from "./pages/permissions/Permissions";
import AttendanceReportPage from "./pages/attendance/AttendanceReportPage";
import Payslips from "./pages/payroll/Payslips";
import GeneratePayroll from "./pages/payroll/GeneratePayroll";
import LeaveTypes from "./pages/leave/LeaveTypes";
import LeaveApproval from "./pages/leave/LeaveApproval";
import ApplyLeave from "./pages/leave/ApplyLeave";
import CheckInOut from "./pages/leave/CheckInOut";
import CreateUser from "./pages/admin/users/CreateUser";
import { EditUser } from "./pages/admin/users/EditUser";
import Users from "./pages/admin/users/User";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const ProtectedLayout = () => (
  <ProtectedRoute>
    <Dashboard />
    <main className="ml-64 min-h-screen bg-gray-50">
      <Outlet />
    </main>
  </ProtectedRoute>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes with Layout */}
        <Route element={<ProtectedLayout />}>
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Employee Management */}
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/create" element={<EmployeeCreate />} />
          <Route path="/employees/:id" element={<EmployeeDetail />} />
          <Route path="/departments" element={<Department />} />
          <Route path="/positions" element={<Position />} />

          {/* Attendance */}
          <Route path="/attendance" element={<AttendanceList />} />
          <Route path="/attendance/check" element={<CheckInOut />} />
          <Route path="/attendance/report" element={<AttendanceReport />} />

          {/* Leave Management */}
          <Route path="/leaves" element={<LeaveList />} />
          <Route path="/leaves/create" element={<ApplyLeave />} />
          <Route path="/leaves/approval" element={<LeaveApproval />} />
          <Route path="/leave-types" element={<LeaveTypes />} />

          {/* Payroll */}
          <Route path="/payroll" element={<PayrollList />} />
          <Route path="/payroll/generate" element={<GeneratePayroll />} />
          <Route path="/payslips" element={<Payslips />} />

          {/* Reports */}
          <Route path="/reports/employees" element={<EmployeeReport />} />
          <Route
            path="/reports/attendance"
            element={<AttendanceReportPage />}
          />
          <Route path="/reports/leaves" element={<LeaveReport />} />
          <Route path="/reports/payroll" element={<PayrollReport />} />

          {/* Announcements */}
          <Route path="/announcements" element={<Announcements />} />

          {/* Administration */}
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/roles" element={<Roles />} />
          <Route path="/admin/permissions" element={<Permissions />} />
          <Route path="/admin/settings" element={<UserSettings />} />

          {/* Profile */}
          <Route path="/profile" element={<Profile />} />

          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/users/create" element={<CreateUser />} />
          <Route path="/admin/users/:id/edit" element={<EditUser />} />
        </Route>

        {/* Default Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
