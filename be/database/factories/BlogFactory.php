<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Blog>
 */
class BlogFactory extends Factory
{
    public function definition()
    {
        return [
            'user_id' => User::factory()->count(1)->create()->first()->id,
            'title' => $this->faker->title(),
            'content' => Str::random(1000),
            'status' => 1
        ];
    }
}
