<?php

namespace App\Repositories\Blogs;

interface BlogsInterface
{
    public function get($from, $to, $listCategory);
    public function getById($id);
    public function store($blog);
}