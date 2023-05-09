<?php

namespace App\Repositories\Follower;

use App\Models\Follower;
use App\Models\Friend;
use Exception;
use Illuminate\Support\Facades\DB;
use JWTAuth;

class FollowerRepository implements FollowerInterface
{
    private $follower;
    private $friend;

    public function __construct(Follower $follower, Friend $friend)
    {
        $this->follower = $follower;
        $this->friend = $friend;
    }

    public function follow($user, $follower)
    {
        return $this->follower->create([
            'user_id' => $user,
            'follower' => $follower
        ]);
    }

    public function unfollow($user, $follower)
    {
        $follow = $this->follower->where('user_id', $user)->where('follower', $follower)->delete();
        return $follow;
    }

    public function getTop($top)
    {
        $userId = 0;
        $listTopFollower = [];
        try {
            try {
                $userId = JWTAuth::parseToken()->authenticate()->id;
            } catch (Exception $ex) {
            }

            $listTopFollower = $this->follower->select(DB::raw('user_id, count(follower) as countFollower, SUM(CASE WHEN follower = ' . intval($userId) . ' THEN 1 ELSE 0 END) > 0 as followed'))
            ->groupBy('user_id')
            ->orderBy('countFollower', 'desc')
            ->limit($top)
            ->with([
            'user' => function ($q) {
                $q->select('users.id', 'users.name', 'users.avatar');
            },
            //receiver
            'user.friend' => function($q) use ($userId) {
                $q->where('friend', $userId);
            },
            //sender
            'user.isAddFriend' => function($q) use ($userId) {
                $q->where('user_id', $userId);
            }])
            ->get();
        } catch (Exception $e) {
        }

        return $listTopFollower;
    }
}
