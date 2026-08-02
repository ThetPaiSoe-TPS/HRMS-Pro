<?php

namespace App\Http\Controllers\Api\Employee;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class EmployeeController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request)
    {
        $query = \App\Models\Employee::with(['department', 'position']);

        if ($request->boolean('with_trashed')) {
            $query->withTrashed();
        }

        if ($request->boolean('only_trashed')) {
            $query->onlyTrashed();
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('employee_code', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%');
            });
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

        $employee = \App\Models\Employee::create($validator->validated());

        return $this->created($employee, 'Employee created successfully.');
    }

    public function show(string $id)
    {
        $employee = \App\Models\Employee::withTrashed()
            ->with(['department', 'position'])
            ->find($id);

        if (! $employee) {
            return $this->notFound('Employee not found.');
        }

        return $this->success($employee, 'Employee retrieved successfully.');
    }

    public function update(Request $request, string $id)
    {
        $employee = \App\Models\Employee::withTrashed()->find($id);

        if (! $employee) {
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

        $employee->update($validator->validated());

        return $this->success($employee, 'Employee updated successfully.');
    }

    public function destroy(Request $request, string $id)
    {
        $employee = \App\Models\Employee::withTrashed()->find($id);

        if (! $employee) {
            return $this->notFound('Employee not found.');
        }

        if ($request->boolean('force')) {
            $employee->forceDelete();

            return $this->noContent();
        }

        $employee->delete();

        return $this->noContent();
    }

    public function trash(Request $request)
    {
        $perPage = $request->integer('per_page', 10);
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');

        $employees = \App\Models\Employee::onlyTrashed()
            ->with(['department', 'position'])
            ->orderBy($sortBy, $sortOrder)
            ->paginate($perPage);

        return $this->success($employees, 'Deleted employees retrieved successfully.');
    }

    public function restore(string $id)
    {
        $employee = \App\Models\Employee::onlyTrashed()->find($id);

        if (! $employee) {
            return $this->notFound('Employee not found in trash.');
        }

        $employee->restore();

        return $this->success(null, 'Employee restored successfully.');
    }

    public function forceDelete(string $id)
    {
        $employee = \App\Models\Employee::withTrashed()->find($id);

        if (! $employee) {
            return $this->notFound('Employee not found.');
        }

        $employee->forceDelete();

        return $this->success(null, 'Employee permanently deleted successfully.');
    }

    public function uploadPhoto(Request $request, string $id)
    {
        $employee = \App\Models\Employee::withTrashed()->find($id);

        if (! $employee) {
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
        $employee = \App\Models\Employee::withTrashed()->find($id);

        if (! $employee) {
            return $this->notFound('Employee not found.');
        }

        if (! $employee->photo) {
            return $this->notFound('No photo to delete.');
        }

        Storage::disk('public')->delete($employee->photo);
        $employee->update(['photo' => null]);

        return $this->success(null, 'Photo deleted successfully.');
    }

    public function generateCode(Request $request)
    {
        $prefix = $request->input('prefix', 'EMP');
        $lastEmployee = \App\Models\Employee::orderBy('id', 'desc')->first();
        $nextNumber = $lastEmployee ? intval(substr($lastEmployee->employee_code, strlen($prefix))) + 1 : 1;
        $code = $prefix . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

        return $this->success(['employee_code' => $code], 'Employee code generated.');
    }

    public function trashCount()
    {
        $count = \App\Models\Employee::onlyTrashed()->count();

        return $this->success(['count' => $count], 'Trash count retrieved successfully.');
    }

    public function employeeCount()
    {
        $count = \App\Models\Employee::count();
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

    public function loadingComparison(Request $request)
    {
        $limit = $request->input('limit', 50);

        $start = microtime(true);

        $lazyEmployees = Employee::take($limit)->get();
        $lazyCount = 0;
        foreach ($lazyEmployees as $employee) {
            // This triggers N+1 queries!
            $deptName = $employee->department->name ?? 'N/A';
            $posTitle = $employee->position->title ?? 'N/A';
            $lazyCount++;
        }
        $lazyTime = microtime(true) - $start;

        // ============================================
        // ✅ TEST 2: EAGER LOADING (GOOD)
        // ============================================
        $start = microtime(true);

        $eagerEmployees = Employee::with(['department', 'position'])
            ->take($limit)
            ->get();
        $eagerCount = 0;
        foreach ($eagerEmployees as $employee) {
            // Already loaded! No extra queries!
            $deptName = $employee->department->name ?? 'N/A';
            $posTitle = $employee->position->title ?? 'N/A';
            $eagerCount++;
        }
        $eagerTime = microtime(true) - $start;

        // ============================================
        // 📊 RESULTS
        // ============================================
        $improvement = $lazyTime > 0 ? round($lazyTime / $eagerTime, 2) : 0;

        return $this->success([
            'comparison' => [
                'lazy_loading' => [
                    'time' => round($lazyTime * 1000, 2) . 'ms',
                    'queries' => $lazyCount + 1, // 1 + N
                    'description' => 'N+1 Problem - Each department loads individually',
                ],
                'eager_loading' => [
                    'time' => round($eagerTime * 1000, 2) . 'ms',
                    'queries' => 2 + 1, // Employees + Department + Position
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

    /**
     * Show Lazy Loading in action (with query log)
     */
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

    /**
     * Show Eager Loading (optimized)
     */
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

    /**
     * ✅ Basic load() - Load after query
     */
    public function dynamicLoad(Request $request)
    {
        // First, get employees without relationships
        $employees = Employee::all();

        // Then decide what to load
        if ($request->boolean('load_department')) {
            $employees->load('department');
        }

        if ($request->boolean('load_payrolls')) {
            $employees->load('payrolls');
        }

        return response()->json($employees);
    }



    /**
     * ✅ whereHas() - Filter by related data
     */
    public function whereHasDemo(Request $request)
    {
        $query = Employee::with(['department', 'position']);

        // Employees who have at least one payroll
        if ($request->boolean('has_payrolls')) {
            $query->whereHas('payrolls');
        }

        // Employees with payrolls > 50000
        if ($request->filled('min_salary')) {
            $query->whereHas('payrolls', function ($q) use ($request) {
                $q->where('net_salary', '>=', $request->min_salary);
            });
        }

        // Employees who have taken leave
        if ($request->boolean('has_leaves')) {
            $query->whereHas('leaves');
        }

        // Employees who have attendance records
        if ($request->boolean('has_attendance')) {
            $query->whereHas('attendances');
        }

        $employees = $query->paginate(15);

        return $this->success($employees, 'WhereHas demo completed.');
    }

    /**
     * ✅ has() - Check existence
     */
    public function hasDemo(Request $request)
    {
        $query = Employee::with(['department', 'position']);

        // Employees who have at least one payroll
        if ($request->boolean('has_payrolls')) {
            $query->has('payrolls');
        }

        // Employees with more than 3 payrolls
        if ($request->filled('payroll_count')) {
            $query->has('payrolls', '>', $request->payroll_count);
        }

        // Employees who have both payrolls AND leaves
        if ($request->boolean('has_both')) {
            $query->has('payrolls')->has('leaves');
        }

        $employees = $query->paginate(15);

        return $this->success($employees, 'Has demo completed.');
    }

    /**
     * ✅ withCount() - Count related records
     */
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

    /**
     * ✅ withExists() - Check existence
     */
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

    /**
     * ✅ withSum() - Sum related values
     */
    public function withSumDemo(Request $request)
    {
        $employees = Employee::with(['department', 'position'])
            ->withSum('payrolls', 'net_salary')
            ->withSum('payrolls', 'basic_salary')
            ->orderBy('payrolls_sum_net_salary', 'desc')
            ->paginate(15);

        return $this->success($employees, 'WithSum demo completed.');
    }

    /**
     * ✅ withAvg() - Average related values
     */
    public function withAvgDemo()
    {
        $employees = Employee::with(['department', 'position'])
            ->withAvg('payrolls', 'net_salary')
            ->paginate(15);

        return $this->success($employees, 'WithAvg demo completed.');
    }

    /**
     * ✅ load() - Dynamic loading
     */
    public function loadDemo(Request $request)
    {
        $employees = Employee::paginate(15);

        // Load relationships based on request
        $loadable = ['department', 'position', 'payrolls', 'leaves', 'attendances'];
        $toLoad = array_intersect($loadable, $request->input('with', []));

        if (!empty($toLoad)) {
            $employees->load($toLoad);
        }

        return $this->success($employees, 'Load demo completed.');
    }

    /**
     * ✅ loadMissing() - Load only missing
     */
    public function loadMissingDemo()
    {
        // First load department
        $employees = Employee::with('department')->paginate(15);

        // Then load missing relationships
        $employees->loadMissing(['position', 'payrolls']);

        return $this->success($employees, 'LoadMissing demo completed.');
    }

    /**
     * ✅ append() - Add computed attributes
     */
    public function appendDemo(Request $request)
    {
        $employees = Employee::paginate(15);

        // Append attributes
        $employees->each(function ($emp) {
            $emp->append(['full_name', 'total_earnings', 'is_senior', 'salary_grade']);
        });

        return $this->success($employees, 'Append demo completed.');
    }
}
