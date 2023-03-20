<?php

namespace App\Repositories\BlogLikes;

use App\Models\Blog;
use App\Models\BlogLike;
use Exception;
use Illuminate\Support\Facades\Auth;

class BlogLikesRepository implements BlogLikesInterface
{
    private $blogLike;

    private $blog;

    public function __construct(BlogLike $blogLike, Blog $blog)
    {
        $this->blogLike = $blogLike;
        $this->blog = $blog;
    }

    public function like($blogId) {
        try {
            $this->blogLike->create([
                'blog_id' => $blogId,
                'user_id' => Auth::user()->id
            ]);

            return $this->blog->where('id', $blogId)->withCount(['blogLikes'])->first();
        } catch (Exception $e) {
            return false;
        }
    }

    public function unlike($id) {
        try {
            $this->blogLike->where([
                'user_id' => Auth::user()->id,
                'blog_id' => $id
            ])->delete();

            return $this->blog->where('id', $id)->withCount(['blogLikes'])->first();
        } catch (Exception $e) {
            return false;
        }
    }
}