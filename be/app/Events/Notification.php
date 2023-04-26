<?php

namespace App\Events;

use App\Models\Blog;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use App\Models\User;
use stdClass;

class Notification implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $id,
        public User $user,
        public string $channel,
        public int $type,
        public stdClass $blog = new stdClass()
    )
    {
        //
    }

    public function broadcastOn()
    {
        return new PrivateChannel('notification');
    }

    public function broadcastAs()
    {
        return $this->channel;
    }
}
