<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuTip extends Model
{
    use HasFactory;

    public function tree_immediate_children() {
        return $this->hasMany(MenuTip::class, 'parent_id');
    }

    public function recursive_tree(){
        return $this->tree_immediate_children()->with('recursive_tree');
    }
}
