
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { NavItem } from '../../config/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([
    'Employee Management',
    'Attendance',
    'Leave Management',
    'Payroll',
    'Reports',
    'Administration', // Administration is now expanded by default
  ]);

  const toggleExpand = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  const isActive = (href: string) => {
    if (href === '#') return false;
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const isChildActive = (children: NavItem[] | undefined) => {
    if (!children) return false;
    return children.some(child => isActive(child.href));
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  // Check if user has admin permissions
  const hasAdminAccess = () => {
    const role = user?.role;
    return role === 'super_admin' || role === 'hr_manager';
  };

  // Filter navigation based on user role
  const getFilteredNavigation = () => {
    // If user is not admin, remove Administration section
    if (!hasAdminAccess()) {
      return navigation.filter(item => item.name !== 'Administration');
    }
    return navigation;
  };

  const filteredNavigation = getFilteredNavigation();

  const renderNavItem = (item: NavItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.name);
    const isItemActive = isActive(item.href) || (hasChildren && isChildActive(item.children));

    // Check if any child has a badge
    const hasBadge = item.children?.some(child => child.badge);
    const totalBadge = item.children?.reduce((sum, child) => sum + (child.badge || 0), 0);

    if (hasChildren) {
      return (
        <div key={item.name} className="mb-1">
          <button
            onClick={() => toggleExpand(item.name)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
              transition-all duration-200
              ${isItemActive
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }
            `}
          >
            <item.icon className={`h-5 w-5 flex-shrink-0 ${isItemActive ? 'text-primary-600' : 'text-gray-400'}`} />
            <span className="flex-1 text-left">{item.name}</span>
            {hasBadge && totalBadge > 0 && (
              <span className="bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full">
                {totalBadge}
              </span>
            )}
            {isExpanded ? (
              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronRightIcon className="h-4 w-4 text-gray-400" />
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
                    ${isActive(child.href)
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <child.icon className={`h-4 w-4 flex-shrink-0 ${isActive(child.href) ? 'text-primary-500' : 'text-gray-400'}`} />
                  <span className="flex-1">{child.name}</span>
                  {child.badge && child.badge > 0 && (
                    <span className="bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full">
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
          ${isActive(item.href)
            ? 'bg-primary-50 text-primary-700'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          }
        `}
      >
        <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive(item.href) ? 'text-primary-600' : 'text-gray-400'}`} />
        {item.name}
        {item.badge && item.badge > 0 && (
          <span className="ml-auto bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full">
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
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200
          flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200 flex-shrink-0">
          <Link to="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">H</span>
            </div>
            <span className="text-lg font-bold text-gray-900">HRMS Pro</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {filteredNavigation.map((item) => renderNavItem(item))}
          
          {/* Admin status indicator */}
          {hasAdminAccess() && (
            <div className="mt-4 px-3 py-2 bg-primary-50 rounded-lg border border-primary-100">
              <p className="text-xs text-primary-700 font-medium">Admin Access</p>
              <p className="text-xs text-primary-500">{user?.role?.replace('_', ' ').toUpperCase()}</p>
            </div>
          )}
        </nav>

        {/* Bottom Section - User Profile & Logout */}
        <div className="border-t border-gray-200 p-3 flex-shrink-0">
          <Link
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-all duration-200 mb-1"
          >
            <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <span className="text-primary-700 font-medium text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate capitalize">
                {user?.role?.replace('_', ' ') || 'Employee'}
              </p>
            </div>
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};