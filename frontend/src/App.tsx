import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Login } from './pages/auth/Login';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { Register } from './pages/auth/Register';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Dashboard placeholder
const Dashboard = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-surface-secondary p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-h1 text-text-primary">Dashboard</h1>
        <p className="mt-2 text-body text-text-secondary">
          Welcome back, {user?.name}! You are logged in as <strong>{user?.role}</strong>.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card p-6">
            <h3 className="text-h3 text-text-primary">Total Employees</h3>
            <p className="mt-2 text-3xl font-bold text-primary-600">0</p>
          </div>
          <div className="card p-6">
            <h3 className="text-h3 text-text-primary">Today's Attendance</h3>
            <p className="mt-2 text-3xl font-bold text-primary-600">0</p>
          </div>
          <div className="card p-6">
            <h3 className="text-h3 text-text-primary">Pending Leaves</h3>
            <p className="mt-2 text-3xl font-bold text-primary-600">0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Default Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;