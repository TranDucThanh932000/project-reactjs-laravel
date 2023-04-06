<?php

namespace App\Repositories\User;

interface UserInterface
{
    public function store($user);
    public function getByAccount($account);
}