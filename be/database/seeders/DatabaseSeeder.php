<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(UsersTableSeeder::class);
        $this->call(LuckyNumberTableSeeder::class);
        $this->call(CategoriesTableSeeder::class);
        $this->call(BlogsTableSeeder::class);
    }
}
