<?php

namespace App\Listeners;

use App\Models\ActivityLog;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Request;

class LogUserActivity
{
    public function handle($event)
    {
        $userId = null;
        $action = '';
        $description = '';

        if ($event instanceof Login) {
            $userId = $event->user->id;
            $action = 'login';
            $description = 'User logged in';
        } elseif ($event instanceof Logout) {
            $userId = $event->user->id;
            $action = 'logout';
            $description = 'User logged out';
        } elseif ($event instanceof Registered) {
            $userId = $event->user->id;
            $action = 'register';
            $description = 'User registered';
        }

        if ($userId) {
            ActivityLog::create([
                'user_id' => $userId,
                'action' => $action,
                'description' => $description,
                'ip_address' => Request::ip(),
                'user_agent' => Request::userAgent(),
                'url' => Request::fullUrl(),
                'method' => Request::method(),
            ]);
        }
    }
}
