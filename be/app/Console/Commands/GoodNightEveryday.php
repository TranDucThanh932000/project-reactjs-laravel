<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class GoodNightEveryday extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'good_night';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Good night';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $users = ['lykanthrow@gmail.com', 'tranducthanh932000@gmail.com', 'Kenjinguyen2k@gmail.com', 'hungtnhe141246@fpt.edu.vn'];

        Mail::send('email.good_night', [
            'date' => Carbon::now()->format('d-m-Y'),
        ], function ($email) use ($users) {
            $email->subject('Chúc ngủ ngon');
            $email->to($users);
        });
    }
}
