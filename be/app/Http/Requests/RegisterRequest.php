<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'name' => 'required|min:6|max:32',
            'email' => 'required|email',
            'account' => 'required|min:6|max:16|unique:users,account',
            'password' => 'required|min:6|max:16|confirmed',
            'password_confirmation' => 'required|min:6|max:16'
        ];
    }
}
