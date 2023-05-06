<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInforUserRequest extends FormRequest
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
            'password' =>  $this->password ? 'min:6|max:16' : '',
            'images.*' => $this->images[0] != null ? 'image|mimes:jpeg,png,jpg,gif|max:5120' : ''
        ];
    }
}
