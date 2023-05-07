<?php

namespace App\Http\Controllers\api\v1;

use App\Enums\StatusCode;
use App\Http\Controllers\Controller;
use App\Traits\StorageImageTrait;
use Illuminate\Http\Request;

class UploadImageEditorController extends Controller
{
    use StorageImageTrait;
    
    public function uploadImageEditor(Request $request)
    {
        $image = $this->storageTraitUpload($request, env('FOLDER_ID_BLOG'), file_get_contents(storage_path('app/public/KeyGGDrive.txt')));

        return response()->json($image[0]['id'], StatusCode::OK);
    }
}
