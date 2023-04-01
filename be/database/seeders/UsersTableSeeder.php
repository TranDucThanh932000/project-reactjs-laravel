<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Str;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'Trần Đức Thành',
            'email' => 'tranducthanh932000@gmail.com',
            'account' => 'thanhgpt2k',
            'email_verified_at' => now(),
            'password' => '$2a$12$gJvbN4gaHLBXhQXWDeoHM.uoLWcrkvEKHOUeXrgSziQVMCl62K4Ju', // 123123123
            'remember_token' => Str::random(10),
        ]);
        User::factory()->count(30)->create();
    }
}
