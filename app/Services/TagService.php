<?php

namespace App\Services;

use App\Models\Tag;

class TagService
{
    public function processTags(array $keywords)
    {
        foreach ($keywords as $item) {
            if (!Tag::where('name', $item)->exists()) {
                Tag::create(['name' => $item]);
            }
        }
    }
}
