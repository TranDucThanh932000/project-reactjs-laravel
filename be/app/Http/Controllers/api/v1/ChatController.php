<?php

namespace App\Http\Controllers\api\v1;

use App\Events\Message;
use App\Http\Controllers\Controller;
use App\Repositories\Message\MessageInterface;
use Exception;
use Illuminate\Http\Request;
use JWTAuth;

class ChatController extends Controller
{

    private $message;

    public function __construct(MessageInterface $message)
    {
        $this->message = $message;
    }

    public function store(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $message = $this->message->sendMessage([
                'user_id' => $user->id,
                'to_user_id' => $request->toUserId,
                'content' => $request->message
            ]);
            broadcast(new Message($message, 'message-private-' . $request->toUserId))->toOthers();
    
            return response()->json([
                'message' => $message
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'error'
            ], 400);
        } 
    }

    public function destroy($id)
    {
        //
    }

    public function getUsersContacted(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $usersContacted = $this->message->usersContacted($user->id);

        return response()->json([
            'usersContacted' => $usersContacted
        ], 200);
    }

    public function getMsgFriend(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $msgs = $this->message->getMessageOfFriend($request->friendId, $user->id);

        return response()->json([
            'msgs' => $msgs
        ], 200);
    }
}
