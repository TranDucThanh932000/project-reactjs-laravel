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
        $template = [
            'Chúc bạn ngủ ngon và sạc đầy năng lượng để bắt đầu một ngày mới đầy hứa hẹn.',
            'Ngủ ngon và hãy sẵn sàng cho những thách thức mới trong ngày mai.',
            'Hãy để giấc ngủ của bạn mang lại năng lượng và sức mạnh để vượt qua mọi trở ngại.',
            'Chúc bạn ngủ ngon và tỉnh dậy với tâm trạng tràn đầy năng lượng để làm những việc mình yêu thích.',
            'Hãy để giấc ngủ của bạn làm mới tinh thần và sẵn sàng cho những điều tốt đẹp đến với mình.',
            'Chúc bạn ngủ ngon và sẵn sàng để gặp gỡ những cơ hội mới và thành công trong ngày mai.',
            'Ngủ ngon và hãy nhớ rằng một giấc ngủ sâu và đầy năng lượng là chìa khóa của một ngày thành công.',
            'Hãy để giấc ngủ đem lại cho bạn sức mạnh và động lực để hoàn thành những mục tiêu của mình.',
            'Chúc bạn ngủ ngon và tỉnh dậy với tinh thần sảng khoái, tràn đầy năng lượng để tận hưởng một ngày mới.',
            'Hãy để giấc ngủ của bạn đem lại cho bạn năng lượng và sức mạnh để thực hiện những ước mơ của mình.'
        ];

        $urlImg = [
            'https://antimatter.vn/wp-content/uploads/2022/05/anh-chuc-ngu-ngon-em-be-ngu-tren-may.jpg',
            'https://www.vietbamedia.com.vn/FileUpload/Images/2345e.jpg',
            'https://khoinguonsangtao.vn/wp-content/uploads/2022/11/anh-chuc-ngu-ngon-gau-truc-mim-cuoi.jpg',
            'https://png.pngtree.com/png-clipart/20190117/ourlarge/pngtree-good-night-superman-baby-cartoon-hand-drawn-illustration-small-baby-hand-png-image_426177.jpg',
            'https://khoinguonsangtao.vn/wp-content/uploads/2022/11/anh-chuc-ngu-ngon-nen-xam.jpg',
            'https://khoinguonsangtao.vn/wp-content/uploads/2022/11/anh-chuc-ngu-ngon-dang-yeu-nhat.jpg',
            'https://khoinguonsangtao.vn/wp-content/uploads/2022/11/anh-chuc-ngu-ngon-kute-mat-trang-ngu.jpg',
            'https://haycafe.vn/wp-content/uploads/2021/12/Hinh-nen-chuc-ngu-ngon-bau-troi-dem-cute.jpg',
            'https://img.meta.com.vn/Data/image/2022/02/22/hinh-anh-chuc-ngu-ngon-5.jpg',
            'https://khoinguonsangtao.vn/wp-content/uploads/2022/11/anh-chuc-ngu-ngon-cu-cai-an-keo.jpg'
        ];

        $users = ['lykanthrow@gmail.com', 'tranducthanh932000@gmail.com', 'Kenjinguyen2k@gmail.com', 'hungtnhe141246@fpt.edu.vn'];

        Mail::send('email.good_night', [
            'date' => Carbon::now()->format('d/m/Y'),
            'time' => Carbon::now()->format('h:m A'),
            'urlImg' => $urlImg[random_int(1, 10) - 1],
            'content' => $template[random_int(1, 10) - 1]
        ], function ($email) use ($users) {
            $email->subject('Chúc ngủ ngon');
            $email->to($users);
        });
    }
}
