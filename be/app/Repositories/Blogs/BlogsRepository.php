<?php

namespace App\Repositories\Blogs;

use App\Models\Blog;
use App\Enums\BlogStatus;
use JWTAuth;

class BlogsRepository implements BlogsInterface
{

    private $blog;

    public function __construct(Blog $blog)
    {
        $this->blog = $blog;
    }

    public function get($from, $amount, $listCategory)
    {
        $user = null;
        if(auth()->guard('api')->check()) {
            $user = JWTAuth::parseToken()->authenticate();
        }
        
        return $this->blog
        ->when(! empty($listCategory), function ($q) use ($listCategory) {
            return $q->join('blog_categories', 'blog_categories.blog_id', '=', 'blogs.id')
            ->whereIn('blog_categories.category_id', $listCategory);
        })
        ->with(['user', 'blogMedias', 'blogLikes' => function ($q) use($user) {
            $q->where('user_id', $user ? $user->id : null);
        }])
        ->withCount('blogLikes')
        ->where('status', BlogStatus::PUBLIC)
        ->orderBy('blogs.created_at', 'desc')
        ->distinct()
        ->offset($from)
        ->take($amount)
        ->select(['id', 'user_id', 'title', 'short_description', 'created_at', 'updated_at'])
        ->get();
    }

    public function getById($id)
    {
        $user = null;
        if(auth()->guard('api')->check()) {
            $user = JWTAuth::parseToken()->authenticate();
        }

        return $this->blog
        ->with(['user', 'blogMedias', 'blogLikes' => function ($q) use($user) {
            $q->where('user_id', $user ? $user->id : null);
        }])
        ->withCount('blogLikes')
        ->where('status', BlogStatus::PUBLIC)
        ->find($id);
    }

    public function store($blog)
    {
        return $this->blog->create($blog);
    }
}
