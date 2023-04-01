<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BlogsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $blogs = \App\Models\Blog::factory()->count(30)->create();

        foreach($blogs as $blog) {
            $listBlogCategories = [];
            $randomNumber = random_int(1, 10);
            for($i = 1; $i <= $randomNumber; $i++) {
                $listBlogCategories[] = [
                    'blog_id' => $blog->id,
                    'category_id' => $i
                ];
            }
            DB::table('blog_categories')->insert($listBlogCategories);
        }
    }
}
