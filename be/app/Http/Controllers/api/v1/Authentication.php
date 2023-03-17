<?php
namespace App\Http\Controllers\api\v1;

use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class Authentication extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('account', 'password');
        try {
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'invalid_credentials'], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'could_not_create_token'], 500);
        }
        return response()->json(compact('token'));
    }

    public function checkToken() {
        $token = JWTAuth::parseToken()->getToken();
        try {
            $user = JWTAuth::parseToken()->authenticate();
            return response()->json(true, 200);
        } catch (JWTException $e) {
            return response()->json(false, 401);
        }
    }

    public function logout(Request $request)
    {
        return response()->json('success', 200);
    }

    public function refreshToken()
    {
        try {
            $refreshed = JWTAuth::refresh(JWTAuth::getToken());
            return response()->json([
                'data' => $refreshed
            ], 200);
        } catch (JWTException $e) {
            return response()->json(['error' => $e], 401);
        }
    }
}