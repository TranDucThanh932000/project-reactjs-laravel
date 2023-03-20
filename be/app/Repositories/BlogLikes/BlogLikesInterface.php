<?php

namespace App\Repositories\BlogLikes;

interface BlogLikesInterface
{
    public function like($blogId);
    public function unlike($id);
}