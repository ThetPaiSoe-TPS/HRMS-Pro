<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\IndexingDemoProduct;
use App\Models\IndexingDemoQuery;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class IndexingController extends Controller
{
    use ApiResponseTrait;

    /**
     * Performance comparison: With Indexes vs Without Indexes
     */
    public function compare(Request $request)
    {
        $request->validate([
            'category' => ['nullable', 'string'],
            'brand' => ['nullable', 'string'],
            'min_price' => ['nullable', 'numeric'],
            'max_price' => ['nullable', 'numeric'],
        ]);

        $category = $request->input('category', 'Electronics');
        $brand = $request->input('brand', 'Apple');
        $minPrice = $request->input('min_price', 100);
        $maxPrice = $request->input('max_price', 500);

        $results = [];

        // ============================================
        // TEST 1: Single Column Index
        // ============================================

        // WITH INDEX (on category)
        $startWithIndex = microtime(true);
        $withIndex = IndexingDemoProduct::where('category', $category)->get();
        $timeWithIndex = microtime(true) - $startWithIndex;

        // WITHOUT INDEX (using LIKE on name)
        $startWithoutIndex = microtime(true);
        $withoutIndex = IndexingDemoProduct::where('name', 'LIKE', "%{$category}%")->get();
        $timeWithoutIndex = microtime(true) - $startWithoutIndex;

        $results['single_column'] = [
            'with_index' => [
                'time' => round($timeWithIndex * 1000, 2) . 'ms',
                'results' => $withIndex->count(),
                'explain' => $this->getExplain('category', $category),
            ],
            'without_index' => [
                'time' => round($timeWithoutIndex * 1000, 2) . 'ms',
                'results' => $withoutIndex->count(),
                'explain' => $this->getExplainLike('name', $category),
            ],
            'improvement' => $timeWithoutIndex > 0 ? round($timeWithoutIndex / $timeWithIndex, 2) : 0,
        ];

        // ============================================
        // TEST 2: Composite Index (is_active + category + price)
        // ============================================

        // WITH COMPOSITE INDEX
        $startComposite = microtime(true);
        $compositeIndex = IndexingDemoProduct::where('is_active', true)
            ->where('category', $category)
            ->whereBetween('price', [$minPrice, $maxPrice])
            ->get();
        $timeComposite = microtime(true) - $startComposite;

        // WITHOUT INDEX (full table scan)
        $startNoComposite = microtime(true);
        $noComposite = IndexingDemoProduct::where('name', 'LIKE', "%{$category}%")
            ->where('price', '>=', $minPrice)
            ->where('price', '<=', $maxPrice)
            ->get();
        $timeNoComposite = microtime(true) - $startNoComposite;

        $results['composite_index'] = [
            'with_index' => [
                'time' => round($timeComposite * 1000, 2) . 'ms',
                'results' => $compositeIndex->count(),
                'explain' => $this->getExplainComposite($category, $minPrice, $maxPrice),
            ],
            'without_index' => [
                'time' => round($timeNoComposite * 1000, 2) . 'ms',
                'results' => $noComposite->count(),
                'explain' => ['type' => 'ALL', 'extra' => 'Using where'],
            ],
            'improvement' => $timeNoComposite > 0 ? round($timeNoComposite / $timeComposite, 2) : 0,
        ];

        // ============================================
        // TEST 3: Index on Price Range
        // ============================================

        // WITH INDEX (price column has index)
        $startPriceIndex = microtime(true);
        $priceIndex = IndexingDemoProduct::whereBetween('price', [$minPrice, $maxPrice])->get();
        $timePriceIndex = microtime(true) - $startPriceIndex;

        // WITHOUT INDEX (using LIKE on price)
        $startPriceNoIndex = microtime(true);
        $priceNoIndex = IndexingDemoProduct::where('name', 'LIKE', "%{$minPrice}%")->get();
        $timePriceNoIndex = microtime(true) - $startPriceNoIndex;

        $results['price_index'] = [
            'with_index' => [
                'time' => round($timePriceIndex * 1000, 2) . 'ms',
                'results' => $priceIndex->count(),
                'explain' => $this->getExplainPrice($minPrice, $maxPrice),
            ],
            'without_index' => [
                'time' => round($timePriceNoIndex * 1000, 2) . 'ms',
                'results' => $priceNoIndex->count(),
                'explain' => ['type' => 'ALL', 'extra' => 'Using where'],
            ],
            'improvement' => $timePriceNoIndex > 0 ? round($timePriceNoIndex / $timePriceIndex, 2) : 0,
        ];

        // ============================================
        // TEST 4: Multiple Filters (All Indexes)
        // ============================================

        // WITH ALL INDEXES
        $startAllIndexes = microtime(true);
        $allIndexes = IndexingDemoProduct::where('is_active', true)
            ->where('category', $category)
            ->where('brand', $brand)
            ->whereBetween('price', [$minPrice, $maxPrice])
            ->orderBy('created_at', 'desc')
            ->get();
        $timeAllIndexes = microtime(true) - $startAllIndexes;

        // WITHOUT INDEXES (using LIKE on everything)
        $startNoIndexes = microtime(true);
        $noIndexes = IndexingDemoProduct::where('name', 'LIKE', "%{$category}%")
            ->orWhere('brand', 'LIKE', "%{$brand}%")
            ->get();
        $timeNoIndexes = microtime(true) - $startNoIndexes;

        $results['multi_index'] = [
            'with_index' => [
                'time' => round($timeAllIndexes * 1000, 2) . 'ms',
                'results' => $allIndexes->count(),
            ],
            'without_index' => [
                'time' => round($timeNoIndexes * 1000, 2) . 'ms',
                'results' => $noIndexes->count(),
            ],
            'improvement' => $timeNoIndexes > 0 ? round($timeNoIndexes / $timeAllIndexes, 2) : 0,
        ];

        // ============================================
        // TEST 5: ORDER BY with Index
        // ============================================

        // WITH INDEX (created_at has index)
        $startOrderIndex = microtime(true);
        $orderIndex = IndexingDemoProduct::orderBy('created_at', 'desc')->limit(100)->get();
        $timeOrderIndex = microtime(true) - $startOrderIndex;

        // WITHOUT INDEX (using LIKE on order)
        $startOrderNoIndex = microtime(true);
        $orderNoIndex = IndexingDemoProduct::orderBy('name', 'desc')->limit(100)->get();
        $timeOrderNoIndex = microtime(true) - $startOrderNoIndex;

        $results['order_index'] = [
            'with_index' => [
                'time' => round($timeOrderIndex * 1000, 2) . 'ms',
                'results' => $orderIndex->count(),
            ],
            'without_index' => [
                'time' => round($timeOrderNoIndex * 1000, 2) . 'ms',
                'results' => $orderNoIndex->count(),
            ],
            'improvement' => $timeOrderNoIndex > 0 ? round($timeOrderNoIndex / $timeOrderIndex, 2) : 0,
        ];

        // ============================================
        // INDEX INFORMATION
        // ============================================
        $indexInfo = $this->getIndexInfo();

        // ============================================
        // LOG THE QUERY PERFORMANCE
        // ============================================
        $this->logQuery('performance_comparison', [
            'category' => $category,
            'brand' => $brand,
            'min_price' => $minPrice,
            'max_price' => $maxPrice,
        ], $results);

        return $this->success([
            'search_params' => [
                'category' => $category,
                'brand' => $brand,
                'min_price' => $minPrice,
                'max_price' => $maxPrice,
            ],
            'performance' => $results,
            'analysis' => $this->getAnalysis($results),
            'index_information' => $indexInfo,
            'recommendations' => $this->getRecommendations($results),
        ], 'Indexing performance comparison completed.');
    }

    /**
     * Get index information for the products table
     */
    private function getIndexInfo(): array
    {
        $indexes = DB::select("
            SELECT 
                INDEX_NAME,
                INDEX_TYPE,
                COLUMN_NAME,
                SEQ_IN_INDEX,
                NON_UNIQUE,
                CARDINALITY
            FROM INFORMATION_SCHEMA.STATISTICS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'indexing_demo_products'
            ORDER BY INDEX_NAME, SEQ_IN_INDEX
        ");

        $grouped = [];
        foreach ($indexes as $index) {
            if (!isset($grouped[$index->INDEX_NAME])) {
                $grouped[$index->INDEX_NAME] = [
                    'columns' => [],
                    'type' => $index->INDEX_TYPE,
                    'unique' => $index->NON_UNIQUE == 0,
                ];
            }
            $grouped[$index->INDEX_NAME]['columns'][] = $index->COLUMN_NAME;
        }

        return [
            'total_indexes' => count($grouped),
            'indexes' => $grouped,
        ];
    }

    /**
     * Get EXPLAIN for a query
     */
    private function getExplain(string $column, string $value): array
    {
        $result = DB::select("EXPLAIN SELECT * FROM indexing_demo_products WHERE {$column} = ?", [$value]);
        return [
            'type' => $result[0]->type ?? 'N/A',
            'possible_keys' => $result[0]->possible_keys ?? 'N/A',
            'key' => $result[0]->key ?? 'N/A',
            'key_len' => $result[0]->key_len ?? 'N/A',
            'rows' => $result[0]->rows ?? 'N/A',
            'extra' => $result[0]->Extra ?? 'N/A',
        ];
    }

    private function getExplainLike(string $column, string $value): array
    {
        $result = DB::select("EXPLAIN SELECT * FROM indexing_demo_products WHERE {$column} LIKE ?", ["%{$value}%"]);
        return [
            'type' => $result[0]->type ?? 'ALL',
            'possible_keys' => $result[0]->possible_keys ?? 'N/A',
            'key' => $result[0]->key ?? 'N/A',
            'rows' => $result[0]->rows ?? 'N/A',
            'extra' => $result[0]->Extra ?? 'Using where',
        ];
    }

    private function getExplainComposite(string $category, float $min, float $max): array
    {
        $result = DB::select("
            EXPLAIN SELECT * FROM indexing_demo_products 
            WHERE is_active = 1 AND category = ? AND price BETWEEN ? AND ?
        ", [$category, $min, $max]);

        return [
            'type' => $result[0]->type ?? 'N/A',
            'possible_keys' => $result[0]->possible_keys ?? 'N/A',
            'key' => $result[0]->key ?? 'N/A',
            'rows' => $result[0]->rows ?? 'N/A',
            'extra' => $result[0]->Extra ?? 'N/A',
        ];
    }

    private function getExplainPrice(float $min, float $max): array
    {
        $result = DB::select("
            EXPLAIN SELECT * FROM indexing_demo_products 
            WHERE price BETWEEN ? AND ?
        ", [$min, $max]);

        return [
            'type' => $result[0]->type ?? 'N/A',
            'possible_keys' => $result[0]->possible_keys ?? 'N/A',
            'key' => $result[0]->key ?? 'N/A',
            'rows' => $result[0]->rows ?? 'N/A',
            'extra' => $result[0]->Extra ?? 'N/A',
        ];
    }

    /**
     * Get analysis of the performance results
     */
    private function getAnalysis(array $results): array
    {
        $avgImprovement = 0;
        $count = 0;
        $best = ['test' => '', 'improvement' => 0];

        foreach ($results as $key => $result) {
            if (isset($result['improvement'])) {
                $avgImprovement += $result['improvement'];
                $count++;
                if ($result['improvement'] > $best['improvement']) {
                    $best = ['test' => $key, 'improvement' => $result['improvement']];
                }
            }
        }

        $avgImprovement = $count > 0 ? round($avgImprovement / $count, 2) : 0;

        return [
            'average_improvement' => $avgImprovement . 'x',
            'best_performance' => $best,
            'summary' => $avgImprovement > 10
                ? "Indexes provide exceptional performance improvement ({$avgImprovement}x average)"
                : ($avgImprovement > 3
                    ? "Indexes provide good performance improvement ({$avgImprovement}x average)"
                    : "Indexes provide moderate performance improvement ({$avgImprovement}x average)"),
        ];
    }

    /**
     * Get recommendations based on performance
     */
    private function getRecommendations(array $results): array
    {
        $recommendations = [];

        foreach ($results as $key => $result) {
            if (isset($result['improvement']) && $result['improvement'] > 10) {
                $recommendations[] = [
                    'test' => $key,
                    'recommendation' => '✅ Highly recommended - ' . $result['improvement'] . 'x faster',
                ];
            } elseif (isset($result['improvement']) && $result['improvement'] > 3) {
                $recommendations[] = [
                    'test' => $key,
                    'recommendation' => '✅ Recommended - ' . $result['improvement'] . 'x faster',
                ];
            } elseif (isset($result['improvement'])) {
                $recommendations[] = [
                    'test' => $key,
                    'recommendation' => '⚠️ Consider indexing - ' . $result['improvement'] . 'x faster',
                ];
            }
        }

        return $recommendations;
    }

    /**
     * Log query performance
     */
    private function logQuery(string $type, array $params, array $results)
    {
        // Log to database for history
        // IndexingDemoQuery::create([...]);
    }

    /**
     * Get index statistics (for dashboard)
     */
    public function stats()
    {
        $totalProducts = IndexingDemoProduct::count();

        $stats = Cache::remember('indexing_stats', 600, function () use ($totalProducts) {
            return [
                'total_products' => $totalProducts,
                'total_indexes' => count($this->getIndexInfo()['indexes']),
                'avg_price' => IndexingDemoProduct::avg('price'),
                'total_categories' => IndexingDemoProduct::distinct('category')->count(),
                'total_brands' => IndexingDemoProduct::distinct('brand')->count(),
                'active_products' => IndexingDemoProduct::where('is_active', true)->count(),
                'low_stock' => IndexingDemoProduct::where('stock_quantity', '<', 10)->count(),
                'last_updated' => now()->toDateTimeString(),
            ];
        });

        return $this->success($stats, 'Indexing statistics retrieved.');
    }
}
