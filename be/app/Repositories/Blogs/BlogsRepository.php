<?php

namespace App\Repositories\Blogs;

use App\Models\Blog;
use Illuminate\Support\Facades\Auth;
use App\Enums\BlogStatus;
use Tymon\JWTAuth\Facades\JWTAuth;

class BlogsRepository implements BlogsInterface
{

    private $blog;

    public function __construct(Blog $blog)
    {
        $this->blog = $blog;
    }

    public function get($from, $amount, $listCategory)
    {
        $user = JWTAuth::parseToken()->authenticate();

        return $this->blog
        ->when(! empty($listCategory), function ($q) use ($listCategory) {
            return $q->join('blog_categories', 'blog_categories.blog_id', '=', 'blogs.id')
            ->whereIn('blog_categories.category_id', $listCategory);
        })
        ->with(['user', 'blogMedias', 'blogLikes' => function ($q) use($user) {
            $q->where('user_id', $user ? $user->id : null);
        }])->withCount('blogLikes')
        ->where('status', BlogStatus::PUBLIC)
        ->orderBy('blogs.created_at', 'desc')
        ->distinct()
        ->offset($from)
        ->take($amount)
        ->get();
    }

    public function store($blog)
    {
        return $this->blog->create($blog);
    }
}
