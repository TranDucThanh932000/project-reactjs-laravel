<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('medias', function (Blueprint $table) {
            $table->id();
            $table->string('file_name');
            $table->string('url');
            $table->string('type');
            $table->timestamps();
            $table->softDeletes();

            //bảng này sẽ gom hết tất cả các chức năng liên quan tới media

            //không muốn chèn blog_id vào bảng này vì tính mở rộng sau này (nếu cho blog_id vào 
            //thì sau này nếu như thêm 1 tính năng khác dùng media thì sẽ không có blog_id và phải
            //tạo thêm bảng media khác)
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('medias');
    }
};
