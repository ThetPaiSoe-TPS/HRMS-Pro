<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Connection;
use Illuminate\Support\Facades\Cache;

class ExplainQueryService
{
    private ?array $lastExplain = null;
    private ?float $lastExecutionTime = null;
    private ?int $lastRowCount = null;
    private string $lastQuery = '';

    /**
     * Execute a query with EXPLAIN analysis
     */
    public function explain(string $query, array $bindings = []): array
    {
        $this->lastQuery = $query;

        // Get the actual SQL with bindings
        $sql = $this->getSqlWithBindings($query, $bindings);

        // Measure execution time
        $start = microtime(true);
        $result = DB::select($query, $bindings);
        $this->lastExecutionTime = microtime(true) - $start;
        $this->lastRowCount = count($result);

        // Get EXPLAIN output
        $explainQuery = "EXPLAIN " . $query;
        $explainResult = DB::select($explainQuery, $bindings);
        $this->lastExplain = $explainResult;

        // Cache for later use
        Cache::put('last_explain', [
            'query' => $sql,
            'explain' => $explainResult,
            'execution_time' => $this->lastExecutionTime,
            'row_count' => $this->lastRowCount,
            'timestamp' => now(),
        ], 3600);

        // Log to database
        $this->logExplain($sql, $explainResult);

        return $this->formatExplain($explainResult);
    }

    /**
     * Get last EXPLAIN result
     */
    public function getLastExplain(): ?array
    {
        return Cache::get('last_explain', [
            'query' => $this->lastQuery,
            'explain' => $this->lastExplain,
            'execution_time' => $this->lastExecutionTime,
            'row_count' => $this->lastRowCount,
        ]);
    }

    /**
     * Format EXPLAIN result for display
     */
    private function formatExplain(array $explainResult): array
    {
        return array_map(function ($row) {
            $row = (array) $row;
            return [
                'id' => $row['id'] ?? 0,
                'select_type' => $row['select_type'] ?? 'N/A',
                'table' => $row['table'] ?? 'N/A',
                'type' => $row['type'] ?? 'N/A',
                'possible_keys' => $row['possible_keys'] ?? 'N/A',
                'key' => $row['key'] ?? 'N/A',
                'key_len' => $row['key_len'] ?? 'N/A',
                'ref' => $row['ref'] ?? 'N/A',
                'rows' => $row['rows'] ?? 0,
                'extra' => $row['Extra'] ?? 'N/A',
                'is_using_index' => str_contains($row['Extra'] ?? '', 'Using index'),
                'is_using_where' => str_contains($row['Extra'] ?? '', 'Using where'),
                'is_using_temporary' => str_contains($row['Extra'] ?? '', 'Using temporary'),
                'is_using_filesort' => str_contains($row['Extra'] ?? '', 'Using filesort'),
            ];
        }, $explainResult);
    }

    /**
     * Get SQL with bindings
     */
    private function getSqlWithBindings(string $query, array $bindings): string
    {
        foreach ($bindings as $binding) {
            $binding = is_numeric($binding) ? $binding : "'" . addslashes($binding) . "'";
            $query = preg_replace('/\?/', $binding, $query, 1);
        }
        return $query;
    }

    /**
     * Log EXPLAIN to database
     */
    private function logExplain(string $query, array $explainResult): void
    {
        try {
            DB::table('explain_logs')->insert([
                'query' => $query,
                'explain_result' => json_encode($explainResult),
                'execution_time' => ($this->lastExecutionTime ?? 0) * 1000,
                'row_count' => $this->lastRowCount ?? 0,
                'user_id' => auth()->id(),
                'route' => request()->route()?->getName(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to log EXPLAIN: ' . $e->getMessage());
        }
    }

    /**
     * Get query performance recommendations
     */
    public function getRecommendations(array $explainResult): array
    {
        $recommendations = [];

        foreach ($explainResult as $row) {
            if (($row['type'] ?? '') === 'ALL') {
                $recommendations[] = [
                    'table' => $row['table'] ?? 'Unknown',
                    'issue' => 'Full table scan detected (type: ALL)',
                    'suggestion' => 'Add index on columns used in WHERE clause',
                    'severity' => 'high',
                ];
            }

            if (str_contains($row['extra'] ?? '', 'Using filesort')) {
                $recommendations[] = [
                    'table' => $row['table'] ?? 'Unknown',
                    'issue' => 'Filesort used (ORDER BY without index)',
                    'suggestion' => 'Add index on columns used in ORDER BY',
                    'severity' => 'medium',
                ];
            }

            if (str_contains($row['extra'] ?? '', 'Using temporary')) {
                $recommendations[] = [
                    'table' => $row['table'] ?? 'Unknown',
                    'issue' => 'Temporary table used (GROUP BY without index)',
                    'suggestion' => 'Add index on GROUP BY columns',
                    'severity' => 'medium',
                ];
            }

            if (($row['possible_keys'] ?? '') && ($row['key'] ?? '') === '') {
                $recommendations[] = [
                    'table' => $row['table'] ?? 'Unknown',
                    'issue' => 'Possible index not used',
                    'suggestion' => 'Check query for index compatibility',
                    'severity' => 'low',
                ];
            }

            if (($row['rows'] ?? 0) > 1000 && ($row['type'] ?? '') !== 'ALL') {
                $recommendations[] = [
                    'table' => $row['table'] ?? 'Unknown',
                    'issue' => "Scanned {$row['rows']} rows",
                    'suggestion' => 'Consider optimizing query or adding composite index',
                    'severity' => 'medium',
                ];
            }
        }

        return $recommendations;
    }

    /**
     * Get EXPLAIN summary
     */
    public function getSummary(array $explainResult): array
    {
        $totalRows = 0;
        $usingIndex = 0;
        $usingWhere = 0;
        $usingTemporary = 0;
        $usingFilesort = 0;
        $fullTableScan = 0;
        $types = [];

        foreach ($explainResult as $row) {
            $totalRows += $row['rows'] ?? 0;

            if ($row['is_using_index'] ?? false) $usingIndex++;
            if ($row['is_using_where'] ?? false) $usingWhere++;
            if ($row['is_using_temporary'] ?? false) $usingTemporary++;
            if ($row['is_using_filesort'] ?? false) $usingFilesort++;
            if (($row['type'] ?? '') === 'ALL') $fullTableScan++;

            $type = $row['type'] ?? 'N/A';
            if (!isset($types[$type])) $types[$type] = 0;
            $types[$type]++;
        }

        return [
            'total_tables' => count($explainResult),
            'total_rows_scanned' => $totalRows,
            'using_index_count' => $usingIndex,
            'using_where_count' => $usingWhere,
            'using_temporary_count' => $usingTemporary,
            'using_filesort_count' => $usingFilesort,
            'full_table_scan_count' => $fullTableScan,
            'type_distribution' => $types,
            'is_optimized' => $fullTableScan === 0 && $usingFilesort === 0 && $usingTemporary === 0,
            'performance_rating' => $this->getPerformanceRating($fullTableScan, $usingFilesort, $usingTemporary),
        ];
    }

    private function getPerformanceRating($fullTableScan, $usingFilesort, $usingTemporary): string
    {
        if ($fullTableScan === 0 && $usingFilesort === 0 && $usingTemporary === 0) {
            return 'excellent';
        }
        if ($fullTableScan === 0 && ($usingFilesort === 0 || $usingTemporary === 0)) {
            return 'good';
        }
        if ($fullTableScan <= 1 && $usingFilesort <= 1 && $usingTemporary <= 1) {
            return 'fair';
        }
        return 'poor';
    }
}
