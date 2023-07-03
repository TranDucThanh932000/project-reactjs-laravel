<?php

namespace App\Repositories\MenuTips;

use App\Models\MenuTip;

class MenuTipsRepository implements MenuTipsInterface
{
    private $menuTips;

    public function __construct(MenuTip $menuTips)
    {
        $this->menuTips = $menuTips;
    }

    public function getAll()
    {
        return $this->menuTips
        ->with('recursive_tree')
        ->where('parent_id', 0)
        ->get();
    }

}
