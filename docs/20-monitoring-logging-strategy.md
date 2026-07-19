File 20: Monitoring & Logging Strategy
1. Monitoring Overview
Monitoring Layers
text
┌─────────────────────────────────────────────────────┐
│                 Monitoring Layers                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Layer 1: Application Performance Monitoring        │
│  ├── Response Times                                 │
│  ├── Error Rates                                    │
│  ├── Database Queries                              │
│  └── Cache Hit/Miss Rates                          │
│                                                     │
│  Layer 2: Infrastructure Monitoring                 │
│  ├── CPU Usage                                      │
│  ├── Memory Usage                                   │
│  ├── Disk Space                                     │
│  └── Network Traffic                                │
│                                                     │
│  Layer 3: User Activity Monitoring                  │
│  ├── Login Activity                                 │
│  ├── Feature Usage                                 │
│  ├── User Sessions                                 │
│  └── User Behavior                                 │
│                                                     │
│  Layer 4: Security Monitoring                       │
│  ├── Failed Login Attempts                         │
│  ├── Unauthorized Access Attempts                  │
│  ├── API Abuse Detection                           │
│  └── Suspicious Activity                           │
│                                                     │
└─────────────────────────────────────────────────────┘
2. Application Logging
Log Configuration
php
// config/logging.php
return [
    'default' => env('LOG_CHANNEL', 'stack'),
    
    'channels' => [
        'stack' => [
            'driver' => 'stack',
            'channels' => ['daily', 'slack', 'elasticsearch'],
            'ignore_exceptions' => false,
        ],
        
        'daily' => [
            'driver' => 'daily',
            'path' => storage_path('logs/laravel.log'),
            'level' => env('LOG_LEVEL', 'debug'),
            'days' => 30,
            'permission' => 0644,
        ],
        
        'slack' => [
            'driver' => 'slack',
            'url' => env('LOG_SLACK_WEBHOOK_URL'),
            'username' => 'HRMS Pro',
            'emoji' => ':boom:',
            'level' => env('LOG_LEVEL', 'error'),
        ],
        
        'elasticsearch' => [
            'driver' => 'elasticsearch',
            'hosts' => [
                env('ELASTICSEARCH_HOST', 'localhost:9200'),
            ],
            'index' => 'hrms-logs',
            'level' => 'debug',
        ],
    ],
];
Logging Implementation
php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use App\Models\AuditLog;

class LoggingService
{
    public function logError($message, $context = [])
    {
        Log::error($message, array_merge($context, [
            'user_id' => auth()->id(),
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'url' => request()->fullUrl(),
            'method' => request()->method(),
        ]));
    }
    
    public function logActivity($action, $description, $data = null)
    {
        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => $action,
            'description' => $description,
            'data' => json_encode($data),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'url' => request()->fullUrl(),
            'method' => request()->method(),
        ]);
    }
    
    public function logApiRequest($request, $response)
    {
        Log::channel('api')->info('API Request', [
            'request' => [
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'headers' => $request->headers->all(),
                'body' => $request->all(),
            ],
            'response' => [
                'status' => $response->status(),
                'body' => $response->content(),
            ],
            'duration' => microtime(true) - LARAVEL_START,
        ]);
    }
}
3. Performance Monitoring
Performance Metrics
php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class PerformanceMonitor
{
    public function trackQuery($query, $duration)
    {
        // Track slow queries
        if ($duration > 1000) { // > 1 second
            Log::warning('Slow query detected', [
                'query' => $query->sql,
                'bindings' => $query->bindings,
                'duration' => $duration,
                'connection' => $query->connection->getName(),
            ]);
        }
        
        // Store metrics
        $metrics = Cache::get('query_metrics', []);
        $metrics[] = [
            'query' => $query->sql,
            'duration' => $duration,
            'time' => now()->toDateTimeString(),
        ];
        
        // Keep last 100 slow queries
        $metrics = array_slice($metrics, -100);
        Cache::put('query_metrics', $metrics, 3600);
    }
    
    public function getPerformanceStats()
    {
        return [
            'cpu_usage' => sys_getloadavg()[0],
            'memory_usage' => memory_get_usage(true),
            'memory_peak' => memory_get_peak_usage(true),
            'disk_usage' => disk_free_space('/'),
            'database_size' => $this->getDatabaseSize(),
            'cache_hit_rate' => $this->getCacheHitRate(),
            'average_response_time' => $this->getAverageResponseTime(),
        ];
    }
}
Health Check Endpoint
php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;

class HealthCheckController extends Controller
{
    public function check()
    {
        $status = [
            'status' => 'healthy',
            'timestamp' => now()->toDateTimeString(),
            'services' => [
                'database' => $this->checkDatabase(),
                'cache' => $this->checkCache(),
                'storage' => $this->checkStorage(),
                'queue' => $this->checkQueue(),
            ],
            'system' => [
                'cpu' => sys_getloadavg()[0],
                'memory' => memory_get_usage(true),
                'disk' => disk_free_space('/'),
            ],
        ];
        
        if (in_array(false, array_column($status['services'], 'status'))) {
            $status['status'] = 'unhealthy';
            return response()->json($status, 503);
        }
        
        return response()->json($status);
    }
    
    private function checkDatabase()
    {
        try {
            DB::connection()->getPdo();
            return ['status' => true, 'message' => 'Connected'];
        } catch (\Exception $e) {
            return ['status' => false, 'message' => $e->getMessage()];
        }
    }
    
    private function checkCache()
    {
        try {
            Cache::put('health_check', 'ok', 10);
            return ['status' => true, 'message' => 'Working'];
        } catch (\Exception $e) {
            return ['status' => false, 'message' => $e->getMessage()];
        }
    }
}
4. Alerting System
Alert Configuration
php
<?php

namespace App\Services;

use App\Models\Alert;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class AlertService
{
    protected $alertChannels = ['email', 'slack', 'sms'];
    
    public function sendAlert($type, $message, $severity = 'warning')
    {
        $alert = Alert::create([
            'type' => $type,
            'message' => $message,
            'severity' => $severity,
            'status' => 'pending',
        ]);
        
        // Send notifications based on severity
        if ($severity === 'critical') {
            $this->sendCriticalAlert($alert);
        } elseif ($severity === 'error') {
            $this->sendErrorAlert($alert);
        } else {
            $this->sendWarningAlert($alert);
        }
        
        return $alert;
    }
    
    private function sendCriticalAlert($alert)
    {
        // Send to all channels
        foreach ($this->alertChannels as $channel) {
            $this->sendChannelAlert($channel, $alert);
        }
        
        // Log
        Log::critical('Critical alert: ' . $alert->message);
    }
    
    private function sendChannelAlert($channel, $alert)
    {
        switch ($channel) {
            case 'email':
                Mail::to(config('monitoring.alert_emails'))
                    ->send(new AlertEmail($alert));
                break;
            case 'slack':
                Http::post(config('monitoring.slack_webhook'), [
                    'text' => "*{$alert->severity}*: {$alert->message}",
                ]);
                break;
            case 'sms':
                // SMS integration
                break;
        }
    }
}
5. User Activity Tracking
Activity Logging
php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id', 'action', 'resource', 'resource_id',
        'data', 'ip_address', 'user_agent', 'url', 'method'
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    // Activity types
    public const ACTIONS = [
        'login' => 'User logged in',
        'logout' => 'User logged out',
        'create' => 'Created new record',
        'update' => 'Updated record',
        'delete' => 'Deleted record',
        'approve' => 'Approved request',
        'reject' => 'Rejected request',
        'export' => 'Exported data',
        'import' => 'Imported data',
    ];
}

// Logging middleware
class LogUserActivity
{
    public function handle($request, $next)
    {
        $response = $next($request);
        
        if (auth()->check()) {
            ActivityLog::create([
                'user_id' => auth()->id(),
                'action' => $request->route()->getName(),
                'resource' => $request->route()->getPrefix(),
                'data' => json_encode($request->all()),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'url' => $request->fullUrl(),
                'method' => $request->method(),
            ]);
        }
        
        return $response;
    }
}
6. Dashboard & Reporting
Monitoring Dashboard
php
<?php

namespace App\Http\Controllers;

use App\Services\MonitoringService;

class MonitoringController extends Controller
{
    public function dashboard()
    {
        $data = [
            'requests_per_minute' => $this->getRequestsPerMinute(),
            'error_rate' => $this->getErrorRate(),
            'response_time_avg' => $this->getAverageResponseTime(),
            'response_time_p95' => $this->getP95ResponseTime(),
            'active_users' => $this->getActiveUsers(),
            'popular_endpoints' => $this->getPopularEndpoints(),
            'recent_errors' => $this->getRecentErrors(),
            'system_health' => $this->getSystemHealth(),
        ];
        
        return view('admin.monitoring', $data);
    }
    
    private function getRequestsPerMinute()
    {
        return ActivityLog::where('created_at', '>', now()->subMinutes(5))
            ->selectRaw('COUNT(*) as count, MINUTE(created_at) as minute')
            ->groupBy('minute')
            ->get();
    }
}