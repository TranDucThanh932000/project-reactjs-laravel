<?php

namespace App\Console\Commands;

use App\Models\LuckyNumber;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class RandomLuckyNumberEveryday extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'random_lucky_number';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Random lucky number';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $luckyNumber = LuckyNumber::create([
            'date' => Carbon::now(),
            'lucky_number' => random_int(0, 9) . random_int(0, 9) . random_int(0, 9) . random_int(0, 9) . random_int(0, 9),
        ]);

        $users = ['lykanthrow@gmail.com', 'tranducthanh932000@gmail.com', 'Kenjinguyen2k@gmail.com', 'hungtnhe141246@fpt.edu.vn'];

        Mail::send('email.index', [
            'date' => Carbon::now()->format('d-m-Y'),
            'luckyNumber' => $luckyNumber->lucky_number
        ], function ($email) use ($users) {
            $email->subject('Bú đẫm');
            $email->to($users);
        });
    }
}
