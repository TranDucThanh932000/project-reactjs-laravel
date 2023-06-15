<?php

namespace App\Repositories\Notification;

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
        ->orderBy('created_at', 'desc')
        ->offset($from)
        ->take($limit)
        ->with(['ownerUser' => function($q) {
            return $q->select('id', 'name', 'avatar');
        }])
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
