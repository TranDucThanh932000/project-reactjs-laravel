<?php

namespace App\Events;

use App\Models\Message as ModelsMessage;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class Message implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public ModelsMessage $message,
        public string $channel,
    )
    {
    }

    public function broadcastOn()
    {
        return new PrivateChannel('chat');
    }

    public function broadcastAs()
    {
        return $this->channel;
    }
}
