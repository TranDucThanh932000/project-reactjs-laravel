<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateQrCodeRequest extends FormRequest
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
            'inputQrCode' => $this->inputQrCode ? 'required|max:255' : '',
            'images.*' => !$this->inputQrCode ? 'required|image|mimes:jpeg,png,jpg,gif|max:5120' : ''
        ];
    }
}
