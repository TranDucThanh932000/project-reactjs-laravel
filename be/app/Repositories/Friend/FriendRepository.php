<?php

namespace App\Repositories\Friend;

use App\Enums\StatusFriend;
use App\Models\Friend;

class FriendRepository implements FriendInterface
{
    private $friend;

    public function __construct(Friend $friend)
    {
        $this->friend = $friend;
    }

    public function addFriend($currentUser, $friend)
    {

        return $this->friend->create([
            'user_id' => $currentUser,
            'friend' => $friend,
            'status' => StatusFriend::WAITTING
        ]);
    }

    public function unFriend($currentUser, $friend)
    {

        return $this->friend->where(function($q) use ($currentUser, $friend) {
            $q->where('user_id', $currentUser)->where('friend', $friend);
        })
        ->orWhere(function($q) use ($currentUser, $friend) {
            $q->where('user_id', $friend)->where('friend', $currentUser);
        })
        ->delete();
    }

    public function cancelRequest($currentUser, $friend)
    {

        return $this->friend->where('status', StatusFriend::WAITTING)->where(function($q) use ($currentUser, $friend) {
            $q->where('user_id', $currentUser)->where('friend', $friend);
        })
        ->orWhere(function($q) use ($currentUser, $friend) {
            $q->where('user_id', $friend)->where('friend', $currentUser);
        })->delete();
    }

    public function acceptRequest($currentUser, $friend)
    {
        $relationship = $this->friend->where('user_id', $friend)->where('friend', $currentUser)->first();
        $relationship->status = StatusFriend::ACCEPTED;

        return $relationship->save();
    }

    public function getAllFriend($id)
    {
        return $this->friend
        ->where('status', StatusFriend::ACCEPTED)
        ->where(function($q) use ($id) {
            return $q->where('user_id', $id)->orWhere('friend', $id);
        })
        ->with(['friendEntity' => function($q) {
            return $q->select('id', 'name', 'avatar');
        }, 'user' => function($q) {
            return $q->select('id', 'name', 'avatar');
        }])
        ->get();
    }

    public function getStatusFriend($currentUser, $friend)
    {
        return $this->friend->where(function($q) use ($currentUser, $friend) {
            $q->where('user_id', $currentUser)->where('friend', $friend);
        })
        ->orWhere(function($q) use ($currentUser, $friend) {
            $q->where('user_id', $friend)->where('friend', $currentUser);
        })->first();
    }
}