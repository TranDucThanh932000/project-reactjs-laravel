<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class QuestionToUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'question_user';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Question user';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $users = ['nguyendaiduong953@gmail.com'];

        Mail::send('email.question', [
            'date' => Carbon::now()->format('d-m-Y'),
            'question' => 'Hôm nay ăn gì anh?'
        ], function ($email) use ($users) {
            $email->subject('Bữa trưa vui vẻ');
            $email->to($users);
        });
    }
}
