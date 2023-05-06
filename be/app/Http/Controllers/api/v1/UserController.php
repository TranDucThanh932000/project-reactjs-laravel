<?php

namespace App\Http\Controllers\api\v1;

use App\Enums\StatusCode;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateInforUserRequest;
use App\Repositories\User\UserInterface;
use Illuminate\Http\Request;
use App\Traits\StorageImageTrait;

class UserController extends Controller
{
    use StorageImageTrait;

    private $user;

    public function __construct(UserInterface $user)
    {
        $this->user = $user;
    }

    //update information user
    public function update(UpdateInforUserRequest $request)
    {
        if(! empty($request->images) && $request->images[0] != null) {
            $image = $this->storageTraitUpload($request, env('FOLDER_ID_BLOG'), file_get_contents(storage_path('app/public/KeyGGDrive.txt')));
            $request['avatar'] = $image[0]['id'];
        }

        return response()->json($this->user->updateInfor($request), StatusCode::OK);
    }

}
