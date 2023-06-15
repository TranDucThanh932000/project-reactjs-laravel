<?php
namespace App\Http\Controllers\api\v1;

use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Repositories\User\UserInterface;
use Exception;
use Illuminate\Http\Request;
use App\Enums\StatusCode;

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
        $token = '';
        try {
            //one month
            if (! $token = JWTAuth::attempt($credentials, ['ttl' => 2592000])) {
                return response()->json(['error' => 'invalid_credentials'], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'could_not_create_token'], 500);
        }
        return response()->json([
            'token' => $token,
            'user' => $this->user->getByAccount($request->account)
        ]);
    }

    public function checkToken() {
        $token = JWTAuth::parseToken()->getToken();
        try {
            $user = JWTAuth::parseToken()->authenticate();
            return response()->json($user, StatusCode::OK);
        } catch (JWTException $e) {
            return response()->json(false, 401);
        }
    }

    public function logout()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $token = JWTAuth::fromUser($user);
    
            JWTAuth::invalidate($token);
    
            return response()->json('success', StatusCode::OK);
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
            ], StatusCode::OK);
        } catch (JWTException $e) {
            return response()->json(['error' => $e], 401);
        }
    }

    public function register(RegisterRequest $request)
    {
        if($this->user->getByAccount($request->account)) {
            return response()->json(['error' => 'Existed account'], 400);
        }

        $user = $this->user->store($request->all());

        $credentials = [
            'account' => $request->account,
            'password' => $request->password
        ];
        try {
            //one month
            if (! $token = JWTAuth::attempt($credentials, ['ttl' => 2592000])) {
                return response()->json(['error' => 'invalid_credentials'], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'could_not_create_token'], 500);
        }
        $user['token'] = $token;
        return response()->json(compact('token', 'user'));
    }

    public function checkAccountExist(Request $request)
    {
        try {
            $user = $this->user->getByAccount($request->account);
            if($user) {
                return response()->json([
                    'isAccountValid' => false
                ], StatusCode::OK);
            }
            
            return response()->json([
                'isAccountValid' => true
            ], StatusCode::OK);
        } catch (Exception $e) {
            return response()->json('fail', 400);
        }
    }
}