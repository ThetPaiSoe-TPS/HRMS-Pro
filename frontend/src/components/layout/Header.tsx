import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-16 flex items-center px-4 lg:px-6 flex-shrink-0 dark:bg-gray-900 dark:border-gray-700">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors dark:hover:bg-gray-800"
      >
        <Bars3Icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
      </button>

      <div className="flex-1 ml-4 flex items-center justify-between">
        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 max-w-md w-full dark:bg-gray-800 dark:border dark:border-gray-700">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400 dark:text-gray-200 dark:placeholder-gray-500"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-xs bg-gray-200 rounded text-gray-500 dark:bg-gray-700 dark:text-gray-400">
            ⌘K
          </kbd>
        </div>

        <div className="flex items-center gap-1 sm:gap-3">
          <ThemeToggle />

          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors dark:hover:bg-gray-800">
            <BellIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="h-8 w-px bg-gray-200 hidden sm:block dark:bg-gray-700"></div>

          {/* User Avatar */}
          <Link to="/profile" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center dark:bg-primary-900">
              <span className="text-primary-700 text-sm font-medium dark:text-primary-300">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <span className="text-sm text-gray-700 hidden sm:inline dark:text-gray-200">
              {user?.name}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};
