import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

// Auth Pages
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { ForgotPassword } from "./pages/auth/ForgotPassword";

// Announcements
import { Dashboard } from "./pages/dashboard/Dashboard";
import { Layout } from "./components/layout/Layout";
import Profile from "./pages/profile/Profile";
import EmployeeList, { Employees } from "./pages/employees/Employees";
import EmployeeCreate, {
  CreateEmployee,
} from "./pages/employees/CreateEmployee";
import EmployeeDetail from "./pages/employees/EmployeeDetail";
import Department, { Departments } from "./pages/department/Departments";
import Position, { Positions } from "./pages/admin/positions/Positions";
import AttendanceList, {
  AttendancePage,
} from "./pages/admin/attendance/Attendance";
import LeaveList, { LeaveRequests } from "./pages/admin/leaves/LeaveRequest";
import PayrollList from "./pages/admin/payroll/PayrollList";
import EmployeeReport from "./pages/admin/reports/EmployeeReport";
import LeaveReport from "./pages/admin/reports/LeaveReport";
import PayrollReport from "./pages/admin/reports/PayrollReport";
import Announcements from "./pages/announcements/Announcements";
import UserSettings from "./pages/admin/settings/Setting";
import Roles from "./pages/admin/roles/Roles";
import Permissions from "./pages/permissions/Permissions";
import AttendanceReportPage, {
  AttendanceReport,
} from "./pages/admin/attendance/AttendanceReportPage";
import Payslips from "./pages/admin/payroll/Payslips";
import GeneratePayroll from "./pages/admin/payroll/GeneratePayroll";
import LeaveTypes from "./pages/admin/leaves/LeaveTypes";
import LeaveApproval from "./pages/admin/leaves/LeaveApproval";
import ApplyLeave from "./pages/admin/leaves/ApplyLeave";
import CreateUser from "./pages/admin/users/CreateUser";
import { EditUser } from "./pages/admin/users/EditUser";
import Users from "./pages/admin/users/User";
import CreateRole from "./pages/admin/roles/CreateRole";
import EditRole from "./pages/admin/roles/EditRole";
import CreatePermission from "./pages/permissions/CreatePermission";
import EditPermission from "./pages/permissions/EditPermission";
import CreateDepartment from "./pages/department/CreateDepartment";
import EditDepartment from "./pages/department/EditDepartment";
import CreatePosition from "./pages/admin/positions/CreatePosition";
import EditPosition from "./pages/admin/positions/EditPosition";
import EditEmployee from "./pages/employees/EditEmployee";
import CheckInOut from "./pages/admin/attendance/CheckInOut";
import CreateLeaveType from "./pages/admin/leaves/CreateLeaveTypes";
import EditLeaveType from "./pages/admin/leaves/EditLeaveType";
import Settings from "./pages/settings/Settings";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-primary-600"></div>
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
    <Layout />
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

          <Route path="/admin/roles" element={<Roles />} />
          <Route path="/admin/roles/create" element={<CreateRole />} />
          <Route path="/admin/roles/:id/edit" element={<EditRole />} />

          <Route path="/admin/permissions" element={<Permissions />} />
          <Route
            path="/admin/permissions/create"
            element={<CreatePermission />}
          />
          <Route
            path="/admin/permissions/:id/edit"
            element={<EditPermission />}
          />

          <Route path="/admin/departments" element={<Departments />} />
          <Route
            path="/admin/departments/create"
            element={<CreateDepartment />}
          />
          <Route
            path="/admin/departments/:id/edit"
            element={<EditDepartment />}
          />

          <Route path="/admin/positions" element={<Positions />} />
          <Route path="/admin/positions/create" element={<CreatePosition />} />
          <Route path="/admin/positions/:id/edit" element={<EditPosition />} />

          {/* Employee Management */}
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/create" element={<EmployeeCreate />} />
          <Route path="/employees/:id" element={<EmployeeDetail />} />
          <Route path="/departments" element={<Department />} />
          <Route path="/positions" element={<Position />} />

          <Route path="/admin/attendance" element={<AttendancePage />} />
          <Route path="/admin/attendance/check" element={<CheckInOut />} />
          <Route
            path="/admin/attendance/report"
            element={<AttendanceReport />}
          />

          <Route path="/admin/leave-types" element={<LeaveTypes />} />
          <Route path="/admin/leaves" element={<LeaveRequests />} />
          <Route path="/admin/leaves/create" element={<ApplyLeave />} />
          <Route
            path="/admin/leave-types/create"
            element={<CreateLeaveType />}
          />
          <Route
            path="/admin/leave-types/:id/edit"
            element={<EditLeaveType />}
          />

          <Route path="/admin/employees" element={<Employees />} />
          <Route path="/admin/employees/create" element={<CreateEmployee />} />
          <Route path="/admin/employees/:id/edit" element={<EditEmployee />} />

          {/* Payroll */}
          <Route path="/admin/payroll" element={<PayrollList />} />
          <Route path="/admin/payroll/generate" element={<GeneratePayroll />} />

          {/* Reports */}
          <Route path="/admin/reports/employees" element={<EmployeeReport />} />
          <Route path="/admin/reports/leaves" element={<LeaveReport />} />
          <Route path="/admin/reports/payroll" element={<PayrollReport />} />
          <Route
            path="/reports/attendance"
            element={<AttendanceReportPage />}
          />

          {/* Announcements */}
          <Route path="/announcements" element={<Announcements />} />

          {/* Administration */}
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/roles" element={<Roles />} />
          <Route path="/admin/permissions" element={<Permissions />} />
          

          <Route path="/admin/settings" element={<Settings />} />

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
