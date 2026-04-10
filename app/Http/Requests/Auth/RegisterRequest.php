<?php

namespace Pterodactyl\Http\Requests\Auth;

use Pterodactyl\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = User::getRules();

        return [
            'username' => $rules['username'],
            'email' => $rules['email'],
            'first_name' => $rules['name_first'],
            'last_name' => $rules['name_last'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ];
    }

    public function attributes(): array
    {
        return [
            'first_name' => 'first name',
            'last_name' => 'last name',
        ];
    }

    public function toCreationArray(): array
    {
        $data = $this->validated();

        return [
            'username' => $data['username'],
            'email' => $data['email'],
            'name_first' => $data['first_name'],
            'name_last' => $data['last_name'],
            'password' => $data['password'],
            'language' => config('app.locale', 'en'),
            'root_admin' => false,
        ];
    }
}
