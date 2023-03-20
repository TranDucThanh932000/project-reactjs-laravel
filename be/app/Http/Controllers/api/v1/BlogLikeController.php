<?php

namespace App\Http\Controllers\api\v1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\BlogLikes\BlogLikesInterface;

class BlogLikeController extends Controller
{

    private $blogLike;

    public function __construct(BlogLikesInterface $blogLike)
    {
        $this->blogLike = $blogLike;
    }

    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $blogLike = $this->blogLike->like($request->blogId);
        if (! $blogLike) {
            return response()->json([
                'status' => 'fail'
            ], 400);
        }
        return response()->json([
            'status' => 'success',
            'newCount' => $blogLike->blog_likes_count
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $blogLike = $this->blogLike->unlike($id);
        if (! $blogLike) {
            return response()->json([
                'status' => 'fail'
            ], 400);
        }
        return response()->json([
            'status' => 'success',
            'newCount' => $blogLike->blog_likes_count
        ], 200);
    }
}
