<?php

namespace App\Repositories\Blogs;

interface BlogsInterface
{
    public function get($from, $to);
}