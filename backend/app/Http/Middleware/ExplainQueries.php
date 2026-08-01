<?php

namespace App\Http\Middleware;

use Closure;
use App\Services\ExplainQueryService;
use Illuminate\Support\Facades\Log;

class ExplainQueries
{
    private ExplainQueryService $explainService;

    public function __construct(ExplainQueryService $explainService)
    {
        $this->explainService = $explainService;
    }

    public function handle($request, Closure $next)
    {
        // Only in development/testing
        if (!app()->environment('local', 'development')) {
            return $next($request);
        }

        // Enable query logging for this request
        \Illuminate\Support\Facades\DB::enableQueryLog();

        $response = $next($request);

        // Get executed queries and explain them
        $queries = \Illuminate\Support\Facades\DB::getQueryLog();

        foreach ($queries as $query) {
            // Only explain SELECT queries
            if (stripos($query['query'], 'select') === 0) {
                try {
                    $explain = $this->explainService->explain(
                        $query['query'],
                        $query['bindings']
                    );
                } catch (\Exception $e) {
                    Log::warning('Could not explain query: ' . $e->getMessage());
                }
            }
        }

        return $response;
    }
}
