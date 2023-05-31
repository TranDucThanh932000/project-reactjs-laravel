<?php

namespace App\Repositories\Friend;

interface FriendInterface
{
    public function addFriend($currentUser, $friend);
    public function cancelRequest($currentUser, $friend);
    public function unFriend($currentUser, $friend);
    public function acceptRequest($currentUser, $friend);
    public function getAllFriend($id);
}