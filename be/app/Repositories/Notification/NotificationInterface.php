<?php

namespace App\Repositories\Notification;

interface NotificationInterface
{
    public function markStatusRead($id, $status);
    public function countNotificationUnRead();
    public function getNotification($from, $limit);
    public function store($notification);
}