<?php

namespace App\Http\Controllers\api\v1;

use App\Enums\StatusCode;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use App\Traits\StorageImageTrait;

class QrCodeController extends Controller
{
    use StorageImageTrait;

    public function store(Request $request)
    {
        //text
        if(!empty($request->inputQrCode)) {
            return response()->json(QrCode::size(300)->generate($request->inputQrCode) . '', StatusCode::OK);
        }
        //image
        $qrCode = $this->storageTraitUpload($request, env('FOLDER_ID_BLOG'), file_get_contents(storage_path('app/public/KeyGGDrive.txt')));
        return response()->json(QrCode::size(300)->generate('https://docs.google.com/uc?id=' . $qrCode[0]['id']) . '', StatusCode::OK);
    }
}
