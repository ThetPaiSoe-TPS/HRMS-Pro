<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ExplainQueryService;
use App\Models\Employee;
use App\Models\IndexingDemoProduct;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ExplainController extends Controller
{
    use ApiResponseTrait;

    private ExplainQueryService $explainService;

    public function __construct(ExplainQueryService $explainService)
    {
        $this->explainService = $explainService;
    }

    /**
     * Analyze a query using EXPLAIN
     */
    public function analyze(Request $request)
    {
        $request->validate([
            'query_type' => ['required', 'string'],
        ]);

        $queryType = $request->input('query_type');
        $explainResults = [];
        $recommendations = [];
        $summary = [];

        switch ($queryType) {
            case 'employee_search':
                $explainResults = $this->analyzeEmployeeSearch();
                break;
            case 'product_search':
                $explainResults = $this->analyzeProductSearch();
                break;
            case 'product_with_index':
                $explainResults = $this->analyzeProductWithIndex();
                break;
            case 'product_no_index':
                $explainResults = $this->analyzeProductNoIndex();
                break;
            case 'complex_query':
                $explainResults = $this->analyzeComplexQuery();
                break;
            default:
                return $this->error('Invalid query type');
        }

        if ($explainResults) {
            $recommendations = $this->explainService->getRecommendations($explainResults);
            $summary = $this->explainService->getSummary($explainResults);
            $lastExplain = $this->explainService->getLastExplain();
        }

        return $this->success([
            'query_type' => $queryType,
            'explain' => $explainResults,
            'summary' => $summary,
            'recommendations' => $recommendations,
            'last_query' => $lastExplain['query'] ?? null,
            'execution_time' => $lastExplain['execution_time'] ?? null,
            'row_count' => $lastExplain['row_count'] ?? null,
        ], 'Query analysis completed.');
    }

    /**
     * Get all stored explain logs
     */
    public function logs(Request $request)
    {
        $logs = DB::table('explain_logs')
            ->orderBy('created_at', 'desc')
            ->limit($request->integer('limit', 50))
            ->get()
            ->map(function ($log) {
                $log->explain_result = json_decode($log->explain_result, true);
                return $log;
            });

        return $this->success([
            'logs' => $logs,
            'total' => DB::table('explain_logs')->count(),
        ], 'Explain logs retrieved.');
    }

    /**
     * Get EXPLAIN statistics
     */
    public function stats()
    {
        $stats = [
            'total_explain_logs' => DB::table('explain_logs')->count(),
            'average_execution_time' => DB::table('explain_logs')->avg('execution_time'),
            'max_execution_time' => DB::table('explain_logs')->max('execution_time'),
            'min_execution_time' => DB::table('explain_logs')->min('execution_time'),
            'avg_row_count' => DB::table('explain_logs')->avg('row_count'),
            'recent_slow_queries' => DB::table('explain_logs')
                ->where('execution_time', '>', 100)
                ->orderBy('execution_time', 'desc')
                ->limit(10)
                ->get(),
        ];

        return $this->success($stats, 'Explain statistics retrieved.');
    }

    // ============================================
    // SAMPLE QUERIES FOR EXPLAIN ANALYSIS
    // ============================================

    private function analyzeEmployeeSearch(): array
    {
        // Get a random employee
        $employee = Employee::inRandomOrder()->first();

        if ($employee) {
            $searchTerm = $employee->name;
        } else {
            $searchTerm = 'John';
        }

        return $this->explainService->explain(
            "SELECT * FROM employees WHERE name LIKE ? OR email LIKE ?",
            ["%{$searchTerm}%", "%{$searchTerm}%"]
        );
    }

    private function analyzeProductSearch(): array
    {
        return $this->explainService->explain(
            "SELECT * FROM indexing_demo_products WHERE category = ? AND price BETWEEN ? AND ?",
            ['Electronics', 100, 500]
        );
    }

    private function analyzeProductWithIndex(): array
    {
        return $this->explainService->explain(
            "SELECT * FROM indexing_demo_products
             WHERE is_active = ? AND category = ? AND price BETWEEN ? AND ?",
            [1, 'Electronics', 100, 500]
        );
    }

    private function analyzeProductNoIndex(): array
    {
        return $this->explainService->explain(
            "SELECT * FROM indexing_demo_products
             WHERE name LIKE ? OR brand LIKE ?",
            ['%Electronics%', '%Apple%']
        );
    }

    private function analyzeComplexQuery(): array
    {
        return $this->explainService->explain(
            "SELECT p.*,
                    (SELECT COUNT(*) FROM indexing_demo_products WHERE brand = p.brand) as brand_count,
                    (SELECT AVG(price) FROM indexing_demo_products WHERE category = p.category) as avg_category_price
             FROM indexing_demo_products p
             WHERE p.is_active = 1
             AND p.category = ?
             AND p.price > ?
             ORDER BY p.views_count DESC
             LIMIT 100",
            ['Electronics', 50]
        );
    }
}
