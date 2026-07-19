File 18: Performance Requirements
1. Performance Targets
API Response Times
Endpoint Type	Target Response Time	Max Acceptable
Simple GET	< 100ms	200ms
Complex GET	< 300ms	500ms
POST/PUT	< 200ms	500ms
Bulk Actions	< 500ms	1s
Reports	< 1s	3s
File Upload	< 2s	5s
Page Load Times
Page Type	Target Load Time	Max Acceptable
Dashboard	< 1s	2s
List Pages	< 1.5s	2.5s
Detail Pages	< 1s	2s
Forms	< 1s	1.5s
Reports	< 2s	4s
2. Database Optimization
Query Optimization
php
// Eager Loading
$employees = Employee::with([
    'department', 
    'position', 
    'attendance' => function($query) {
        $query->whereMonth('date', now()->month);
    }
])->get();

// Avoid N+1 Problem
// Bad:
$employees = Employee::all();
foreach ($employees as $employee) {
    $department = $employee->department; // N+1 queries
}

// Good:
$employees = Employee::with('department')->get();

// Use Select Only Needed Fields
$employees = Employee::select(
    'id', 
    'first_name', 
    'last_name', 
    'email', 
    'department_id'
)->with('department:id,name')->get();

// Pagination vs All
$employees = Employee::paginate(15); // Use pagination
Index Strategy
sql
-- Employee Table Indexes
CREATE INDEX idx_employee_email ON employees(email);
CREATE INDEX idx_employee_employee_code ON employees(employee_code);
CREATE INDEX idx_employee_department_id ON employees(department_id);
CREATE INDEX idx_employee_position_id ON employees(position_id);
CREATE INDEX idx_employee_status ON employees(employment_status);

-- Attendance Table Indexes
CREATE INDEX idx_attendance_employee_date ON attendance_records(employee_id, date);
CREATE INDEX idx_attendance_date ON attendance_records(date);
CREATE INDEX idx_attendance_status ON attendance_records(status);

-- Leave Table Indexes
CREATE INDEX idx_leave_employee_status ON leave_requests(employee_id, status);
CREATE INDEX idx_leave_dates ON leave_requests(start_date, end_date);

-- Payroll Table Indexes
CREATE INDEX idx_payroll_employee_month ON payrolls(employee_id, payroll_month);
CREATE INDEX idx_payroll_status ON payrolls(payment_status);
Query Caching
php
// Cache frequently accessed data
class DashboardService
{
    public function getStatistics()
    {
        return Cache::remember('dashboard_stats', 3600, function () {
            return [
                'total_employees' => Employee::count(),
                'present_today' => Attendance::whereDate('date', today())->count(),
                'pending_leaves' => LeaveRequest::where('status', 'pending')->count(),
                'departments' => Department::withCount('employees')->get(),
            ];
        });
    }
    
    // Cache invalidation on update
    public function clearCache()
    {
        Cache::forget('dashboard_stats');
        Cache::forget('employee_list');
    }
}
3. Frontend Performance
React Optimization
javascript
// Lazy Loading Components
const EmployeeList = React.lazy(() => import('./components/EmployeeList'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));

function App() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/employees" element={<EmployeeList />} />
            </Routes>
        </Suspense>
    );
}

// Memoization
const EmployeeCard = React.memo(({ employee, onUpdate }) => {
    // Component logic
});

// Virtual Scrolling for Large Lists
import { FixedSizeList } from 'react-window';

function EmployeeList({ employees }) {
    return (
        <FixedSizeList
            height={600}
            itemCount={employees.length}
            itemSize={60}
            width="100%"
        >
            {({ index, style }) => (
                <div style={style}>
                    <EmployeeItem employee={employees[index]} />
                </div>
            )}
        </FixedSizeList>
    );
}

// Debounce Search Input
const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
};

const SearchInput = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useCallback(
        debounce((value) => {
            // API call
        }, 500),
        []
    );
    
    return (
        <input
            onChange={(e) => {
                setSearchTerm(e.target.value);
                debouncedSearch(e.target.value);
            }}
        />
    );
};
Bundle Optimization
javascript
// webpack.config.js
module.exports = {
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    priority: 10,
                },
                react: {
                    test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                    name: 'react-vendor',
                    priority: 20,
                },
            },
        },
        runtimeChunk: 'single',
        minimize: true,
    },
};

// Code Splitting
const EmployeeModule = {
    path: '/employees',
    component: lazy(() => import('./pages/Employees')),
    preload: () => import('./pages/Employees'),
};
4. Caching Strategy
Redis Cache Configuration
php
// config/cache.php
'stores' => [
    'redis' => [
        'driver' => 'redis',
        'connection' => 'cache',
        'lock_connection' => 'default',
        'prefix' => 'hrms_cache_',
        'expire' => 3600,
    ],
],

// Cache Configuration
return [
    'default' => 'redis',
    'prefix' => 'hrms_pro',
    'ttl' => [
        'dashboard' => 3600, // 1 hour
        'employee_list' => 1800, // 30 minutes
        'department_list' => 7200, // 2 hours
        'attendance_summary' => 900, // 15 minutes
        'report_cache' => 86400, // 24 hours
    ],
];
5. Load Testing
Performance Test Scenarios
javascript
// k6 load test - Detailed
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate, Gauge } from 'k6/metrics';

const responseTime = new Trend('response_time');
const errorRate = new Rate('error_rate');
const activeUsers = new Gauge('active_users');

export const options = {
    stages: [
        { duration: '2m', target: 10 },  // Ramp up to 10 users
        { duration: '5m', target: 50 },  // Ramp up to 50 users
        { duration: '10m', target: 100 }, // Peak load
        { duration: '5m', target: 0 },    // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<500', 'p(99)<1000'],
        error_rate: ['rate<0.05'], // Less than 5% errors
        response_time: ['avg<200'],
    },
};

const BASE_URL = 'http://localhost:8000/api/v1';
const token = __ENV.TOKEN;

export default function () {
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
    
    // Test endpoints
    const endpoints = [
        '/dashboard/statistics',
        '/employees?page=1',
        '/attendance?today=true',
        '/leave-requests?status=pending',
    ];
    
    endpoints.forEach(endpoint => {
        const start = Date.now();
        const response = http.get(`${BASE_URL}${endpoint}`, { headers });
        responseTime.add(Date.now() - start);
        errorRate.add(response.status !== 200);
        
        check(response, {
            'status is 200': (r) => r.status === 200,
            'response time < 500ms': (r) => r.timings.duration < 500,
        });
        
        sleep(1);
    });
    
    activeUsers.add(__ENV.CONCURRENT_USERS || 1);
}