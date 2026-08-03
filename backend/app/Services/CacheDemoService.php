<?php

namespace App\Services;

use App\Models\CacheLog;
use App\Models\Employee;
use App\Models\Department;
use App\Models\Payroll;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class CacheDemoService
{
    /**
     * ✅ WITH CACHE - Get employees with caching
     */
    public function getEmployeesWithCache(string $key, int $ttl = 3600): array
    {
        $start = microtime(true);
        $fromCache = false;

        // ✅ Check if data exists in cache
        if (Cache::has($key)) {
            $employees = Cache::get($key);
            $fromCache = true;
        } else {
            $employees = Employee::with(['department', 'position'])->get();
            Cache::put($key, $employees, $ttl);
        }

        $time = microtime(true) - $start;

        // ✅ Log cache hit/miss
        $this->logCache('employees_all', 'SELECT * FROM employees', $time, $employees->count(), $fromCache);

        return [
            'data' => $employees,
            'time' => round($time * 1000, 2) . 'ms',
            'cached' => $fromCache,
            'count' => $employees->count(),
            'source' => $fromCache ? 'Cache (Redis/File)' : 'Database',
            'table' => 'employees',
            'columns' => ['id', 'name', 'email', 'employee_code', 'department', 'position', 'status'],
        ];
    }

    /**
     * ❌ WITHOUT CACHE - Get employees without caching
     */
    public function getEmployeesWithoutCache(): array
    {
        $start = microtime(true);

        $employees = Employee::with(['department', 'position'])->get();

        $time = microtime(true) - $start;

        $this->logCache('employees_all', 'SELECT * FROM employees', $time, $employees->count(), false);

        return [
            'data' => $employees,
            'time' => round($time * 1000, 2) . 'ms',
            'cached' => false,
            'count' => $employees->count(),
            'source' => 'Database (Direct Query)',
            'table' => 'employees',
            'columns' => ['id', 'name', 'email', 'employee_code', 'department', 'position', 'status'],
        ];
    }

    /**
     * ✅ Cache Department Stats with data
     */
    public function getDepartmentStatsWithCache(int $departmentId): array
    {
        $key = "department_stats_{$departmentId}";
        $start = microtime(true);
        $fromCache = false;

        if (Cache::has($key)) {
            $stats = Cache::get($key);
            $fromCache = true;
        } else {
            $department = Department::find($departmentId);
            $stats = [
                'department' => $department,
                'employee_count' => Employee::where('department_id', $departmentId)->count(),
                'avg_salary' => Employee::where('department_id', $departmentId)->avg('salary'),
                'active_count' => Employee::where('department_id', $departmentId)
                    ->where('status', 'active')
                    ->count(),
                'employees' => Employee::where('department_id', $departmentId)
                    ->select('id', 'name', 'email', 'status')
                    ->get(),
            ];
            Cache::put($key, $stats, 3600);
        }

        $time = microtime(true) - $start;

        return [
            'data' => $stats,
            'time' => round($time * 1000, 2) . 'ms',
            'cached' => $fromCache,
            'source' => $fromCache ? 'Cache' : 'Database',
            'table' => 'departments + employees',
        ];
    }

    /**
     * ✅ Get Payroll Summary with cache
     */
    public function getPayrollSummaryWithCache(): array
    {
        $key = 'payroll_summary';
        $start = microtime(true);
        $fromCache = false;

        if (Cache::has($key)) {
            $summary = Cache::get($key);
            $fromCache = true;
        } else {
            $summary = [
                'total_payrolls' => Payroll::count(),
                'total_amount' => Payroll::sum('net_salary'),
                'avg_salary' => Payroll::avg('net_salary'),
                'by_month' => Payroll::selectRaw('DATE_FORMAT(payroll_month, "%Y-%m") as month, COUNT(*) as count, SUM(net_salary) as total')
                    ->groupBy('month')
                    ->orderBy('month', 'desc')
                    ->limit(6)
                    ->get(),
                'recent_payrolls' => Payroll::with('employee')
                    ->orderBy('created_at', 'desc')
                    ->limit(10)
                    ->get(),
            ];
            Cache::put($key, $summary, 3600);
        }

$time = microtime(true) - $start;

        return [
            'data' => $summary,
            'time' => round($time * 1000, 2) . 'ms',
            'cached' => $fromCache,
            'source' => $fromCache ? 'Cache' : 'Database',
            'table' => 'payrolls + employees',
            'columns' => ['employee', 'payroll_month', 'gross_salary', 'net_salary', 'status'],
            'recent_columns' => ['employee', 'payroll_month', 'gross_salary', 'net_salary', 'status'],
            'month_columns' => ['month', 'count', 'total'],
        ];
    }

    /**
     * ✅ Compare performance with real data
     */
    public function comparePerformance(string $key, int $iterations = 5): array
    {
        $results = [];

        // ❌ Without Cache
        $withoutCacheTotal = 0;
        $withoutResults = [];
        for ($i = 0; $i < $iterations; $i++) {
            $start = microtime(true);
            $data = Employee::with(['department', 'position'])->get();
            $withoutCacheTotal += microtime(true) - $start;
            if ($i === 0) {
                $withoutResults = $data->take(5)->map(function ($emp) {
                    return [
                        'id' => $emp->id,
                        'name' => $emp->name,
                        'email' => $emp->email,
                        'department' => $emp->department->name ?? 'N/A',
                    ];
                });
            }
        }
        $withoutCacheAvg = $withoutCacheTotal / $iterations;

        // ✅ With Cache (First run - cache miss)
        Cache::forget($key);
        $start = microtime(true);
        Employee::with(['department', 'position'])->get();
        $firstCacheTime = microtime(true) - $start;

        // ✅ With Cache (Subsequent runs - cache hit)
        $withCacheTotal = 0;
        $withResults = [];
        for ($i = 0; $i < $iterations; $i++) {
            $start = microtime(true);
            $data = Cache::remember($key, 3600, function () {
                return Employee::with(['department', 'position'])->get();
            });
            $withCacheTotal += microtime(true) - $start;
            if ($i === 0) {
                $withResults = $data->take(5)->map(function ($emp) {
                    return [
                        'id' => $emp->id,
                        'name' => $emp->name,
                        'email' => $emp->email,
                        'department' => $emp->department->name ?? 'N/A',
                    ];
                });
            }
        }
        $withCacheAvg = $withCacheTotal / $iterations;

        return [
            'iterations' => $iterations,
            'without_cache' => [
                'average_time' => round($withoutCacheAvg * 1000, 2) . 'ms',
                'total_time' => round($withoutCacheTotal * 1000, 2) . 'ms',
                'sample_data' => $withoutResults,
                'data_source' => 'Database (No Cache)',
            ],
            'with_cache' => [
                'first_run' => round($firstCacheTime * 1000, 2) . 'ms',
                'average_time' => round($withCacheAvg * 1000, 2) . 'ms',
                'total_time' => round($withCacheTotal * 1000, 2) . 'ms',
                'sample_data' => $withResults,
                'data_source' => 'Cache (Redis)',
            ],
            'improvement' => [
                'speedup' => round($withoutCacheAvg / $withCacheAvg, 2) . 'x',
                'time_saved' => round(($withoutCacheAvg - $withCacheAvg) * 1000, 2) . 'ms',
                'percentage' => round((1 - ($withCacheAvg / $withoutCacheAvg)) * 100, 2) . '%',
            ],
            'recommendation' => $withoutCacheAvg / $withCacheAvg > 2
                ? '✅ Highly recommended - Caching provides significant improvement'
                : 'ℹ️ Caching provides minor improvement',
            'data_info' => [
                'table' => 'employees',
                'total_records' => Employee::count(),
                'with_relations' => 'department, position',
            ],
        ];
    }

/**
     * ✅ Get Cache Statistics from cache logs
     */
    public function getCacheStats(): array
    {
        $totalQueries = CacheLog::count();
        $cacheHits = CacheLog::hits()->count();
        $cacheMisses = CacheLog::misses()->count();

        /*
         * logCache() stores a single non-zero time per row:
         * - cache MISS (DB query) rows   => time is stored in with_cache_time
         * - cache HIT (cache read) rows  => time is stored in without_cache_time
         *
         * So to get a meaningful average we read the non-zero column per state.
         */
        $avgWithoutCacheSec = CacheLog::misses()
            ->selectRaw('AVG(NULLIF(COALESCE(without_cache_time, 0) + COALESCE(with_cache_time, 0), 0)) as avg_time')
            ->value('avg_time') ?? 0;
        $avgWithCacheSec = CacheLog::hits()
            ->selectRaw('AVG(NULLIF(COALESCE(without_cache_time, 0) + COALESCE(with_cache_time, 0), 0)) as avg_time')
            ->value('avg_time') ?? 0;

        // Convert seconds -> milliseconds (frontend renders these as "ms")
        $avgWithoutCacheMs = (float) $avgWithoutCacheSec * 1000;
        $avgWithCacheMs = (float) $avgWithCacheSec * 1000;

        // Total time saved = (avg without cache - avg with cache) * number of cache hits
        $totalTimeSaved = ($avgWithoutCacheMs - $avgWithCacheMs) * $cacheHits;

        return [
            'total_queries' => $totalQueries,
            'cache_hits' => $cacheHits,
            'cache_misses' => $cacheMisses,
            'hit_rate' => $totalQueries > 0
                ? round(($cacheHits / $totalQueries) * 100, 2) . '%'
                : '0%',
            'avg_without_cache' => round($avgWithoutCacheMs, 2),
            'avg_with_cache' => round($avgWithCacheMs, 2),
            'total_time_saved' => round(max($totalTimeSaved, 0), 2),
        ];
    }

private function logCache(string $key, string $query, float $time, int $count, bool $hit): void
    {
        try {
            CacheLog::create([
                'key' => $key,
                'query' => $query,
                'without_cache_time' => $hit ? $time : 0,
                'with_cache_time' => $hit ? 0 : $time,
                'result_count' => $count,
                'cache_hit' => $hit,
                'user_id' => auth()->id(),
            ]);
        } catch (\Exception $e) {
            // Silently fail
        }
    }
}
