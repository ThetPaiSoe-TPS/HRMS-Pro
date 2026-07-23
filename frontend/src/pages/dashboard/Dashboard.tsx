import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  ClockIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  MegaphoneIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../hooks/useAuth";

interface NavItem {
  name: string;
  icon: React.ForwardRefExoticComponent<any>;
  href: string;
  children?: NavItem[];
}

export const Dashboard: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([
    "Employee Management",
  ]);

  const navigation: NavItem[] = [
    { name: "Dashboard", icon: HomeIcon, href: "/dashboard" },
    {
      name: "Employee Management",
      icon: UsersIcon,
      href: "#",
      children: [
        { name: "Employee List", icon: UsersIcon, href: "/employees" },
        { name: "Add Employee", icon: UsersIcon, href: "/employees/create" },
        { name: "Departments", icon: UsersIcon, href: "/departments" },
        { name: "Positions", icon: UsersIcon, href: "/positions" },
        {
          name: "Profile",
          icon: UserCircleIcon,
          href: "/profile",
        },
      ],
    },
    {
      name: "Attendance",
      icon: ClockIcon,
      href: "#",
      children: [
        { name: "Attendance Records", icon: ClockIcon, href: "/attendance" },
        {
          name: "Check In / Check Out",
          icon: ClockIcon,
          href: "/attendance/check",
        },
        {
          name: "Attendance Report",
          icon: ClockIcon,
          href: "/attendance/report",
        },
      ],
    },
    {
      name: "Leave Management",
      icon: CalendarDaysIcon,
      href: "#",
      children: [
        { name: "Leave Requests", icon: CalendarDaysIcon, href: "/leaves" },
        { name: "Apply Leave", icon: CalendarDaysIcon, href: "/leaves/create" },
        {
          name: "Leave Approval",
          icon: CalendarDaysIcon,
          href: "/leaves/approval",
        },
        { name: "Leave Types", icon: CalendarDaysIcon, href: "/leave-types" },
      ],
    },
    {
      name: "Payroll",
      icon: CurrencyDollarIcon,
      href: "#",
      children: [
        { name: "Payroll List", icon: CurrencyDollarIcon, href: "/payroll" },
        {
          name: "Generate Payroll",
          icon: CurrencyDollarIcon,
          href: "/payroll/generate",
        },
        { name: "Payslips", icon: CurrencyDollarIcon, href: "/payslips" },
      ],
    },
    {
      name: "Reports",
      icon: ChartBarIcon,
      href: "#",
      children: [
        {
          name: "Employee Report",
          icon: ChartBarIcon,
          href: "/reports/employees",
        },
        {
          name: "Attendance Report",
          icon: ChartBarIcon,
          href: "/reports/attendance",
        },
        { name: "Leave Report", icon: ChartBarIcon, href: "/reports/leaves" },
        {
          name: "Payroll Report",
          icon: ChartBarIcon,
          href: "/reports/payroll",
        },
      ],
    },
    { name: "Announcements", icon: MegaphoneIcon, href: "/announcements" },
    {
      name: "Administration",
      icon: Cog6ToothIcon,
      href: "#",
      children: [
        { name: "Users", icon: Cog6ToothIcon, href: "/admin/users" },
        { name: "Roles", icon: Cog6ToothIcon, href: "/admin/roles" },
        {
          name: "Permissions",
          icon: Cog6ToothIcon,
          href: "/admin/permissions",
        },
        { name: "Settings", icon: Cog6ToothIcon, href: "/admin/settings" },
      ],
    },
  ];

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name],
    );
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col z-50">
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">H</span>
          </div>
          <span className="text-lg font-bold text-gray-900">HRMS Pro</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navigation.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleExpand(item.name)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                    transition-colors duration-200
                    ${
                      expandedItems.includes(item.name)
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="flex-1 text-left">{item.name}</span>
                  <svg
                    className={`
                      h-4 w-4 transition-transform duration-200
                      ${expandedItems.includes(item.name) ? "rotate-180" : ""}
                    `}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {expandedItems.includes(item.name) && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        to={child.href}
                        className={`
                          flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                          transition-colors duration-200
                          ${
                            location.pathname === child.href
                              ? "bg-primary-50 text-primary-700"
                              : "text-gray-600 hover:bg-gray-100"
                          }
                        `}
                      >
                        <child.icon className="h-4 w-4" />
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                  transition-colors duration-200
                  ${
                    location.pathname === item.href
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Profile Section */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-primary-700 font-medium">
              {user?.name?.charAt(0) || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.role || "Employee"}
            </p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
