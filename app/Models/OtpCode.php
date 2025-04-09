<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OtpCode extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'model', 'model_id', 'code', 'valid_till', 'status',
    ];

    protected $casts = [
        'valid_till' => 'datetime',
    ];
}
