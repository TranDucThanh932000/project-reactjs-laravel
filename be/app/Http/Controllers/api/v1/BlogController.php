<?php

namespace App\Http\Controllers\api\v1;

use App\Enums\MediaType;
use App\Http\Controllers\Controller;
use App\Repositories\Blogs\BlogsInterface;
use App\Repositories\Medias\MediasInterface;
use App\Traits\StorageImageTrait;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Enums\StatusCode;
use JWTAuth;

class BlogController extends Controller
{
    use StorageImageTrait;

    private $blog;
    private $media;

    public function __construct(BlogsInterface $blog, MediasInterface $media)
    {
        $this->blog = $blog;
        $this->media = $media;
    }

    public function index(Request $request)
    {
        $blog = [];
        $listCategory = [];
        if (!empty($request->categories)) {
            $listCategory = explode('-', $request->categories);
        }
        $blog = $this->blog->get($request->from, $request->amount, $listCategory);

        return response()->json([
            'blogs' => $blog
        ], StatusCode::OK);
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            $user = JWTAuth::parseToken()->authenticate();
            $blog = $this->blog->store([
                'user_id' => $user->id,
                'title' => $request->title,
                'short_description' => $request->shortDescription,
                'content' => $request->description
            ]);
            $listImage = collect([]);
            
            return response()->json([
                'blog' => $request->all()
            ], StatusCode::OK);

            $listUpload = $this->storageTraitUpload($request, env('FOLDER_ID_BLOG'), file_get_contents(storage_path('app/public/KeyGGDrive.txt')));
            foreach($listUpload as $imageDrive) {
                $listImage->push($this->media->store([
                    'file_name' => $imageDrive['name'],
                    'url' => $imageDrive['id'],
                    'type' => MediaType::IMAGE
                ]));
            }

            $blog->blogMedias()->attach($listImage->pluck('id'));

            $blog->blog_likes = [];
            $blog->blog_likes_count = 0;
            $blog->user = [
                'name' => Auth::User()->name
            ];
            $blog->blog_medias = $listImage;
            DB::commit();
    
            return response()->json([
                'blog' => $blog
            ], StatusCode::OK);
        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => $e->getMessage()
            ], 400);
        }
    }

    public function show($id)
    {
        //
    }

    public function edit($id)
    {
        //
    }

    public function update(Request $request, $id)
    {
        //
    }

    public function destroy($id)
    {
        //
    }
}
