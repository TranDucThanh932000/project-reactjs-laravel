<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $table = "notifications";
    
    protected $fillable = ['owner', 'to_user', 'type', 'status'];

    public function ownerUser()
    {
        return $this->hasOne(User::class, 'id', 'owner');
    }
}
