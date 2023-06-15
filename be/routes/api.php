<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\v1\Authentication;
use App\Http\Controllers\api\v1\BlogController;
use App\Http\Controllers\api\v1\BlogLikeController;
use App\Http\Controllers\api\v1\CategoryController;
use App\Http\Controllers\api\v1\ChatController;
use App\Http\Controllers\api\v1\FollowerController;
use App\Http\Controllers\api\v1\FriendController;
use App\Http\Controllers\api\v1\GoogleDriveController;
use App\Http\Controllers\api\v1\LuckyNumberController;
use App\Http\Controllers\api\v1\NotificationController;
use App\Http\Controllers\api\v1\QrCodeController;
use App\Http\Controllers\api\v1\UploadImageEditorController;
use App\Http\Controllers\api\v1\UserController;

//google drive
Route::get('google/login',[GoogleDriveController::class,'googleLogin'])->name('google.login');

Route::post('/login', [Authentication::class, 'login']);
Route::post('/register', [Authentication::class, 'register']);
Route::post('/refresh-token', [Authentication::class, 'refreshToken']);
Route::post('/check-token', [Authentication::class, 'checkToken']);
Route::get('/check-account', [Authentication::class, 'checkAccountExist']);

Route::get('/lucky-number-today', [LuckyNumberController::class, 'getLuckyNumberToday']);
Route::get('/lucky-number-latest', [LuckyNumberController::class, 'getLatestLuckyNumber']);

Route::get('/blogs/search', [BlogController::class, 'searchByTitle']);
Route::resource('blogs', BlogController::class);
Route::group(['prefix' => 'blogs',  'namespace' => 'Blog'], function() {
    Route::post('/up-view', [BlogController::class, 'upView']);
});
Route::resource('categories', CategoryController::class);
Route::get('follow/top5', [FollowerController::class, 'getTop5']);
Route::post('/qr-code', [QrCodeController::class, 'store']);

Route::get('/user/list-blog/{userId}', [BlogController::class, 'listBlogOfUser']);
Route::get('/user/search', [UserController::class, 'searchByName']);
Route::get('/user/{id}', [UserController::class, 'getById']);

Route::group([
    'middleware' => ['jwt.auth', 'throttle:240'],
], function() {
    Route::group([
        'prefix' => 'chat',
    ], function() {
        Route::get('users-contacted', [ChatController::class, 'getUsersContacted']);
        Route::get('msg-friend', [ChatController::class, 'getMsgFriend']);

        Route::post('pusher/user-auth', [ChatController::class, 'authOnline']);
        Route::post('pusher/auth', [ChatController::class, 'authBroadCasting']);
    });

    Route::post('/upload-image-editor', [UploadImageEditorController::class, 'uploadImageEditor']);
    Route::post('/logout', [Authentication::class, 'logout']);
    Route::resource('user', UserController::class);

    Route::get('/follow/status/{follower}', [FollowerController::class, 'checkStatusFollowing']);
    Route::resource('follow', FollowerController::class);

    Route::resource('chat', ChatController::class);
    Route::resource('bloglikes', BlogLikeController::class);

    Route::post('/friend/cancel-request', [FriendController::class, 'cancelRequest']);
    Route::post('/friend/accept-request', [FriendController::class, 'acceptRequest']);
    Route::get('/friend/list-friend/{id}', [FriendController::class, 'listFriend']);
    Route::get('/friend/status/{friend}', [FriendController::class, 'checkStatus']);
    Route::resource('friend', FriendController::class);

    Route::post('notification/mark-status-read', [NotificationController::class, 'markStatusRead']);
    Route::post('notification/seen-all', [NotificationController::class, 'seenAll']);
    Route::get('notification/count-noti-unread', [NotificationController::class, 'countNotificationUnRead']);
    Route::resource('notification', NotificationController::class);
});