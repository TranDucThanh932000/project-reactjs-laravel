<?php

namespace App\Http\Controllers\api\v1;

use App\Enums\StatusNotification;
use App\Enums\TypeNotification;
use App\Events\Notification;
use App\Http\Controllers\Controller;
use App\Repositories\Friend\FriendInterface;
use App\Repositories\Notification\NotificationInterface;
use Illuminate\Http\Request;
use JWTAuth;

class FriendController extends Controller
{
    private $friend;
    private $notification;

    public function __construct(FriendInterface $friend, NotificationInterface $notification)
    {
        $this->friend = $friend;
        $this->notification = $notification;
    }

    public function store(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $notification = $this->notification->store([
            'owner' => $user->id,
            'to_user' => $request->friend,
            'type' => TypeNotification::ADD_FRIEND,
            'status' => StatusNotification::UNREAD
        ]);
        broadcast(new Notification(
            $notification->id,
            $user, 
            'private-notification-' . $request->friend, 
            TypeNotification::ADD_FRIEND,
        ))
        ->toOthers();

        return response()->json([
            'status' => $this->friend->addfriend($user->id, $request->friend)
        ], 200);
    }

    public function destroy($id)
    {
        $user = JWTAuth::parseToken()->authenticate();

        return response()->json([
            'status' => $this->friend->unfriend($user->id, $id)
        ], 200);
    }

    public function cancelRequest(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        return response()->json([
            'status' => $this->friend->cancelRequest($user->id, $request->friend)
        ], 200);
    }

    public function acceptRequest(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        return response()->json([
            'status' => $this->friend->acceptRequest($user->id, $request->friend)
        ], 200);
    }
}
