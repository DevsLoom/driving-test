<?php

namespace App\Models\Questions;

use App\Services\TagService;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Question extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = ['question_category_id', 'title', 'tags', 'image', 'video_url', 'position', 'status', 'created_by', 'updated_by', 'deleted_by'];
    protected $casts    = ['tags' => 'array'];

    protected static function booted()
    {
        parent::boot();
        static::creating(function ($q) {
            if (auth()->check()) {
                $q->created_by = auth()->id();
                $q->updated_by = auth()->id();
            }

            if (isset($q['tags']) && count($q['tags'])) {
                (new TagService)->processTags($q['tags']);
            }
        });
        static::updating(function ($q) {
            if (auth()->check()) {
                $q->updated_by = auth()->id();
            }

            if (isset($q['tags']) && count($q['tags'])) {
                (new TagService)->processTags($q['tags']);
            }
        });
        static::deleting(function ($q) {
            if (auth()->check()) {
                $q->deleted_by = auth()->id();
                $q->save();
            }
        });
    }

    public function category()
    {
        return $this->belongsTo(QuestionCategory::class);
    }

    public function options()
    {
        return $this->belongsToMany(Option::class, QuestionOptionMap::class, 'question_id', 'option_id');
    }

    public function questionCorrectOption()
    {
        return $this->hasOne(QuestionCorrectOption::class, 'question_id');
    }

    public function explanations()
    {
        return $this->hasMany(QuestionExplanation::class, 'question_id');
    }

}
