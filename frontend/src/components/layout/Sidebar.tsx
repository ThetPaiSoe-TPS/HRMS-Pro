import { Link, useLocation } from "react-router-dom";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { navigationData } from "../../config/navigation";
import type { NavItem } from "../../config/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "Employee Management",
    "Attendance",
    "Leave Management",
    "Payroll",
    "Reports",
    "Administration",
  ]);

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name],
    );
  };

  const isActive = (href: string) => {
    if (href === "#") return false;
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  const isChildActive = (children: NavItem[] | undefined) => {
    if (!children) return false;
    return children.some((child) => isActive(child.href));
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  const filteredNavigation = navigationData;

  const renderNavItem = (item: NavItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.name);
    const isItemActive =
      isActive(item.href) || (hasChildren && isChildActive(item.children));

    const hasBadge = item.children?.some((child) => child.badge);
    const totalBadge = item.children?.reduce(
      (sum, child) => sum + (child.badge || 0),
      0,
    );

    if (hasChildren) {
      return (
        <div key={item.name} className="mb-1">
          <button
            onClick={() => toggleExpand(item.name)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
              transition-all duration-200
              ${
                isItemActive
                  ? "bg-secondary-900 text-gray-900" // Active: #FCC71E
                  : "bg-primary-900 text-white hover:bg-primary-600/50" // Normal: #D7E2FF
              }
            `}
          >
            <item.icon
              className={`h-5 w-5 flex-shrink-0 ${
                // isItemActive ? "text-gray-900" : "text-gray-600"
                isItemActive ? "text-gray-900" : "text-white"
              }`}
            />
            <span className="flex-1 text-left">{item.name}</span>
            {hasBadge && totalBadge > 0 && (
              <span className="bg-gray-900/20 text-gray-900 text-xs px-2 py-0.5 rounded-full">
                {totalBadge}
              </span>
            )}
            {isExpanded ? (
              <ChevronDownIcon className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronRightIcon className="w-4 h-4 text-gray-600" />
            )}
          </button>

          {isExpanded && (
            <div className="ml-6 mt-1 space-y-0.5">
              {item.children?.map((child) => (
                <Link
                  key={child.name}
                  to={child.href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                    transition-all duration-200
                    ${
                      isActive(child.href)
                        ? "bg-secondary-900 text-gray-900 font-medium" // Active child: #FCC71E
                        : "bg-primary-900 text-white hover:bg-primary-600/30" // Normal child: #D7E2FF/50
                    }
                  `}
                >
                  <child.icon
                    className={`h-4 w-4 flex-shrink-0 ${
                      isActive(child.href) ? "text-gray-900" : "text-white"
                    }`}
                  />
                  <span className="flex-1">{child.name}</span>
                  {child.badge && child.badge > 0 && (
                    <span className="border border-white text-white text-xs px-2 py-0.5 rounded-full">
                      {child.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        to={item.href}
        onClick={onClose}
        className={`
          flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
          transition-all duration-200
          ${
            isActive(item.href)
              ? "bg-secondary-900 text-gray-900" // Active: #FCC71E
              : "bg-primary-900 text-white hover:bg-primary-600/50" // Normal: #D7E2FF
          }
        `}
      >
        <item.icon
          className={`h-5 w-5 flex-shrink-0 ${
            isActive(item.href) ? "text-gray-900" : "text-white"
          }`}
        />
        {item.name}
        {item.badge && item.badge > 0 && (
          <span className="ml-auto bg-gray-900/20 text-gray-900 text-xs px-2 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-primary-900 text-white
          flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 h-16 px-4 border-b border-white/10">
          <Link
            to="/dashboard"
            className="flex items-center gap-3"
            onClick={onClose}
          >
            <div className="flex items-center justify-center w-12 h-12 overflow-hidden border-2 border-white/20 rounded-full">
              <img
                src="/HRSM-pro.png"
                alt="Logo"
                className="object-cover w-full h-full"
              />
            </div>
            <span className="text-lg font-bold text-white">HRMS Pro</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {filteredNavigation.map((item) => renderNavItem(item))}
        </nav>

        {/* Bottom Section - User Profile & Logout */}
        <div className="flex-shrink-0 p-3 border-t border-white/10">
          <Link
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-all duration-200 mb-1"
          >
            <div className="flex items-center justify-center flex-shrink-0 rounded-full h-9 w-9 bg-white/20">
              <span className="text-sm font-medium text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-white/70 capitalize truncate">
                {String(user?.role ?? "").replace("_", " ") || "Employee"}
              </p>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};
