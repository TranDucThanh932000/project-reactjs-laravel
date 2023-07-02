<?php

namespace App\Repositories\Notification;

use App\Enums\StatusFriend;
use App\Enums\StatusNotification;
use App\Models\Notification;
use JWTAuth;

class NotificationRepository implements NotificationInterface
{
    private $notification;

    public function __construct(Notification $notification)
    {
        $this->notification = $notification;
    }

    public function countNotificationUnRead()
    {
        $user = JWTAuth::parseToken()->authenticate();

        return $this->notification->where('to_user', $user->id)
        ->where('status', StatusNotification::UNREAD)
        ->count();
    }

    public function getNotification($from, $limit)
    {
        $user = JWTAuth::parseToken()->authenticate();

        return $this->notification->where('to_user', $user->id)
        ->with([
            'ownerUser' => function($q) use($user) {
                $q->select('id', 'name', 'avatar')
                ->withCount([
                    'friend as is_waiting' => function($q) use($user) {
                        $q->where('friend', $user->id)->where('status', StatusFriend::WAITTING);
                    }
                ]);
            },
        ])
        ->orderBy('created_at', 'desc')
        ->offset($from)
        ->take($limit)
        ->get();
    }

    public function store($notification)
    {
        return $this->notification->create($notification);
    }

    public function markStatusRead($id, $status)
    {
        return $this->notification->find($id)->update([
            'status' => $status
        ]);
    }

    public function seenAll($userId)
    {
        return $this->notification->where('to_user', $userId)
        ->where('status', StatusNotification::UNREAD)
        ->update([
            'status' => StatusNotification::READED
        ]);
    }
}
