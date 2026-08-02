<?php

namespace App\Http\Controllers\Api\Employee;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Department;
use App\Models\Position;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class EmployeeController extends Controller
{
    use ApiResponseTrait;

    // ============================================
    // ✅ BASIC CRUD
    // ============================================

    public function index(Request $request)
    {
        $query = Employee::with(['department', 'position']);

        if ($request->boolean('with_trashed')) {
            $query->withTrashed();
        }

        if ($request->boolean('only_trashed')) {
            $query->onlyTrashed();
        }

        if ($request->filled('search')) {
            $query->search($request->search);
        }

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->filled('position_id')) {
            $query->where('position_id', $request->position_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $perPage = $request->integer('per_page', 10);
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $employees = $query->orderBy($sortBy, $sortOrder)->paginate($perPage);

        return $this->success($employees, 'Employees retrieved successfully.');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_code' => ['required', 'string', 'max:50', 'unique:employees'],
            'name' => ['required', 'string', 'max:255'],
            'department_id' => ['required', 'exists:departments,id'],
            'position_id' => ['required', 'exists:positions,id'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'hire_date' => ['nullable', 'date'],
            'status' => ['nullable', 'string', 'in:active,inactive'],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'gender' => ['nullable', Rule::in(['male', 'female', 'other'])],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        // ✅ Mutators will auto-format: name, email, phone, employee_code, status
        $employee = Employee::create($validator->validated());

        return $this->created($employee->load(['department', 'position']), 'Employee created successfully.');
    }

    public function show(string $id)
    {
        $employee = Employee::withTrashed()
            ->with(['department', 'position'])
            ->find($id);

        if (!$employee) {
            return $this->notFound('Employee not found.');
        }

        return $this->success($employee, 'Employee retrieved successfully.');
    }

    public function update(Request $request, string $id)
    {
        $employee = Employee::withTrashed()->find($id);

        if (!$employee) {
            return $this->notFound('Employee not found.');
        }

        $validator = Validator::make($request->all(), [
            'employee_code' => ['sometimes', 'string', 'max:50', 'unique:employees,employee_code,' . $id . ',deleted_at,NULL'],
            'name' => ['sometimes', 'string', 'max:255'],
            'department_id' => ['sometimes', 'exists:departments,id'],
            'position_id' => ['sometimes', 'exists:positions,id'],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'gender' => ['nullable', Rule::in(['male', 'female', 'other'])],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'hire_date' => ['nullable', 'date'],
            'status' => ['nullable', 'string', 'in:active,inactive'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        // ✅ Mutators will auto-format
        $employee->update($validator->validated());

        return $this->success($employee->fresh()->load(['department', 'position']), 'Employee updated successfully.');
    }

    public function destroy(Request $request, string $id)
    {
        $employee = Employee::withTrashed()->find($id);

        if (!$employee) {
            return $this->notFound('Employee not found.');
        }

        if ($request->boolean('force')) {
            $employee->forceDelete();
            return $this->noContent();
        }

        $employee->delete();
        return $this->noContent();
    }

    // ============================================
    // ✅ SOFT DELETE & RESTORE
    // ============================================

    public function trash(Request $request)
    {
        $perPage = $request->integer('per_page', 10);
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');

        $employees = Employee::onlyTrashed()
            ->with(['department', 'position'])
            ->orderBy($sortBy, $sortOrder)
            ->paginate($perPage);

        return $this->success($employees, 'Deleted employees retrieved successfully.');
    }

    public function restore(string $id)
    {
        $employee = Employee::onlyTrashed()->find($id);

        if (!$employee) {
            return $this->notFound('Employee not found in trash.');
        }

        $employee->restore();
        return $this->success(null, 'Employee restored successfully.');
    }

    public function forceDelete(string $id)
    {
        $employee = Employee::withTrashed()->find($id);

        if (!$employee) {
            return $this->notFound('Employee not found.');
        }

        $employee->forceDelete();
        return $this->success(null, 'Employee permanently deleted successfully.');
    }

    public function trashCount()
    {
        $count = Employee::onlyTrashed()->count();
        return $this->success(['count' => $count], 'Trash count retrieved successfully.');
    }

    // ============================================
    // ✅ ACCESSORS & MUTATORS DEMO
    // ============================================

    /**
     * GET /employees/with-accessors
     * Show all employees with accessors applied
     */
    public function withAccessors()
    {
        $employees = Employee::with(['department', 'position'])->get();

        // Accessors are automatically applied via $appends
        // Each employee has: full_name, status_badge, experience_years,
        // initials, age, uppercase_name, formatted_employee_code,
        // total_earnings, is_senior, salary_grade

        return $this->success($employees, 'Employees with accessors retrieved.');
    }

    /**
     * POST /employees/with-mutators
     * Create employee with mutators applied
     */
    public function withMutators(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_code' => ['required', 'string', 'unique:employees'],
            'name' => ['required', 'string'],
            'department_id' => ['required', 'exists:departments,id'],
            'position_id' => ['required', 'exists:positions,id'],
            'phone' => ['nullable', 'string'],
            'email' => ['nullable', 'email'],
            'hire_date' => ['nullable', 'date'],
            'status' => ['nullable', 'string', 'in:active,inactive'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $employee = Employee::create($validator->validated());

        return $this->created(
            $employee->load(['department', 'position']),
            'Employee created with mutators applied.'
        );
    }

    /**
     * GET /employees/accessor-demo/{id}
     * Show single employee with all accessors
     */
    public function accessorDemo($id)
    {
        $employee = Employee::with(['department', 'position'])->find($id);

        if (!$employee) {
            return $this->notFound('Employee not found.');
        }

        return $this->success([
            'employee' => $employee,
            'accessors' => [
                'full_name' => $employee->full_name,
                'status_badge' => $employee->status_badge,
                'experience_years' => $employee->experience_years,
                'initials' => $employee->initials,
                'age' => $employee->age,
                'uppercase_name' => $employee->uppercase_name,
                'formatted_employee_code' => $employee->formatted_employee_code,
                'total_earnings' => $employee->total_earnings,
                'is_senior' => $employee->is_senior ? 'Yes' : 'No',
                'salary_grade' => $employee->salary_grade,
            ],
            'raw_data' => [
                'name' => $employee->name,
                'email' => $employee->email,
                'phone' => $employee->phone,
                'employee_code' => $employee->employee_code,
                'status' => $employee->status,
                'hire_date' => $employee->hire_date,
            ],
            'explanation' => [
                'full_name' => 'Employee name (using "name" field)',
                'status_badge' => 'Active/Inactive badge text',
                'experience_years' => 'Years since hire date',
                'initials' => 'Name initials',
                'age' => 'Calculated from date of birth',
                'uppercase_name' => 'Name in uppercase',
                'formatted_employee_code' => 'Employee code with EMP- prefix',
                'total_earnings' => 'Sum of all payroll net salaries',
                'is_senior' => '5+ years of experience',
                'salary_grade' => 'Grade based on average salary (A-E)',
            ],
        ], 'Accessor demo completed.');
    }

    /**
     * POST /employees/mutator-demo
     * Show mutators in action (returns before/after)
     */
    public function mutatorDemo(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string'],
            'email' => ['required', 'email'],
            'phone' => ['nullable', 'string'],
            'employee_code' => ['required', 'string'],
            'status' => ['nullable', 'string', 'in:active,inactive'],
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $data = $validator->validated();

        // Create a temporary instance to see mutator effects
        $employee = new Employee();

        // Before mutators (raw input)
        $before = [
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? '',
            'employee_code' => $data['employee_code'],
            'status' => $data['status'] ?? 'active',
        ];

        // Apply mutators by setting attributes
        $employee->name = $data['name'];
        $employee->email = $data['email'];
        $employee->phone = $data['phone'] ?? '';
        $employee->employee_code = $data['employee_code'];
        $employee->status = $data['status'] ?? 'active';

        // After mutators (formatted)
        $after = [
            'name' => $employee->name,
            'email' => $employee->email,
            'phone' => $employee->phone,
            'employee_code' => $employee->employee_code,
            'status' => $employee->status,
        ];

        return $this->success([
            'before' => $before,
            'after' => $after,
            'mutators_applied' => [
                'name' => 'Capitalized (ucwords)',
                'email' => 'Lowercase',
                'phone' => 'Numbers only',
                'employee_code' => 'Uppercase',
                'status' => 'Validated (active/inactive)',
            ],
        ], 'Mutator demo completed.');
    }

    // ============================================
    // ✅ PHOTO UPLOAD
    // ============================================

    public function uploadPhoto(Request $request, string $id)
    {
        $employee = Employee::withTrashed()->find($id);

        if (!$employee) {
            return $this->notFound('Employee not found.');
        }

        $request->validate([
            'photo' => ['required', 'image', 'max:2048'],
        ]);

        if ($employee->photo) {
            Storage::disk('public')->delete($employee->photo);
        }

        $path = $request->file('photo')->store('employees', 'public');
        $employee->update(['photo' => $path]);

        return $this->success(['photo' => $path], 'Photo uploaded successfully.');
    }

    public function deletePhoto(string $id)
    {
        $employee = Employee::withTrashed()->find($id);

        if (!$employee) {
            return $this->notFound('Employee not found.');
        }

        if (!$employee->photo) {
            return $this->notFound('No photo to delete.');
        }

        Storage::disk('public')->delete($employee->photo);
        $employee->update(['photo' => null]);

        return $this->success(null, 'Photo deleted successfully.');
    }

    // ============================================
    // ✅ EMPLOYEE CODE GENERATION
    // ============================================

    public function generateCode(Request $request)
    {
        $prefix = $request->input('prefix', 'EMP');
        $lastEmployee = Employee::orderBy('id', 'desc')->first();
        $nextNumber = $lastEmployee ? intval(substr($lastEmployee->employee_code, strlen($prefix))) + 1 : 1;
        $code = $prefix . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

        return $this->success(['employee_code' => $code], 'Employee code generated.');
    }

    public function employeeCount()
    {
        $count = Employee::count();
        $options = [];

        if ($count > 0) {
            $options = [5, 10, 20, 50];
            if ($count > 50) {
                $options[] = 100;
            }
            $options = array_filter($options, fn($limit) => $limit <= $count);
        }

        return $this->success([
            'count' => $count,
            'dropdown_options' => array_values($options),
        ], 'Employee count retrieved successfully.');
    }

    // ============================================
    // ✅ PERFORMANCE DEMOS (Lazy vs Eager Loading)
    // ============================================

    public function loadingComparison(Request $request)
    {
        $limit = $request->input('limit', 50);

        // ❌ Lazy Loading
        $start = microtime(true);
        $lazyEmployees = Employee::take($limit)->get();
        $lazyCount = 0;
        foreach ($lazyEmployees as $employee) {
            $deptName = $employee->department->name ?? 'N/A';
            $posTitle = $employee->position->title ?? 'N/A';
            $lazyCount++;
        }
        $lazyTime = microtime(true) - $start;

        // ✅ Eager Loading
        $start = microtime(true);
        $eagerEmployees = Employee::with(['department', 'position'])->take($limit)->get();
        $eagerCount = 0;
        foreach ($eagerEmployees as $employee) {
            $deptName = $employee->department->name ?? 'N/A';
            $posTitle = $employee->position->title ?? 'N/A';
            $eagerCount++;
        }
        $eagerTime = microtime(true) - $start;

        $improvement = $lazyTime > 0 ? round($lazyTime / $eagerTime, 2) : 0;

        return $this->success([
            'comparison' => [
                'lazy_loading' => [
                    'time' => round($lazyTime * 1000, 2) . 'ms',
                    'queries' => $lazyCount + 1,
                    'description' => 'N+1 Problem - Each department loads individually',
                ],
                'eager_loading' => [
                    'time' => round($eagerTime * 1000, 2) . 'ms',
                    'queries' => 3,
                    'description' => 'Optimized - All data loaded in 2 queries',
                ],
                'improvement' => $improvement . 'x faster',
                'query_reduction' => (($lazyCount + 1) - 3) . ' queries saved',
            ],
            'recommendation' => $improvement > 2
                ? '✅ Use Eager Loading for better performance'
                : 'ℹ️ Eager Loading recommended for larger datasets',
            'code_example' => [
                'bad' => 'Employee::all() // N+1 Problem',
                'good' => 'Employee::with(["department", "position"])->get()',
            ],
        ], 'Performance comparison completed.');
    }

    public function showLazyLoading(Request $request)
    {
        DB::enableQueryLog();

        $limit = $request->input('limit', 10);
        $employees = Employee::take($limit)->get();
        $results = [];
        foreach ($employees as $employee) {
            $results[] = [
                'name' => $employee->name,
                'department' => $employee->department->name ?? 'N/A',
            ];
        }

        $queries = DB::getQueryLog();

        return $this->success([
            'results' => $results,
            'total_queries' => count($queries),
            'queries' => $queries,
            'employee_count' => Employee::count(),
            'limit_used' => $limit,
            'warning' => '⚠️ ' . count($queries) . ' queries executed! N+1 Problem!',
            'fix' => 'Use Employee::with("department")->get()',
        ], 'Lazy Loading Demo (Showing N+1 Problem)');
    }

    public function showEagerLoading(Request $request)
    {
        DB::enableQueryLog();

        $limit = $request->input('limit', 10);
        $employees = Employee::with('department')->take($limit)->get();
        $results = [];
        foreach ($employees as $employee) {
            $results[] = [
                'name' => $employee->name,
                'department' => $employee->department->name ?? 'N/A',
            ];
        }

        $queries = DB::getQueryLog();

        return $this->success([
            'results' => $results,
            'total_queries' => count($queries),
            'queries' => $queries,
            'employee_count' => Employee::count(),
            'limit_used' => $limit,
            'success' => '✅ Only ' . count($queries) . ' queries! Optimized!',
        ], 'Eager Loading Demo');
    }

    // ============================================
    // ✅ RELATIONSHIP DEMOS
    // ============================================

    public function whereHasDemo(Request $request)
    {
        $query = Employee::with(['department', 'position']);

        if ($request->boolean('has_payrolls')) {
            $query->whereHas('payrolls');
        }

        if ($request->filled('min_salary')) {
            $query->whereHas('payrolls', function ($q) use ($request) {
                $q->where('net_salary', '>=', $request->min_salary);
            });
        }

        if ($request->boolean('has_leaves')) {
            $query->whereHas('leaves');
        }

        if ($request->boolean('has_attendance')) {
            $query->whereHas('attendances');
        }

        $employees = $query->paginate(15);
        return $this->success($employees, 'WhereHas demo completed.');
    }

    public function hasDemo(Request $request)
    {
        $query = Employee::with(['department', 'position']);

        if ($request->boolean('has_payrolls')) {
            $query->has('payrolls');
        }

        if ($request->filled('payroll_count')) {
            $query->has('payrolls', '>', $request->payroll_count);
        }

        if ($request->boolean('has_both')) {
            $query->has('payrolls')->has('leaves');
        }

        $employees = $query->paginate(15);
        return $this->success($employees, 'Has demo completed.');
    }

    public function withCountDemo(Request $request)
    {
        $employees = Employee::with(['department', 'position'])
            ->withCount([
                'payrolls',
                'leaves',
                'attendances'
            ])
            ->when($request->filled('sort_by_count'), function ($q) use ($request) {
                $field = $request->sort_by_count . '_count';
                $q->orderBy($field, $request->sort_order ?? 'desc');
            })
            ->paginate(15);

        return $this->success($employees, 'WithCount demo completed.');
    }

    public function withExistsDemo()
    {
        $employees = Employee::with(['department', 'position'])
            ->withExists([
                'payrolls',
                'leaves',
                'attendances'
            ])
            ->paginate(15);

        return $this->success($employees, 'WithExists demo completed.');
    }

    public function withSumDemo(Request $request)
    {
        $employees = Employee::with(['department', 'position'])
            ->withSum('payrolls', 'net_salary')
            ->withSum('payrolls', 'basic_salary')
            ->orderBy('payrolls_sum_net_salary', 'desc')
            ->paginate(15);

        return $this->success($employees, 'WithSum demo completed.');
    }

    public function withAvgDemo()
    {
        $employees = Employee::with(['department', 'position'])
            ->withAvg('payrolls', 'net_salary')
            ->paginate(15);

        return $this->success($employees, 'WithAvg demo completed.');
    }

    public function loadDemo(Request $request)
    {
        $employees = Employee::paginate(15);

        $loadable = ['department', 'position', 'payrolls', 'leaves', 'attendances'];
        $toLoad = array_intersect($loadable, $request->input('with', []));

        if (!empty($toLoad)) {
            $employees->load($toLoad);
        }

        return $this->success($employees, 'Load demo completed.');
    }

    public function loadMissingDemo()
    {
        $employees = Employee::with('department')->paginate(15);
        $employees->loadMissing(['position', 'payrolls']);

        return $this->success($employees, 'LoadMissing demo completed.');
    }

    public function appendDemo(Request $request)
    {
        $employees = Employee::paginate(15);

        $employees->each(function ($emp) {
            $emp->append(['full_name', 'total_earnings', 'is_senior', 'salary_grade']);
        });

        return $this->success($employees, 'Append demo completed.');
    }

    public function localScopeDemo()
    {
        // ============================================
        // ✅ BASIC SCOPES
        // ============================================

        // 1️⃣ Active employees
        $active = Employee::active()->get();

        // 2️⃣ Inactive employees
        $inactive = Employee::inactive()->get();

        // 3️⃣ Senior employees (5+ years)
        $senior = Employee::senior()->get();

        // 4️⃣ By department
        $dept1 = Employee::byDepartment(1)->get();

        // 5️⃣ Salary greater than
        $highSalary = Employee::salaryGreaterThan(50000)->get();

        // ============================================
        // ✅ CHAINING SCOPES
        // ============================================

        // 6️⃣ Active senior employees in department 1
        $result = Employee::active()
            ->senior()
            ->byDepartment(1)
            ->get();

        // 7️⃣ Active with salary range
        $filtered = Employee::active()
            ->salaryBetween(30000, 80000)
            ->get();

        // 8️⃣ Search with filters
        $search = Employee::searchByName('John')
            ->active()
            ->byDepartment(1)
            ->get();

        // ============================================
        // ✅ SCOPES WITH RELATIONSHIPS
        // ============================================

        // 9️⃣ Employees with payrolls
        $withPayrolls = Employee::withPayrolls()->get();

        // 🔟 Employees with more than 3 payrolls
        $manyPayrolls = Employee::withPayrollCountGreaterThan(3)->get();

        // 1️⃣1️⃣ Active senior with department loaded
        $result = Employee::activeSenior()
            ->withDepartmentAndPosition()
            ->get();

        // ============================================
        // ✅ COMBINED WITH OTHER QUERY METHODS
        // ============================================

        // 1️⃣2️⃣ Paginate results
        $paginated = Employee::active()
            ->senior()
            ->orderByName()
            ->paginate(15);

        // 1️⃣3️⃣ With counts
        $withCounts = Employee::active()
            ->withCount('payrolls')
            ->get();

        // 1️⃣4️⃣ Conditional filtering
        $status = request('status');
        $employees = Employee::filterByStatus($status)->get();

        return response()->json([
            'active' => $active,
            'senior' => $senior,
            'filtered' => $filtered,
            'paginated' => $paginated,
        ]);
    }

    public function globalScopeDemo()
    {
        // ============================================
        // ✅ GLOBAL SCOPE AUTO-APPLIED
        // ============================================

        // 1️⃣ All queries are automatically ordered by name
        $employees = Employee::all();  // ORDER BY name ASC

        // 2️⃣ Even with other conditions
        $active = Employee::where('status', 'active')->get();  // ORDER BY name ASC

        // 3️⃣ With pagination
        $paginated = Employee::paginate(15);  // ORDER BY name ASC


        // ============================================
        // ✅ REMOVE GLOBAL SCOPES
        // ============================================

        // 4️⃣ Remove ordered scope
        $notOrdered = Employee::withoutOrderedScope()->get();

        // 5️⃣ Remove all global scopes
        $all = Employee::withoutAllScopes()->get();

        // 6️⃣ Remove specific scope by name
        $without = Employee::withoutScope('ordered')->get();


        // ============================================
        // ✅ CHECK WHAT SCOPE IS DOING
        // ============================================

        // 7️⃣ See the SQL with global scope
        DB::enableQueryLog();
        Employee::all();
        $queries = DB::getQueryLog();
        // Query will have: ORDER BY name ASC


        // ============================================
        // ✅ COMBINE WITH LOCAL SCOPES
        // ============================================

        // 8️⃣ Global + Local scopes
        $result = Employee::active()
            ->senior()
            ->get();  // ORDER BY name ASC (global) + WHERE status = active + WHERE hire_date >= ...

        return response()->json([
            'auto_ordered' => $employees,
            'without_ordered' => $notOrdered,
            'without_all' => $all,
            'combined' => $result,
        ]);
    }

    // ============================================
    // ✅ SCOPE DEMO METHODS
    // ============================================

    /**
     * Map hyphenated scope names to Eloquent scope methods
     */
    protected function getScopeMethod(string $scope): ?string
    {
        $map = [
            'active' => 'active',
            'inactive' => 'inactive',
            'senior' => 'senior',
            'active-senior' => 'activeSenior',
            'hired-this-year' => 'hiredThisYear',
            'high-salary' => 'highSalary',
            'with-payrolls' => 'withPayrolls',
            'without-payrolls' => 'withoutPayrolls',
        ];
        return $map[$scope] ?? null;
    }

    /**
     * Map scope names to descriptions
     */
    protected function getScopeDescriptions(): array
    {
        return [
            'active' => 'Filter employees with status = active',
            'inactive' => 'Filter employees with status = inactive',
            'senior' => 'Employees with 5+ years of experience',
            'active-senior' => 'Active employees with 5+ years experience',
            'hired-this-year' => 'Employees hired in current year',
            'high-salary' => 'Employees with salary > 50,000',
            'with-payrolls' => 'Employees who have payroll records',
            'without-payrolls' => 'Employees without any payroll records',
        ];
    }

    /**
     * GET /employees/scope/local/{scope}
     * Run a local scope by name
     */
    public function runLocalScope(Request $request, $scope)
    {
        $query = Employee::with(['department', 'position']);

        $globalScopeEnabled = !session('disable_global_scope', false);

        if (!$globalScopeEnabled) {
            $query->withoutGlobalScope('ordered');
        }

        $method = $this->getScopeMethod($scope);
        if ($method) {
            $query->{$method}();
        }

        $employees = $query->get();

        return $this->success([
            'data' => $employees,
            'meta' => [
                'total' => $employees->count(),
                'scope_name' => $scope,
                'query' => $query->toSql(),
                'has_global_scope' => $globalScopeEnabled,
            ],
        ], 'Scope executed successfully.');
    }

    /**
     * POST /employees/scope/local/{scope}/filter
     * Run a local scope with additional filters
     */
    public function runFilteredScope(Request $request, $scope)
    {
        $query = Employee::with(['department', 'position']);

        $globalScopeEnabled = !session('disable_global_scope', false);

        if (!$globalScopeEnabled) {
            $query->withoutGlobalScope('ordered');
        }

        $method = $this->getScopeMethod($scope);
        if ($method) {
            $query->{$method}();
        }

        $filters = $request->all();
        if (isset($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        $employees = $query->get();

        return $this->success([
            'data' => $employees,
            'meta' => [
                'total' => $employees->count(),
                'scope_name' => $scope,
                'query' => $query->toSql(),
                'has_global_scope' => $globalScopeEnabled,
                'filters' => $filters,
            ],
        ], 'Filtered scope executed successfully.');
    }

    /**
     * GET /employees/scope/local/all
     * Get all local scopes comparison
     */
    public function getLocalScopes()
    {
        $globalScopeEnabled = !session('disable_global_scope', false);
        $descriptions = $this->getScopeDescriptions();

        $localScopes = [];
        foreach ($descriptions as $name => $description) {
            $start = microtime(true);
            $query = Employee::query();

            if (!$globalScopeEnabled) {
                $query->withoutGlobalScope('ordered');
            }

            $method = $this->getScopeMethod($name);
            if ($method) {
                $query->{$method}();
            }

            $count = $query->count();
            $time = round((microtime(true) - $start) * 1000, 2) . 'ms';

            $localScopes[] = [
                'name' => $name,
                'count' => $count,
                'time' => $time,
                'description' => $description,
            ];
        }

        $start = microtime(true);
        $globalQuery = Employee::query();
        if (!$globalScopeEnabled) {
            $globalQuery->withoutGlobalScope('ordered');
        }
        $globalCount = $globalQuery->count();
        $time = round((microtime(true) - $start) * 1000, 2) . 'ms';

        return $this->success([
            'local_scopes' => $localScopes,
            'global_scope' => [
                'name' => 'ordered',
                'count' => $globalCount,
                'time' => $time,
                'description' => 'Automatically applied to ALL queries. Orders employees by name (A-Z).',
                'is_active' => $globalScopeEnabled,
            ],
        ], 'All scopes retrieved successfully.');
    }

    /**
     * POST /employees/scope/global/toggle
     * Toggle the global 'ordered' scope
     */
    public function toggleGlobalScope(Request $request)
    {
        $enabled = $request->boolean('enabled');
        session(['disable_global_scope' => !$enabled]);

        $query = Employee::with(['department', 'position']);
        if (!$enabled) {
            $query->withoutGlobalScope('ordered');
        }
        $employees = $query->get();

        return $this->success([
            'data' => $employees,
            'meta' => [
                'total' => $employees->count(),
                'scope_name' => 'global_toggle',
                'query' => $query->toSql(),
                'has_global_scope' => $enabled,
            ],
        ], 'Global scope toggled successfully.');
    }

    /**
     * GET /employees/scope/global/status
     * Get global scope status
     */
    public function getGlobalScopeStatus()
    {
        $enabled = !session('disable_global_scope', false);

        return $this->success([
            'enabled' => $enabled,
            'query' => 'SELECT * FROM employees ORDER BY name ASC',
        ], 'Global scope status retrieved.');
    }

    /**
     * GET /employees/scope/compare
     * Compare local vs global scopes
     */
    public function compareScopes()
    {
        return $this->getLocalScopes();
    }
}
