import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import {
  loginSchema,
  type LoginFormData,
} from "../../validations/auth.validation";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { Input } from "../../components/common/Input/Input";
import { Button } from "../../components/common/Button/Button";

// Demo credentials by role
const DEMO_CREDENTIALS = {
  super_admin: {
    email: "super.admin@hrms.com",
    password: "123123123",
    label: "Super Admin",
    icon: ShieldCheckIcon,
    color: "bg-purple-600 hover:bg-purple-700",
  },
  admin: {
    email: "admin@hrms.com",
    password: "password123",
    label: "Admin",
    icon: ShieldCheckIcon,
    color: "bg-[#002A80] hover:bg-[#002060]",
  },
  manager: {
    email: "thandar.aung@hrms.com",
    password: "123123123",
    label: "Manager",
    icon: UserIcon,
    color: "bg-blue-600 hover:bg-blue-700",
  },
  employee: {
    email: "minmin@hrms.com",
    password: "123123123",
    label: "Employee",
    icon: UsersIcon,
    color: "bg-green-600 hover:bg-green-700",
  },
};

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, touchedFields },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      setError(null);
      await login(data.email, data.password, data.remember);
      // Navigation will happen via the useEffect above
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again.",
      );
      setIsLoggingIn(false);
    }
  };

  const handleDemoLogin = async (role: keyof typeof DEMO_CREDENTIALS) => {
    if (isLoggingIn || isLoading || loadingRole) return;
    setLoadingRole(role);
    setIsLoggingIn(true);
    try {
      setError(null);
      const creds = DEMO_CREDENTIALS[role];

      // Set form values
      setValue("email", creds.email);
      setValue("password", creds.password);
      setValue("remember", true);

      // Login
      await login(creds.email, creds.password, true);
      // Navigation will happen via the useEffect above
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Demo login failed. Please try again.",
      );
      setIsLoggingIn(false);
      setLoadingRole(null);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-3 border rounded-input bg-danger-50 border-danger-200">
            <p className="text-small text-danger-700">{error}</p>
          </div>
        )}

        {/* Demo Login Buttons */}
        <div className="space-y-3">
          <p className="text-xs font-medium tracking-wider text-center text-gray-500 uppercase">
            Quick Demo Login
          </p>
          <div className="grid grid-cols-2 gap-2">
            {(
              Object.keys(DEMO_CREDENTIALS) as Array<
                keyof typeof DEMO_CREDENTIALS
              >
            ).map((role) => {
              const creds = DEMO_CREDENTIALS[role];
              const Icon = creds.icon;
              const isButtonLoading = loadingRole === role;
              const isDisabled = (isLoggingIn || isLoading) && !isButtonLoading;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleDemoLogin(role)}
                  disabled={isLoggingIn || isLoading || !!loadingRole}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-btn font-medium text-white transition-all duration-200 ${creds.color} hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isButtonLoading ? (
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
                    <Icon className="w-4 h-4" />
                  )}
                  <span className="text-sm">{creds.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-text-secondary">
              Or sign in with
            </span>
          </div>
        </div>

        {/* Demo Credentials Info */}
        <div className="p-3 border border-blue-200 bg-blue-50 rounded-input">
          <p className="mb-2 text-xs font-medium text-center text-blue-700">
            Demo Credentials
          </p>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div>
              <span className="font-medium text-blue-700">Super Admin:</span>
              <br />
              <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs font-mono">
                super.admin@hrms.com
              </code>
            </div>
            <div>
              <span className="font-medium text-blue-700">Admin:</span>
              <br />
              <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs font-mono">
                admin@hrms.com
              </code>
            </div>
            <div>
              <span className="font-medium text-blue-700">Manager:</span>
              <br />
              <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs font-mono">
                thandar.aung@hrms.com
              </code>
            </div>
            <div>
              <span className="font-medium text-blue-700">Employee:</span>
              <br />
              <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs font-mono">
                minmin@hrms.com
              </code>
            </div>
          </div>
          <p className="mt-1 text-xs text-center text-blue-600">
            Password:{" "}
            <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs font-mono">
              123123123
            </code>{" "}
            for Manager,{" "}
            <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs font-mono">
              asd123!@#
            </code>{" "}
            for others
          </p>
        </div>

        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          leftIcon={<EnvelopeIcon className="w-5 h-5" />}
          error={errors.email?.message}
          touched={!!touchedFields.email}
          {...register("email")}
        />

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          leftIcon={<LockClosedIcon className="w-5 h-5" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-text-tertiary hover:text-text-secondary focus:outline-none"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          }
          error={errors.password?.message}
          touched={!!touchedFields.password}
          {...register("password")}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded-input"
              {...register("remember")}
            />
            <label
              htmlFor="remember"
              className="block ml-2 text-small text-text-primary"
            >
              Remember me
            </label>
          </div>

          <Link
            to="/forgot-password"
            className="font-medium transition-colors text-small text-primary-900 hover:text-secondary-900"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoggingIn || isLoading}
          size="lg"
          disabled={isLoggingIn || isLoading}
        >
          Sign in
        </Button>

        <div className="text-center text-small">
          <span className="text-text-secondary">Don't have an account?</span>{" "}
          <Link
            to="/register"
            className="font-medium transition-colors text-primary-900 hover:text-secondary-900"
          >
            Create one now
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};
