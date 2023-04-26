<?php

namespace App\Http\Controllers\api\v1;

use App\Http\Controllers\Controller;
use App\Repositories\Notification\NotificationInterface;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    private $notification;

    public function __construct(NotificationInterface $notification)
    {
        $this->notification = $notification;
    }

    public function index()
    {
        $limit = 10;

        return response()->json($this->notification->getNotification(0, $limit), 200);
    }

    public function countNotificationUnRead()
    {
        return response()->json($this->notification->countNotificationUnRead(), 200);
    }

    public function markStatusRead(Request $request)
    {
        return response()->json($this->notification->markStatusRead($request->id, $request->status), 200);
    }
}
