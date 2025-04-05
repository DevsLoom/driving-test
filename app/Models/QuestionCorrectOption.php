<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuestionCorrectOption extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = ['question_id', 'option_id'];
}
