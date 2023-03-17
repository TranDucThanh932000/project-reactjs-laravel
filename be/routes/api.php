<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\v1\Authentication;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::post('/login', [Authentication::class, 'login'])->name('api.login');

Route::group([
    'middleware' => 'jwt.auth'
], function() {
    Route::get('/logout', [Authentication::class, 'logout'])->name('api.login');
});
