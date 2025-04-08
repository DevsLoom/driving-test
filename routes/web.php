<?php

use Illuminate\Support\Facades\Route;

Route::get('/', fn() => inertia('Home'));

Route::prefix('admin')->group(function () {
    Route::get('dashboard', fn() => inertia('panel/Dashboard'));

    Route::prefix('tests')->group(function () {
        Route::get('', fn() => inertia('panel/Tests/List'));

        Route::prefix('{id}')->group(function () {
            Route::get('show', fn($id) => inertia('panel/Tests/Show', ['id' => $id]));

            Route::prefix('questions')->group(function () {
                Route::get('create', fn($id) => inertia('panel/Tests/Questions/Form', ['id' => $id]));

                Route::prefix('{question_id}')->group(function () {
                    Route::get('edit', fn($id, $question_id) => inertia('panel/Tests/Questions/Form', ['id' => $id, 'question_id' => $question_id]));
                });
            });
        });
    });
});
