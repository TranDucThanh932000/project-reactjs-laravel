<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\v1\Authentication;

Route::post('/login', [Authentication::class, 'login']);

Route::group([
    'middleware' => ['jwt.auth']
], function() {
    Route::post('/check-token', [Authentication::class, 'checkToken']);
    Route::post('/refresh-token', [Authentication::class, 'refreshToken']);
    Route::get('/logout', [Authentication::class, 'logout']);
});
