<?php

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class UserUpdateRequest extends FormRequest
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
        return [
            'first_name'        => 'sometimes',
            'last_name'         => 'sometimes',
            'phone'             => 'sometimes|unique:users,phone,' . $this->user()->id,
            'email'             => 'sometimes|unique:users,email,' . $this->user()->id,
            'avatar'            => 'sometimes',

            'father_name'       => 'sometimes',
            'mother_name'       => 'sometimes',
            'gender'            => 'sometimes',
            'marital_status'    => 'sometimes',
            'blood_group'       => 'sometimes',
            'height'            => 'sometimes',
            'weight'            => 'sometimes',
            'nid_number'        => 'sometimes',
            'date_of_birth'     => 'sometimes',
            'nationality'       => 'sometimes',
            'present_address'   => 'sometimes',
            'permanent_address' => 'sometimes',
            'signature'         => 'sometimes',

            'hobbies'           => 'sometimes|array',

            'skills'            => 'sometimes|array',
            'skills.*.id'       => 'sometimes',
            'skills.*.name'     => 'sometimes',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        if ($this->wantsJson() || $this->ajax()) {
            throw new HttpResponseException(validateError($validator->errors()));
        }
        parent::failedValidation($validator);
    }
}
