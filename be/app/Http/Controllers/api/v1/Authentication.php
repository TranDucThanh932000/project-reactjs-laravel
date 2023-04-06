<?php
namespace App\Http\Controllers\api\v1;

use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Repositories\User\UserInterface;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class Authentication extends Controller
{
    private $user;

    public function __construct(UserInterface $user)
    {
        $this->user = $user;
    }

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

    public function logout()
    {

        try {
            $user = Auth::user();

            $token = JWTAuth::fromUser($user);
    
            JWTAuth::parseToken()->authenticate();
    
            JWTAuth::invalidate($token);
    
            return response()->json('success', 200);
        } catch (Exception $e) {
            return response()->json('fail', 400);
        }
    }

    public function refreshToken()
    {
        try {
            $refreshed = JWTAuth::refresh(JWTAuth::getToken());
            return response()->json([
                'token' => $refreshed
            ], 200);
        } catch (JWTException $e) {
            return response()->json(['error' => $e], 401);
        }
    }

    public function register(RegisterRequest $request)
    {
        if($this->user->getByAccount($request->account)) {
            return response()->json(['error' => 'Existed account'], 400);
        }

        $this->user->store($request->all());

        $credentials = [
            'account' => $request->account,
            'password' => $request->password
        ];
        try {
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'invalid_credentials'], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'could_not_create_token'], 500);
        }
        return response()->json(compact('token'));
    }
}