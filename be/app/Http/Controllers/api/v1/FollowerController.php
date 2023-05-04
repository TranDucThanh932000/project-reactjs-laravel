<?php

namespace App\Http\Controllers\api\v1;

use App\Enums\StatusNotification;
use App\Enums\TypeNotification;
use App\Events\Notification;
use App\Http\Controllers\Controller;
use App\Repositories\Follower\FollowerInterface;
use App\Repositories\Notification\NotificationInterface;
use Illuminate\Http\Request;
use JWTAuth;
use App\Enums\StatusCode;

class FollowerController extends Controller
{
    private $follower;
    private $notification;

    public function __construct(FollowerInterface $follower, NotificationInterface $notification)
    {
        $this->follower = $follower;
        $this->notification = $notification;
    }

    public function store(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $this->follower->follow($request->follower, $user->id);

        $notification = $this->notification->store([
            'owner' => $user->id,
            'to_user' => $request->follower,
            'type' => TypeNotification::FOLLOW,
            'status' => StatusNotification::UNREAD
        ]);

        broadcast(new Notification(
            $notification->id,
            $user,
            'private-notification-' . $request->follower, 
            TypeNotification::FOLLOW,
        ))
        ->toOthers();

        return response()->json([
            'status' => 'success'
        ], StatusCode::OK);
    }

    public function destroy($id)
    {
        $user = JWTAuth::parseToken()->authenticate();

        return response()->json([
            'status' => $this->follower->unfollow($id, $user->id)
        ], StatusCode::OK);
    }

    public function getTop5()
    {
        return response()->json([
            'top5' => $this->follower->getTop(5)
        ], StatusCode::OK);
    }
}
