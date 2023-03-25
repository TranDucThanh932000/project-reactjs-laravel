<?php

namespace App\Repositories\Medias;

use App\Models\Media;

class MediasRepository implements MediasInterface
{
    private $media;

    public function __construct(Media $media)
    {
        $this->media = $media;
    }

    public function store($medias)
    {
        return $this->media->create($medias);
    }
}
