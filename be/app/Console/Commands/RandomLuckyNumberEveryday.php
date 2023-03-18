<?php

namespace App\Console\Commands;

use App\Models\LuckyNumber;
use Carbon\Carbon;
use Illuminate\Console\Command;

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
        LuckyNumber::create([
            'date' => Carbon::now(),
            'lucky_number' => random_int(0, 9) . random_int(0, 9) . random_int(0, 9) . random_int(0, 9) . random_int(0, 9),
        ]);
    }
}
