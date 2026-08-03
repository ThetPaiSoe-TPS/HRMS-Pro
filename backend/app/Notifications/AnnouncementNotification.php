<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;

class AnnouncementNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $announcement;

    public function __construct($announcement)
    {
        $this->announcement = $announcement;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast', 'mail'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'announcement',
            'title' => $this->announcement->title,
            'message' => $this->announcement->summary ?? $this->announcement->content,
            'data' => [
                'announcement_id' => $this->announcement->id,
                'priority' => $this->announcement->priority,
            ],
            'action_url' => route('announcements.show', $this->announcement->id),
            'icon' => '📢',
            'color' => $this->announcement->priority === 'urgent' ? 'red' : 'blue',
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'type' => 'announcement',
            'title' => $this->announcement->title,
            'message' => $this->announcement->summary ?? $this->announcement->content,
            'data' => [
                'announcement_id' => $this->announcement->id,
            ],
            'time' => now()->diffForHumans(),
        ]);
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('New Announcement: ' . $this->announcement->title)
            ->greeting('Hello ' . $notifiable->name)
            ->line($this->announcement->summary ?? $this->announcement->content)
            ->action('View Announcement', route('announcements.show', $this->announcement->id))
            ->line('Thank you for using HRMS Pro!');
    }
}
