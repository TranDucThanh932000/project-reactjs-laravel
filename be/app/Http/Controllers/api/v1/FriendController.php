<?php

namespace App\Http\Controllers\api\v1;

use App\Http\Controllers\Controller;
use App\Repositories\Friend\FriendInterface;
use Illuminate\Http\Request;
use JWTAuth;

class FriendController extends Controller
{
    private $friend;

    public function __construct(FriendInterface $friend)
    {
        $this->friend = $friend;
    }

    public function store(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

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
