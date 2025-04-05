<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tag extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = ['name', 'status', 'created_by', 'updated_by', 'deleted_by'];

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
