<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    use ApiResponseTrait;

    public function index()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return $this->error('User not authenticated', null, 401);
            }

            // ✅ Check if notifications relationship exists
            if (!method_exists($user, 'notifications')) {
                return $this->success([
                    'data' => [],
                    'total' => 0,
                ], 'Notifications not available.');
            }

            $notifications = $user->notifications()
                ->orderBy('created_at', 'desc')
                ->paginate(15);

            return $this->success($notifications, 'Notifications retrieved successfully.');
        } catch (\Exception $e) {
            return $this->error('Failed to fetch notifications: ' . $e->getMessage(), null, 500);
        }
    }

    public function unreadCount()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return $this->error('User not authenticated', null, 401);
            }

            // ✅ Default to 0 if notifications not available
            $count = 0;

            if (method_exists($user, 'unreadNotifications')) {
                try {
                    $count = $user->unreadNotifications()->count();
                } catch (\Exception $e) {
                    // Table might not exist yet
                    $count = 0;
                }
            }

            return $this->success([
                'unread_count' => $count,
                'has_unread' => $count > 0,
            ], 'Unread count retrieved successfully.');
        } catch (\Exception $e) {
            // ✅ Always return success with 0 count instead of throwing error
            return $this->success([
                'unread_count' => 0,
                'has_unread' => false,
                'error' => $e->getMessage(),
            ], 'Unread count retrieved with fallback.');
        }
    }

    public function markAsRead($id)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return $this->error('User not authenticated', null, 401);
            }

            if (!method_exists($user, 'notifications')) {
                return $this->error('Notifications not available.', null, 400);
            }

            $notification = $user->notifications()->where('id', $id)->first();

            if (!$notification) {
                return $this->notFound('Notification not found.');
            }

            $notification->markAsRead();

            return $this->success(null, 'Notification marked as read.');
        } catch (\Exception $e) {
            return $this->error('Failed to mark notification as read: ' . $e->getMessage(), null, 500);
        }
    }

    public function markAllAsRead()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return $this->error('User not authenticated', null, 401);
            }

            if (!method_exists($user, 'unreadNotifications')) {
                return $this->error('Notifications not available.', null, 400);
            }

            $user->unreadNotifications()->update(['read_at' => now()]);

            return $this->success(null, 'All notifications marked as read.');
        } catch (\Exception $e) {
            return $this->error('Failed to mark all notifications as read: ' . $e->getMessage(), null, 500);
        }
    }
}
