<?php

namespace App\Repositories\Follower;

use App\Models\Follower;
use Illuminate\Support\Facades\DB;

class FollowerRepository implements FollowerInterface
{
    private $follower;

    public function __construct(Follower $follower)
    {
        $this->follower = $follower;
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
        $follow = $this->follower->where('user_id', $user)->where('follower', $follower)->first();
        if($follow) {
            return $follow->delete();
        }
        return false;
    }

    public function getTop($top)
    {
        return $this->follower->select(DB::raw('user_id, count(follower) as countFollower'))
        ->groupBy('user_id')
        ->orderBy('countFollower', 'desc')
        ->limit($top)
        ->with(['user' => function ($q) {
            $q->select('users.id', 'users.name');
        }])
        ->get();
    }
}
