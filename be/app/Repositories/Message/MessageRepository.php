<?php

namespace App\Repositories\Message;

use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class MessageRepository implements MessageInterface
{
    private $message;
    private $user;

    public function __construct(Message $message, User $user)
    {
        $this->message = $message;
        $this->user = $user;
    }

    public function sendMessage($message)
    {
        return $this->message->create([
            'content' => $message['content'],
            'user_id' => $message['user_id'],
            'to_user_id' => $message['to_user_id'],
        ]);
    }

    public function usersContacted($userId)
    {
        $users = [];
        $messages = new Collection(DB::select('select distinct user_id from messages where to_user_id = ?', [$userId]));
        if (! empty($messages)) {
            $users = $this->user->whereIn('id', $messages->pluck('user_id')->toArray())->get();
        }

        return $users;
    }

    public function getMessageOfFriend($friendId, $currentUserId)
    {
        $limit= 1000;
        $msgs = $this->message->where(function($q) use ($friendId, $currentUserId) {
            $q->where('user_id', $friendId)->where('to_user_id', $currentUserId);
        })
        ->orWhere(function ($q) use ($friendId, $currentUserId) {
            $q->where('user_id', $currentUserId)->where('to_user_id', $friendId);
        })
        ->orderBy('created_at', 'asc')->limit($limit)->get();

        return $msgs;
    }
}
