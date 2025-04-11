<?php

namespace App\Http\Requests\Questions;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class QuestionRequest extends FormRequest
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
            'question_category_id'       => 'sometimes|required',
            'title'                      => 'sometimes|required',
            'tags'                       => 'sometimes|array',
            'image'                      => 'sometimes',
            'video_url'                  => 'sometimes',

            'options'                    => 'sometimes|array',
            'options.*.title'            => 'sometimes',
            'options.*.is_correct'       => 'sometimes',

            'explanations'               => 'sometimes|array',
            'explanations.*.language'    => 'sometimes',
            'explanations.*.explanation' => 'sometimes',

            'status'                     => 'sometimes|in:active,inactive',
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
