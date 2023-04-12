<?php

namespace App\Repositories\Follower;

interface FollowerInterface
{
    public function follow($user, $follower);
    public function unfollow($user, $follower);
    public function getTop($top);
}