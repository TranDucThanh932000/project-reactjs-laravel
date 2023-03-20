<?php

namespace App\Repositories\Blogs;

use App\Models\Blog;
use Illuminate\Support\Facades\Auth;

class BlogsRepository implements BlogsInterface
{

    private $blog;

    public function __construct(Blog $blog)
    {
        $this->blog = $blog;
    }

    public function get()
    {
        return $this->blog->with(['user', 'blogLikes' => function ($q) {
            $q->where('user_id', Auth::user()->id);
        }])->withCount('blogLikes')->get();
    }
}
