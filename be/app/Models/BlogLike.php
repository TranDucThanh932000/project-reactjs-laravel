<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BlogLike extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "blog_likes";

    protected $fillable = ['blog_id', 'user_id'];

}
