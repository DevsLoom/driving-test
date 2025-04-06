<?php

use Illuminate\Support\Facades\Route;

Route::get('/', fn() => inertia('Home'));

Route::prefix('admin')->group(function () {
    Route::get('dashboard', fn() => inertia('panel/Dashboard'));
});
