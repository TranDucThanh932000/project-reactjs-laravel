<?php

namespace App\Http\Controllers\api\v1;

use App\Http\Controllers\Controller;
use App\Models\LuckyNumber;
use Illuminate\Http\Request;

class LuckyNumberController extends Controller
{
    public function getLatestLuckyNumber()
    {
        return response()->json(LuckyNumber::latest()->take(10)->get(), 200);
    }

    public function getLuckyNumberToday()
    {
        return response()->json(LuckyNumber::latest()->take(1)->first(), 200);
    }
}
