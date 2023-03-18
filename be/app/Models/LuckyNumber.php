<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LuckyNumber extends Model
{
    use HasFactory;

    protected $table = "lucky_numbers";
    
    protected $fillable = ['date', 'lucky_number'];
}
