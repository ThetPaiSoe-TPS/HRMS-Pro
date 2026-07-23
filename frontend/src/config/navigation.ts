import {
  HomeIcon,
  UsersIcon,
  UserPlusIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  ClockIcon,
  CheckBadgeIcon,
  CalendarDaysIcon,
  PencilSquareIcon,
  ListBulletIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ChartBarIcon,
  MegaphoneIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  UserGroupIcon,
  UserMinusIcon,
  CalendarIcon,
  ArrowRightOnRectangleIcon,
  DocumentArrowUpIcon,
  KeyIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

export interface NavItem {
  name: string;
  icon: React.ForwardRefExoticComponent<any>;
  href: string;
  children?: NavItem[];
  badge?: number;
}

export const navigation: NavItem[] = [
  // ============================================
  // DASHBOARD
  // ============================================
  {
    name: 'Dashboard',
    icon: HomeIcon,
    href: '/dashboard',
  },

  // ============================================
  // EMPLOYEE MANAGEMENT
  // ============================================
  {
    name: 'Employee Management',
    icon: UsersIcon,
    href: '#',
    children: [
      { name: 'Employee List', icon: UsersIcon, href: '/employees' },
      { name: 'Add Employee', icon: UserPlusIcon, href: '/employees/create' },
      { name: 'Departments', icon: BuildingOfficeIcon, href: '/departments' },
      { name: 'Positions', icon: BriefcaseIcon, href: '/positions' },
    ],
  },

  // ============================================
  // ATTENDANCE
  // ============================================
  {
    name: 'Attendance',
    icon: ClockIcon,
    href: '#',
    children: [
      { name: 'Attendance Records', icon: DocumentArrowUpIcon, href: '/attendance' },
      { name: 'Check In / Check Out', icon: ClockIcon, href: '/attendance/check' },
      { name: 'Attendance Report', icon: ChartBarIcon, href: '/attendance/report' },
    ],
  },

  // ============================================
  // LEAVE MANAGEMENT
  // ============================================
  {
    name: 'Leave Management',
    icon: CalendarDaysIcon,
    href: '#',
    children: [
      { name: 'Leave Requests', icon: ListBulletIcon, href: '/leaves' },
      { name: 'Apply Leave', icon: PencilSquareIcon, href: '/leaves/create' },
      { name: 'Leave Approval', icon: CheckBadgeIcon, href: '/leaves/approval' },
      { name: 'Leave Types', icon: CalendarIcon, href: '/leave-types' },
    ],
  },

  // ============================================
  // PAYROLL
  // ============================================
  {
    name: 'Payroll',
    icon: CurrencyDollarIcon,
    href: '#',
    children: [
      { name: 'Payroll List', icon: DocumentTextIcon, href: '/payroll' },
      { name: 'Generate Payroll', icon: CurrencyDollarIcon, href: '/payroll/generate' },
      { name: 'Payslips', icon: DocumentTextIcon, href: '/payslips' },
    ],
  },

  // ============================================
  // REPORTS
  // ============================================
  {
    name: 'Reports',
    icon: ChartBarIcon,
    href: '#',
    children: [
      { name: 'Employee Report', icon: UsersIcon, href: '/reports/employees' },
      { name: 'Attendance Report', icon: ClockIcon, href: '/reports/attendance' },
      { name: 'Leave Report', icon: CalendarDaysIcon, href: '/reports/leaves' },
      { name: 'Payroll Report', icon: CurrencyDollarIcon, href: '/reports/payroll' },
    ],
  },

  // ============================================
  // ANNOUNCEMENTS
  // ============================================
  {
    name: 'Announcements',
    icon: MegaphoneIcon,
    href: '/announcements',
  },

  // ============================================
  // ADMINISTRATION (Expanded with Users)
  // ============================================
  {
    name: 'Administration',
    icon: Cog6ToothIcon,
    href: '#',
    children: [
      { 
        name: 'Users', 
        icon: UserGroupIcon, 
        href: '/admin/users',
        badge: 5, // Show pending users count
      },
      { 
        name: 'Create User', 
        icon: UserPlusIcon, 
        href: '/admin/users/create' 
      },
      { name: 'Roles', icon: ShieldCheckIcon, href: '/admin/roles' },
      { name: 'Permissions', icon: KeyIcon, href: '/admin/permissions' },
      { name: 'Settings', icon: Cog6ToothIcon, href: '/admin/settings' },
    ],
  },

  // ============================================
  // PROFILE (Bottom Section)
  // ============================================
  {
    name: 'Profile',
    icon: UserCircleIcon,
    href: '/profile',
  },
];