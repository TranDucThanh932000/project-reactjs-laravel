<?php

namespace App\Http\Controllers\api\v1;

use App\Http\Controllers\Controller;
use App\Models\LuckyNumber;
use App\Enums\StatusCode;

class LuckyNumberController extends Controller
{
    public function getLatestLuckyNumber()
    {
        return response()->json(LuckyNumber::latest()->take(10)->get(), StatusCode::OK);
    }

    public function getLuckyNumberToday()
    {
        return response()->json(LuckyNumber::latest()->take(1)->first(), StatusCode::OK);
    }
}
