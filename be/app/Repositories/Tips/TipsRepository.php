<?php

namespace App\Repositories\Tips;

use App\Models\Tip;

class TipsRepository implements TipsInterface
{
    private $tips;

    public function __construct(Tip $tips)
    {
        $this->tips = $tips;
    }

    public function getById($id)
    {
        return $this->tips
        ->where('category_id', $id)
        ->get();
    }

}
