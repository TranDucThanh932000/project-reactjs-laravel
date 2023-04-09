<?php

namespace App\Repositories\Message;

interface MessageInterface
{
    public function sendMessage($message);
    public function usersContacted($userId);
    public function getMessageOfFriend($friendId, $currentUserId);
}