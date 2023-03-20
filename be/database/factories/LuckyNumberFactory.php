<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LuckyNumber>
 */
class LuckyNumberFactory extends Factory
{

    protected $model = \App\Models\LuckyNumber::class;

    public function definition()
    {
        return [
            'date' => now(),
            'lucky_number' => random_int(0, 9) . random_int(0, 9) . random_int(0, 9) . random_int(0, 9) . random_int(0, 9),
        ];
    }

    public function unverified()
    {
    }
}
