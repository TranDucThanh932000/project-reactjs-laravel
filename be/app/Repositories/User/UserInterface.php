<?php

namespace App\Repositories\User;

interface UserInterface
{
    public function store($user);
    public function getByAccount($account);
    public function getById($id);
    public function updateInfor($id);
    public function searchByName($txtSearch);
}