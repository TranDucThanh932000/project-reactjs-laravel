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
use App\Enums\StatusCode;

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
        ], StatusCode::OK);
    }

    public function destroy($id)
    {
        $user = JWTAuth::parseToken()->authenticate();

        return response()->json([
            'status' => $this->friend->unfriend($user->id, $id)
        ], StatusCode::OK);
    }

    public function cancelRequest(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        return response()->json([
            'status' => $this->friend->cancelRequest($user->id, $request->friend)
        ], StatusCode::OK);
    }

    public function acceptRequest(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        return response()->json([
            'status' => $this->friend->acceptRequest($user->id, $request->friend)
        ], StatusCode::OK);
    }

    public function listFriend(Request $request)
    {
        $dataRaw = $this->friend->getAllFriend($request->id);
        $dataResp = [];
        foreach($dataRaw as $item) {
            if($item->user_id == $request->id) {
                $dataResp[] = $item->friendEntity;
            } else {
                $dataResp[] = $item->user;
            }
        }

        return response()->json($dataResp, StatusCode::OK);
    }

    public function checkStatus(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        return response()->json($this->friend->getStatusFriend($user->id, $request->friend), StatusCode::OK);
    }
}
