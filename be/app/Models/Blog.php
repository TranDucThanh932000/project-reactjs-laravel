<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Blog extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "blogs";
    
    protected $fillable = ['title', 'content', 'status'];

    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function blogLikes () {
        return $this->hasMany(BlogLike::class, 'blog_id', 'id');
    }
}
