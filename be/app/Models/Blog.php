<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Blog extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "blogs";
    
    protected $fillable = ['user_id', 'title', 'content', 'status', 'short_description'];

    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function blogLikes() {
        return $this->hasMany(BlogLike::class, 'blog_id', 'id');
    }

    public function blogMedias() {
        return $this->belongsToMany(Media::class, 'blog_medias');
    }
}
