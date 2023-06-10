<?php

namespace App\Repositories\Blogs;

use App\Enums\BlogSortBy;
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

    public function get($from, $amount, $listCategory, $sortBy)
    {
        $user = null;
        if(auth()->guard('api')->check()) {
            $user = JWTAuth::parseToken()->authenticate();
        }

        $listSort = [];
        if($sortBy != '') {
            $listSort = explode(',', $sortBy);
        }
        
        return $this->blog
        ->select('id', 'user_id', 'title', 'short_description', 'created_at', 'updated_at', 'view')
        ->when(! empty($listCategory), function ($q) use ($listCategory) {
            return $q->join('blog_categories', 'blog_categories.blog_id', '=', 'blogs.id')
            ->whereIn('blog_categories.category_id', $listCategory);
        })
        ->with(['user', 'blogMedias', 'blogLikes' => function ($q) use ($user) {
            $q->where('user_id', $user ? $user->id : null);
        }])
        ->withCount('blogLikes')
        ->where('status', BlogStatus::PUBLIC)
        ->when(count($listSort) > 0, function ($q) use ($listSort) {
            foreach($listSort as $col) {
                $q->orderBy($col, 'desc');
            }
        })
        ->orderByDesc('blogs.created_at')
        ->distinct()
        ->offset($from)
        ->take($amount)
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

    public function upView($id)
    {
        $blog = $this->blog->find($id);
        if(!$blog) {
            return false;
        }
        $blog->view++;
        
        return $blog->save();
    }

    public function getBlogOfUser($userId)
    {
        return $this->blog
        ->select('id', 'user_id', 'title', 'short_description', 'created_at', 'updated_at', 'view')
        ->with(['user', 'blogMedias'])
        ->withCount('blogLikes')
        ->where('status', BlogStatus::PUBLIC)
        ->where('user_id', $userId)
        ->orderByDesc('blogs.created_at')
        ->distinct()
        ->get();
    }

    public function searchByTitle($txtSearch)
    {
        return $this->blog->select(['id', 'title'])->where('title', 'like', '%' . $txtSearch . '%')->limit(5)->get();
    }
}
