<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;

class LeaveStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $leaveRequest;
    protected $status;

    public function __construct($leaveRequest, $status)
    {
        $this->leaveRequest = $leaveRequest;
        $this->status = $status;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast', 'mail'];
    }

    public function toDatabase($notifiable)
    {
        $messages = [
            'approved' => 'Your leave request has been approved.',
            'rejected' => 'Your leave request has been rejected.',
            'pending' => 'Your leave request is pending review.',
        ];

        return [
            'type' => 'leave',
            'title' => 'Leave Request ' . ucfirst($this->status),
            'message' => $messages[$this->status] ?? 'Your leave request status has been updated.',
            'data' => [
                'leave_id' => $this->leaveRequest->id,
                'status' => $this->status,
                'days' => $this->leaveRequest->days,
                'type' => $this->leaveRequest->leave_type,
            ],
            'action_url' => route('leaves.show', $this->leaveRequest->id),
            'icon' => $this->status === 'approved' ? '✅' : ($this->status === 'rejected' ? '❌' : '⏳'),
            'color' => $this->status === 'approved' ? 'green' : ($this->status === 'rejected' ? 'red' : 'yellow'),
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'type' => 'leave',
            'title' => 'Leave Request ' . ucfirst($this->status),
            'message' => $this->toDatabase($notifiable)['message'],
            'data' => [
                'leave_id' => $this->leaveRequest->id,
                'status' => $this->status,
            ],
            'time' => now()->diffForHumans(),
        ]);
    }

    public function toMail($notifiable)
    {
        $statusColors = [
            'approved' => 'green',
            'rejected' => 'red',
            'pending' => 'yellow',
        ];

        return (new MailMessage)
            ->subject('Leave Request ' . ucfirst($this->status))
            ->greeting('Hello ' . $notifiable->name)
            ->line('Your leave request has been ' . $this->status . '.')
            ->line('Details:')
            ->line('- Type: ' . $this->leaveRequest->leave_type)
            ->line('- Days: ' . $this->leaveRequest->days)
            ->line('- Dates: ' . $this->leaveRequest->start_date . ' to ' . $this->leaveRequest->end_date)
            ->action('View Leave Request', route('leaves.show', $this->leaveRequest->id))
            ->line('Thank you for using HRMS Pro!');
    }
}
