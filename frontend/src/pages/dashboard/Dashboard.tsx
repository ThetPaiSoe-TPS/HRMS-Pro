import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon,
  UserMinusIcon,
  CheckBadgeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  ClockIcon,
  ArrowPathIcon,
  BellIcon,
  UserPlusIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

// ============================================
// TYPES
// ============================================
interface StatCard {
  title: string;
  value: string | number;
  icon: React.ForwardRefExoticComponent<any>;
  color: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  link?: string;
}

interface RecentActivity {
  id: number;
  user: string;
  user_avatar?: string;
  action: string;
  time: string;
  type: 'leave' | 'attendance' | 'payroll' | 'employee' | 'system';
  icon?: React.ReactNode;
}

interface UpcomingHoliday {
  id: number;
  name: string;
  date: string;
  daysLeft: number;
  type: 'public' | 'company' | 'religious';
}

// ============================================
// MOCK DATA
// ============================================
const mockStats: StatCard[] = [
  {
    title: 'Total Employees',
    value: '100',
    icon: UserGroupIcon,
    color: 'bg-blue-500',
    change: '+12%',
    changeType: 'increase',
    link: '/admin/employees',
  },
  {
    title: 'Present Today',
    value: '85',
    icon: CheckBadgeIcon,
    color: 'bg-green-500',
    change: '+5%',
    changeType: 'increase',
    link: '/admin/attendance',
  },
  {
    title: 'Absent Today',
    value: '15',
    icon: UserMinusIcon,
    color: 'bg-red-500',
    change: '-3%',
    changeType: 'decrease',
    link: '/admin/attendance',
  },
  {
    title: 'Pending Leave',
    value: '8',
    icon: CalendarIcon,
    color: 'bg-yellow-500',
    change: '+2',
    changeType: 'increase',
    link: '/admin/leaves',
  },
  {
    title: 'Payroll This Month',
    value: '$850K',
    icon: CurrencyDollarIcon,
    color: 'bg-purple-500',
    change: '+8%',
    changeType: 'increase',
    link: '/admin/payroll',
  },
  {
    title: 'Departments',
    value: '5',
    icon: BuildingOfficeIcon,
    color: 'bg-indigo-500',
    change: '0',
    changeType: 'neutral',
    link: '/admin/departments',
  },
];

const mockRecentActivities: RecentActivity[] = [
  {
    id: 1,
    user: 'John Doe',
    action: 'submitted a leave request (Annual Leave, 2 days)',
    time: '2 minutes ago',
    type: 'leave',
  },
  {
    id: 2,
    user: 'Jane Smith',
    action: 'checked in at 09:15 AM',
    time: '15 minutes ago',
    type: 'attendance',
  },
  {
    id: 3,
    user: 'Robert Johnson',
    action: 'had payroll approved for December 2024',
    time: '1 hour ago',
    type: 'payroll',
  },
  {
    id: 4,
    user: 'Sarah Williams',
    action: 'updated employee profile',
    time: '2 hours ago',
    type: 'employee',
  },
  {
    id: 5,
    user: 'Michael Brown',
    action: 'submitted a leave request (Sick Leave, 1 day)',
    time: '3 hours ago',
    type: 'leave',
  },
  {
    id: 6,
    user: 'Admin',
    action: 'generated payroll for December 2024',
    time: '5 hours ago',
    type: 'system',
  },
  {
    id: 7,
    user: 'Emily Davis',
    action: 'checked out at 18:30 PM',
    time: '6 hours ago',
    type: 'attendance',
  },
];

const mockUpcomingHolidays: UpcomingHoliday[] = [
  {
    id: 1,
    name: 'Christmas Day',
    date: '2024-12-25',
    daysLeft: 3,
    type: 'public',
  },
  {
    id: 2,
    name: "New Year's Day",
    date: '2025-01-01',
    daysLeft: 10,
    type: 'public',
  },
  {
    id: 3,
    name: 'Independence Day',
    date: '2025-02-04',
    daysLeft: 44,
    type: 'public',
  },
  {
    id: 4,
    name: 'Company Anniversary',
    date: '2025-03-15',
    daysLeft: 83,
    type: 'company',
  },
];

// ============================================
// CHART DATA
// ============================================
const attendanceChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Present',
      data: [85, 88, 82, 90, 87, 45, 30],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
    },
    {
      label: 'Absent',
      data: [15, 12, 18, 10, 13, 55, 70],
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
};

const departmentChartData = {
  labels: ['Engineering', 'HR', 'Finance', 'Marketing', 'Operations'],
  datasets: [
    {
      label: 'Employees by Department',
      data: [35, 15, 12, 20, 18],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(139, 92, 246, 0.8)',
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)',
        'rgb(251, 191, 36)',
        'rgb(236, 72, 153)',
        'rgb(139, 92, 246)',
      ],
      borderWidth: 2,
    },
  ],
};

const leaveChartData = {
  labels: ['Annual', 'Sick', 'Personal', 'Other'],
  datasets: [
    {
      label: 'Leave Requests',
      data: [12, 5, 3, 2],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(236, 72, 153, 0.8)',
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)',
        'rgb(251, 191, 36)',
        'rgb(236, 72, 153)',
      ],
      borderWidth: 1,
    },
  ],
};

// ============================================
// DASHBOARD COMPONENT
// ============================================
export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<StatCard[]>(mockStats);
  const [activities] = useState<RecentActivity[]>(mockRecentActivities);
  const [holidays] = useState<UpcomingHoliday[]>(mockUpcomingHolidays);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'leave':
        return <CalendarIcon className="w-4 h-4 text-yellow-500" />;
      case 'attendance':
        return <ClockIcon className="w-4 h-4 text-green-500" />;
      case 'payroll':
        return <CurrencyDollarIcon className="w-4 h-4 text-purple-500" />;
      case 'employee':
        return <UserPlusIcon className="w-4 h-4 text-blue-500" />;
      case 'system':
        return <Cog6ToothIcon className="w-4 h-4 text-gray-500" />;
      default:
        return <BellIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityBgColor = (type: RecentActivity['type']) => {
    switch (type) {
      case 'leave':
        return 'bg-yellow-50 border-yellow-200';
      case 'attendance':
        return 'bg-green-50 border-green-200';
      case 'payroll':
        return 'bg-purple-50 border-purple-200';
      case 'employee':
        return 'bg-blue-50 border-blue-200';
      case 'system':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getHolidayTypeColor = (type: UpcomingHoliday['type']) => {
    switch (type) {
      case 'public':
        return 'bg-red-100 text-red-800';
      case 'company':
        return 'bg-blue-100 text-blue-800';
      case 'religious':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      {/* ===== STATS CARDS ===== */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <Link
            key={stat.title}
            to={stat.link || '#'}
            className="p-4 transition-all duration-200 bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md hover:border-primary-200 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                  {stat.title}
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-2.5 rounded-lg group-hover:scale-105 transition-transform duration-200`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="mt-2">
              {stat.changeType === 'increase' && (
                <span className="text-xs font-medium text-green-600">↑ {stat.change}</span>
              )}
              {stat.changeType === 'decrease' && (
                <span className="text-xs font-medium text-red-600">↓ {stat.change}</span>
              )}
              {stat.changeType === 'neutral' && (
                <span className="text-xs font-medium text-gray-500">{stat.change}</span>
              )}
              <span className="ml-1 text-xs text-gray-500">from last month</span>
            </div>
          </Link>
        ))}
      </div>

          {/* ===== CHARTS SECTION ===== */}
      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Attendance Chart */}
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Attendance Chart</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="text-xs text-gray-500">Present</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="text-xs text-gray-500">Absent</span>
              </div>
            </div>
          </div>
          <div className="h-[250px]">
            <Line
              data={attendanceChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: 'white',
                    titleColor: '#1f2937',
                    bodyColor: '#6b7280',
                    borderColor: '#e5e7eb',
                    borderWidth: 1,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: 'rgba(0,0,0,0.05)' },
                  },
                  x: {
                    grid: { display: false },
                  },
                },
                interaction: {
                  intersect: false,
                  mode: 'index',
                },
              }}
            />
          </div>
        </div>

        {/* Employee by Department */}
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Employee by Department</h3>
          <div className="h-[250px] flex items-center justify-center">
            <Doughnut
              data={departmentChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      boxWidth: 12,
                      padding: 12,
                      font: { size: 11 },
                    },
                  },
                },
                cutout: '65%',
              }}
            />
          </div>
        </div>

        {/* Leave Statistics */}
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Leave Statistics</h3>
          <div className="h-[250px]">
            <Bar
              data={leaveChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)' },
                  },
                  x: {
                    grid: { display: false },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* ===== RECENT ACTIVITIES & UPCOMING HOLIDAYS ===== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activities */}
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Recent Activities</h3>
            <Link
              to="/admin/activities"
              className="text-xs font-medium text-primary-600 hover:text-primary-700"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${getActivityBgColor(activity.type)} transition-all hover:shadow-sm`}
              >
                <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-white rounded-full shadow-sm">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span>
                    {' '}{activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    <ClockIcon className="w-3 h-3" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Holidays */}
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Upcoming Holidays</h3>
            <Link
              to="/admin/holidays"
              className="text-xs font-medium text-primary-600 hover:text-primary-700"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {holidays.map((holiday) => (
              <div
                key={holiday.id}
                className="flex items-center justify-between p-3 transition-colors border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900">{holiday.name}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getHolidayTypeColor(holiday.type)}`}>
                      {holiday.type.charAt(0).toUpperCase() + holiday.type.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(holiday.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
                    {holiday.daysLeft} days
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 pt-4 mt-4 border-t border-gray-200">
            <div className="p-2 text-center rounded-lg bg-gray-50">
              <p className="text-xs text-gray-500">Next Holiday</p>
              <p className="text-sm font-medium text-gray-900">
                {holidays.length > 0 ? holidays[0].name : 'None'}
              </p>
            </div>
            <div className="p-2 text-center rounded-lg bg-gray-50">
              <p className="text-xs text-gray-500">Days Until</p>
              <p className="text-sm font-medium text-primary-600">
                {holidays.length > 0 ? `${holidays[0].daysLeft} days` : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========== FOOTER ========== */}
      <footer className="pt-4 mt-8 border-t border-gray-200">
        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} HRMS Pro. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">PROSPECTING</span>
            <span className="text-xs text-gray-500">SALES</span>
            <span className="text-xs text-gray-500">MARKETING</span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Dashboard;