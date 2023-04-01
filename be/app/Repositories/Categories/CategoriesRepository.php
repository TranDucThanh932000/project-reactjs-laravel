<?php

namespace App\Repositories\Categories;

use App\Models\Category;
use Illuminate\Support\Facades\Auth;

class CategoriesRepository implements CategoriesInterface
{
    private $category;

    public function __construct(Category $category)
    {
        $this->category = $category;
    }

    public function get()
    {
        return $this->category->select('id', 'name')->get();
    }
}
