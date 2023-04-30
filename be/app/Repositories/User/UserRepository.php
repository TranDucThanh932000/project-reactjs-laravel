<?php

namespace App\Repositories\User;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserRepository implements UserInterface
{
    private $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function store($user)
    {
        return $this->user->create([
            'name' => $user['name'],
            'account' => $user['account'],
            'email' => $user['email'],
            'password' => Hash::make($user['password'])
        ]);
    }

    public function getByAccount($account)
    {
        return $this->user->where('account', $account)->first();
    }

    public function getById($id)
    {
        return $this->user->find($id);
    }
}
