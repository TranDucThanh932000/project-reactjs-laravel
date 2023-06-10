<?php

namespace App\Repositories\Blogs;

interface BlogsInterface
{
    public function get($from, $to, $listCategory, $sortBy);
    public function getById($id);
    public function store($blog);
    public function upView($id);
    public function getBlogOfUser($userId);
    public function searchByTitle($txtSearch);
}