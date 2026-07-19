File 17: Security Specifications
1. Security Overview
Security Layers
text
┌─────────────────────────────────────────────────────┐
│                    Security Layers                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│   Layer 1: Network Security                         │
│   ├── SSL/TLS Encryption                           │
│   ├── Firewall Rules                               │
│   └── WAF Protection                               │
│                                                     │
│   Layer 2: Authentication & Authorization          │
│   ├── Multi-Factor Authentication                  │
│   ├── Role-Based Access Control                    │
│   ├── Permission System                            │
│   └── Session Management                           │
│                                                     │
│   Layer 3: Data Security                           │
│   ├── Encryption at Rest                           │
│   ├── Encryption in Transit                        │
│   ├── Data Masking                                 │
│   └── PII Protection                               │
│                                                     │
│   Layer 4: Application Security                    │
│   ├── Input Validation                             │
│   ├── SQL Injection Prevention                     │
│   ├── XSS Protection                               │
│   ├── CSRF Protection                              │
│   └── Rate Limiting                                │
│                                                     │
│   Layer 5: Monitoring & Logging                    │
│   ├── Security Auditing                            │
│   ├── Suspicious Activity Detection                │
│   └── Incident Response                            │
│                                                     │
└─────────────────────────────────────────────────────┘
2. Authentication Security
Password Policy
php
// Password validation rules
public function passwordRules()
{
    return [
        'required',
        'string',
        'min:8',
        'max:255',
        'confirmed',
        'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/',
        'not_in:' . implode(',', config('security.forbidden_passwords'))
    ];
}

// Password expiration
public function isPasswordExpired(User $user)
{
    $expiryDays = config('security.password_expiry_days', 90);
    return $user->password_updated_at->diffInDays(now()) > $expiryDays;
}
Session Security
php
// Session configuration
[
    'lifetime' => 120, // minutes
    'expire_on_close' => false,
    'encrypt' => true,
    'secure' => true, // HTTPS only
    'http_only' => true,
    'same_site' => 'strict',
];
Two-Factor Authentication
php
<?php

namespace App\Services;

use App\Models\User;
use App\Models\TwoFactorAuth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TwoFactorAuthService
{
    public function enable(User $user)
    {
        $secret = $this->generateSecret();
        
        TwoFactorAuth::create([
            'user_id' => $user->id,
            'secret' => encrypt($secret),
            'is_enabled' => true
        ]);
        
        return $this->generateQRCode($user, $secret);
    }
    
    public function verify(User $user, string $code): bool
    {
        $twoFactor = $user->twoFactorAuth;
        if (!$twoFactor || !$twoFactor->is_enabled) {
            return false;
        }
        
        $secret = decrypt($twoFactor->secret);
        return $this->verifyCode($secret, $code);
    }
}
3. Authorization Security
Permission Architecture
php
// Permission Service Provider
class PermissionServiceProvider extends ServiceProvider
{
    public function boot()
    {
        // Define permissions
        Permission::create(['name' => 'employee.view', 'guard_name' => 'api']);
        Permission::create(['name' => 'employee.create', 'guard_name' => 'api']);
        Permission::create(['name' => 'employee.update', 'guard_name' => 'api']);
        Permission::create(['name' => 'employee.delete', 'guard_name' => 'api']);
        
        // Define roles
        Role::create(['name' => 'super_admin', 'guard_name' => 'api']);
        Role::create(['name' => 'hr_manager', 'guard_name' => 'api']);
        Role::create(['name' => 'department_manager', 'guard_name' => 'api']);
        Role::create(['name' => 'employee', 'guard_name' => 'api']);
    }
}

// Middleware
class CheckPermission
{
    public function handle($request, Closure $next, $permission)
    {
        if (!auth()->user()->can($permission)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Insufficient permissions.'
            ], 403);
        }
        
        return $next($request);
    }
}
4. Data Security
Encryption Standards
php
// Data encryption for sensitive fields
class Employee extends Model
{
    protected $casts = [
        'date_of_birth' => 'encrypted',
        'phone' => 'encrypted',
        'address' => 'encrypted',
        'emergency_contact' => 'encrypted',
        'bank_account' => 'encrypted',
    ];
    
    // Encryption key rotation
    public static function rotateEncryptionKeys()
    {
        $employees = self::all();
        foreach ($employees as $employee) {
            foreach ($employee->getEncryptedAttributes() as $attribute) {
                $value = decrypt($employee->{$attribute});
                $employee->{$attribute} = encrypt($value);
            }
            $employee->save();
        }
    }
}
PII Protection
php
// Data masking for non-privileged users
class EmployeeResource extends JsonResource
{
    public function toArray($request)
    {
        $data = parent::toArray($request);
        
        // Mask sensitive data for non-HR users
        if (!auth()->user()->can('view_sensitive_data')) {
            $data['email'] = $this->maskEmail($data['email']);
            $data['phone'] = $this->maskPhone($data['phone']);
            $data['address'] = $this->maskAddress($data['address']);
        }
        
        return $data;
    }
    
    private function maskEmail($email)
    {
        $parts = explode('@', $email);
        $masked = substr($parts[0], 0, 2) . '*****';
        return $masked . '@' . $parts[1];
    }
}
5. API Security
Rate Limiting
php
// Rate limiting configuration
Route::middleware([
    'throttle:60,1', // 60 requests per minute
    'auth:sanctum'
])->group(function () {
    Route::get('/employees', [EmployeeController::class, 'index']);
});

// Custom rate limiter
RateLimiter::for('api', function ($job) {
    return Limit::perMinute(60)->by($job->user->id ?? $job->ip());
});

// Different limits for different endpoints
Route::middleware([
    'throttle:auth_limit', // 5 requests per minute for login
])->post('/auth/login', [AuthController::class, 'login']);
Input Validation & Sanitization
php
// StoreEmployeeRequest
class StoreEmployeeRequest extends FormRequest
{
    public function rules()
    {
        return [
            'first_name' => ['required', 'string', 'max:50', 'regex:/^[a-zA-Z\s]+$/'],
            'last_name' => ['required', 'string', 'max:50', 'regex:/^[a-zA-Z\s]+$/'],
            'email' => ['required', 'email', 'unique:employees,email'],
            'phone' => ['nullable', 'string', 'regex:/^\+?[0-9]{10,15}$/'],
            'department_id' => ['required', 'exists:departments,id'],
            'position_id' => ['required', 'exists:positions,id'],
        ];
    }
    
    public function sanitize()
    {
        $this->merge([
            'first_name' => strip_tags(trim($this->first_name)),
            'last_name' => strip_tags(trim($this->last_name)),
            'email' => filter_var($this->email, FILTER_SANITIZE_EMAIL),
        ]);
    }
}
6. Security Headers
php
// Security Headers Middleware
class SecurityHeaders
{
    public function handle($request, Closure $next)
    {
        $response = $next($request);
        
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'no-referrer');
        $response->headers->set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
        
        // HSTS - HTTPS only
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        
        // Content Security Policy
        $response->headers->set(
            'Content-Security-Policy',
            "default-src 'self'; " .
            "script-src 'self' https://cdnjs.cloudflare.com; " .
            "style-src 'self' 'unsafe-inline'; " .
            "img-src 'self' https://*.amazonaws.com; " .
            "font-src 'self'; " .
            "connect-src 'self' https://api.hrms-pro.com;"
        );
        
        return $response;
    }
}
7. Audit Logging
php
// Audit Log Model
class AuditLog
{
    protected $fillable = [
        'user_id', 'action', 'resource', 'resource_id',
        'old_values', 'new_values', 'ip_address', 'user_agent'
    ];
}

// Audit Trail Middleware
class AuditTrail
{
    public function handle($request, Closure $next)
    {
        $response = $next($request);
        
        if ($this->shouldLog($request)) {
            AuditLog::create([
                'user_id' => auth()->id(),
                'action' => $request->route()->getName(),
                'resource' => $request->route()->getPrefix(),
                'resource_id' => $request->route('id'),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'old_values' => $this->getOldValues($request),
                'new_values' => $request->all()
            ]);
        }
        
        return $response;
    }
}
8. Security Checklist
Pre-Deployment Security Checklist
SSL/TLS configured and enforced

All passwords hashed using bcrypt

Database credentials in .env (not in code)

CSRF protection enabled

XSS protection headers set

SQL injection prevention (prepared statements)

File upload restrictions (size, type)

Rate limiting configured

Security headers configured

CORS properly configured

Error messages don't expose sensitive info

Debug mode disabled

Application key set

Two-factor authentication available

Audit logging configured

Failed login attempt limits

Session security (secure, httponly, samesite)

Password policy enforced

Regular security updates scheduled

Backups configured