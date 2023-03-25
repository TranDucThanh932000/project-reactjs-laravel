<?php

namespace App\Repositories\Blogs;

use App\Models\Blog;
use Illuminate\Support\Facades\Auth;
use App\Enums\BlogStatus;

class BlogsRepository implements BlogsInterface
{

    private $blog;

    public function __construct(Blog $blog)
    {
        $this->blog = $blog;
    }

    public function get($from, $amount)
    {
        return $this->blog->with(['user', 'blogMedias', 'blogLikes' => function ($q) {
            $q->where('user_id', Auth::user()->id);
        }])->withCount('blogLikes')
        ->where('status', BlogStatus::PUBLIC)
        ->orderBy('blogs.created_at', 'desc')
        ->offset($from)
        ->take($amount)
        ->get();
    }

    public function store($blog)
    {
        return $this->blog->create($blog);
    }
}
