<?php

namespace App\Http\Controllers\api\v1;

use App\Http\Controllers\Controller;
use App\Repositories\Follower\FollowerInterface;
use Illuminate\Http\Request;
use JWTAuth;

class FollowerController extends Controller
{
    private $follower;

    public function __construct(FollowerInterface $follower)
    {
        $this->follower = $follower;
    }

    public function store(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $this->follower->follow($request->follower, $user->id);

        return response()->json([
            'status' => 'success'
        ], 200);
    }

    public function destroy($id)
    {
        $user = JWTAuth::parseToken()->authenticate();

        return response()->json([
            'status' => $this->follower->unfollow($id, $user->id)
        ], 200);
    }

    public function getTop5()
    {
        return response()->json([
            'top5' => $this->follower->getTop(5)
        ], 200);
    }
}
