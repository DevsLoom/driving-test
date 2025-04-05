<?php

namespace App\Models;

use App\Services\TagService;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Test extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = ['name', 'slug', 'image', 'tags', 'position', 'status', 'created_by', 'updated_by', 'deleted_by'];
    protected $casts    = ['tags' => 'array'];

    protected function setNameAttribute($value)
    {
        $this->attributes['slug'] = Str::slug($value);
        $this->attributes['name'] = $value;
    }

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
}
