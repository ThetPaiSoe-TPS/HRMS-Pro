<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CacheDemoService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class CacheDemoController extends Controller
{
    use ApiResponseTrait;

    private CacheDemoService $cacheService;

    public function __construct(CacheDemoService $cacheService)
    {
        $this->cacheService = $cacheService;
    }

    public function withCache(Request $request)
    {
        $key = $request->input('key', 'employees_all');
        $result = $this->cacheService->getEmployeesWithCache($key);

        return $this->success($result, 'Employees retrieved with cache.');
    }

    public function withoutCache(Request $request)
    {
        $result = $this->cacheService->getEmployeesWithoutCache();

        return $this->success($result, 'Employees retrieved without cache.');
    }

    public function departmentStats(Request $request)
    {
        $departmentId = $request->input('department_id', 1);
        $result = $this->cacheService->getDepartmentStatsWithCache($departmentId);

        return $this->success($result, 'Department stats retrieved.');
    }

    public function payrollSummary(Request $request)
    {
        $result = $this->cacheService->getPayrollSummaryWithCache();

        return $this->success($result, 'Payroll summary retrieved.');
    }

    public function compare(Request $request)
    {
        $key = $request->input('key', 'employees_all');
        $iterations = $request->integer('iterations', 5);

        $result = $this->cacheService->comparePerformance($key, $iterations);

        return $this->success($result, 'Cache performance comparison completed.');
    }

    public function stats(Request $request)
    {
        $stats = $this->cacheService->getCacheStats();

        return $this->success($stats, 'Cache statistics retrieved.');
    }

    public function clear(Request $request, string $key)
    {
        $result = $this->cacheService->clearCache($key);

        return $this->success(['cleared' => $result], 'Cache cleared successfully.');
    }

    public function clearAll(Request $request)
    {
        $result = $this->cacheService->clearAllCache();

        return $this->success(['cleared' => $result], 'All cache cleared successfully.');
    }
}
