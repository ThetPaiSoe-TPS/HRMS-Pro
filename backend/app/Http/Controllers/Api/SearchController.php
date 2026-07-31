<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SearchDemoRecord;
use App\Models\Employee;
use App\Models\Announcement;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

class SearchController extends Controller
{
    use ApiResponseTrait;

    /**
     * Global search across all models
     */
    public function globalSearch(Request $request)
    {
        $request->validate([
            'query' => ['required', 'string', 'min:2'],
        ]);

        $query = $request->input('query');
        $results = [];

        // Search employees using full-text (using 'name' instead of 'first_name', 'last_name')
        $employees = Employee::searchFullText($query)
            ->with(['department', 'position'])
            ->limit(5)
            ->get()
            ->map(function ($employee) {
                return [
                    'id' => $employee->id,
                    'name' => $employee->name,
                    'employee_code' => $employee->employee_code,
                    'email' => $employee->email,
                    'department' => $employee->department?->name,
                    'position' => $employee->position?->title,
                ];
            });

        // Search announcements
        $announcements = Announcement::searchFullText($query)
            ->with(['creator'])
            ->limit(5)
            ->get();

        // Search demo records
        $demoRecords = SearchDemoRecord::searchFullText($query)
            ->withRelevance($query)
            ->limit(10)
            ->get();

        return $this->success([
            'employees' => $employees,
            'announcements' => $announcements,
            'demo_records' => $demoRecords,
        ], 'Search results retrieved successfully.');
    }

    /**
     * Performance comparison: LIKE vs Full-Text
     */
    public function performanceComparison(Request $request)
    {
        $request->validate([
            'query' => ['required', 'string', 'min:2'],
        ]);

        $searchTerm = $request->input('query');
        $results = [];

        // Check if search_demo_records table exists
        $demoTableExists = Schema::hasTable('search_demo_records');

        // 1. Test LIKE query performance on employees
        $startLikeEmployee = microtime(true);
        $likeEmployees = Employee::searchLike($searchTerm)->get();
        $timeLikeEmployee = microtime(true) - $startLikeEmployee;

        // 2. Test Full-Text query performance on employees
        $startFullTextEmployee = microtime(true);
        $fullTextEmployees = Employee::searchFullText($searchTerm)->get();
        $timeFullTextEmployee = microtime(true) - $startFullTextEmployee;

        // 3. Test on demo records if table exists
        $likeDemo = collect();
        $fullTextDemo = collect();
        $timeLikeDemo = 0;
        $timeFullTextDemo = 0;

        if ($demoTableExists) {
            try {
                $startLikeDemo = microtime(true);
                $likeDemo = SearchDemoRecord::searchLike($searchTerm)->get();
                $timeLikeDemo = microtime(true) - $startLikeDemo;

                $startFullTextDemo = microtime(true);
                $fullTextDemo = SearchDemoRecord::searchFullText($searchTerm)->get();
                $timeFullTextDemo = microtime(true) - $startFullTextDemo;
            } catch (\Exception $e) {
                // Table or columns might not exist
            }
        }

        // 4. Get sample results
        $sampleLike = $likeEmployees->take(3)->map(function ($record) {
            return [
                'id' => $record->id,
                'name' => $record->name,
                'employee_code' => $record->employee_code,
                'email' => $record->email,
            ];
        });

        $sampleFullText = $fullTextEmployees->take(3)->map(function ($record) {
            return [
                'id' => $record->id,
                'name' => $record->name,
                'employee_code' => $record->employee_code,
                'email' => $record->email,
                'relevance' => $record->relevance ?? null,
            ];
        });

        $responseData = [
            'search_term' => $searchTerm,
            'performance' => [
                'employees' => [
                    'like_query' => [
                        'time' => round($timeLikeEmployee * 1000, 2) . 'ms',
                        'results_count' => $likeEmployees->count(),
                        'sample_results' => $sampleLike,
                    ],
                    'fulltext_query' => [
                        'time' => round($timeFullTextEmployee * 1000, 2) . 'ms',
                        'results_count' => $fullTextEmployees->count(),
                        'sample_results' => $sampleFullText,
                    ],
                    'improvement_factor' => $timeLikeEmployee > 0 ? round($timeLikeEmployee / $timeFullTextEmployee, 2) : 0,
                ],
            ],
            'analysis' => $this->getAnalysis($timeLikeEmployee, $timeFullTextEmployee, $likeEmployees->count(), $fullTextEmployees->count()),
            'demo_data_available' => $demoTableExists,
        ];

        // Add demo results if available
        if ($demoTableExists && $timeLikeDemo > 0) {
            $responseData['performance']['demo_records'] = [
                'like_query' => [
                    'time' => round($timeLikeDemo * 1000, 2) . 'ms',
                    'results_count' => $likeDemo->count(),
                ],
                'fulltext_query' => [
                    'time' => round($timeFullTextDemo * 1000, 2) . 'ms',
                    'results_count' => $fullTextDemo->count(),
                ],
                'improvement_factor' => $timeLikeDemo > 0 ? round($timeLikeDemo / $timeFullTextDemo, 2) : 0,
            ];
        }

        return $this->success($responseData, 'Performance comparison completed.');
    }


    private function getIndexInfo(): array
    {
        $indexes = DB::select("
            SELECT 
                TABLE_NAME,
                INDEX_NAME,
                INDEX_TYPE,
                COLUMN_NAME
            FROM INFORMATION_SCHEMA.STATISTICS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND INDEX_NAME LIKE '%fulltext%'
            ORDER BY TABLE_NAME, INDEX_NAME
        ");

        return [
            'fulltext_indexes' => $indexes,
            'total_indexes' => count($indexes),
        ];
    }

    private function getAnalysis($timeLike, $timeFullText, $countLike, $countFullText): array
    {
        $speedup = $timeLike > 0 ? round($timeLike / $timeFullText, 2) : 0;

        return [
            'summary' => "Full-text search is {$speedup}x faster than LIKE queries for employees search.",
            'details' => [
                'like_query_time' => round($timeLike * 1000, 2) . 'ms',
                'fulltext_query_time' => round($timeFullText * 1000, 2) . 'ms',
                'speedup_factor' => $speedup . 'x',
                'like_results' => $countLike,
                'fulltext_results' => $countFullText,
            ],
            'recommendation' => $speedup > 2 ?
                '✅ Highly recommend using full-text search for employee search' :
                '⚠️ Consider full-text search for better performance on larger datasets',
        ];
    }

    /**
     * Search statistics
     */
    public function searchStats()
    {
        $stats = Cache::remember('search_stats', 600, function () {
            return [
                'total_employees' => Employee::count(),
                'total_demo_records' => SearchDemoRecord::count(),
                'fulltext_indexes' => $this->getIndexInfo(),
                'last_updated' => now()->toDateTimeString(),
            ];
        });

        return $this->success($stats, 'Search statistics retrieved.');
    }
}
