<?php

namespace App\Events;

use App\Models\LeaveRequest;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LeaveApproved implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $leaveRequest;
    public $status;

    public function __construct(LeaveRequest $leaveRequest, $status)
    {
        $this->leaveRequest = $leaveRequest;
        $this->status = $status;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('user.' . $this->leaveRequest->employee_id);
    }

    public function broadcastAs()
    {
        return 'leave.status.updated';
    }

    public function broadcastWith()
    {
        return [
            'id' => $this->leaveRequest->id,
            'status' => $this->status,
            'type' => $this->leaveRequest->leave_type,
            'days' => $this->leaveRequest->days,
        ];
    }
}
