<?php

namespace App\Models\Questions;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuestionCategory extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = ['name', 'image', 'position', 'status', 'created_by', 'updated_by', 'deleted_by'];

    protected static function booted()
    {
        parent::boot();
        static::creating(function ($q) {
            if (auth()->check()) {
                $q->created_by = auth()->id();
                $q->updated_by = auth()->id();
            }
        });
        static::updating(function ($q) {
            if (auth()->check()) {
                $q->updated_by = auth()->id();
            }
        });
        static::deleting(function ($q) {
            if (auth()->check()) {
                $q->deleted_by = auth()->id();
                $q->save();
            }
        });
    }
}
