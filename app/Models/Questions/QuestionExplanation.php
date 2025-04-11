<?php

namespace App\Models\Questions;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuestionExplanation extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = ['question_id', 'language', 'explanation'];
}
