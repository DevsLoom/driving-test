<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'type'       => 'required|in:system,consumer',
            'role_id'    => 'sometimes',
            'first_name' => 'sometimes|required',
            'last_name'  => 'sometimes',
            'avatar'     => 'sometimes',
            'status'     => 'sometimes|in:active,inactive',
        ];

        if ($this->isMethod('post')) {
            $rules['password'] = 'required|min:6';
            $rules['phone']    = 'sometimes|unique:users,phone';
            $rules['email']    = 'sometimes|unique:users,email';
        } elseif ($this->isMethod('patch')) {
            $rules['password'] = 'sometimes';
            $rules['phone']    = 'sometimes';
            $rules['email']    = 'sometimes';
        }

        return $rules;
    }

    protected function failedValidation(Validator $validator)
    {
        if ($this->wantsJson() || $this->ajax()) {
            throw new HttpResponseException(validateError($validator->errors()));
        }
        parent::failedValidation($validator);
    }
}
