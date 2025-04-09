<?php

use Illuminate\Support\Facades\Route;

Route::get('/', fn() => redirect('login'));
Route::get('login', fn() => inertia('auth/Login'));

Route::prefix('register')->group(function () {
    Route::get('', fn() => inertia('auth/Register/index'));
    Route::get('verify', fn() => inertia('auth/Register/Verify'));
    Route::get('request', fn() => inertia('auth/Register/Request'));
});

Route::prefix('forget-password')->group(function () {
    Route::get('', fn() => inertia('auth/Forget/Request'));
    Route::get('verify', fn() => inertia('auth/Forget/Verify'));
    Route::get('new-password', fn() => inertia('auth/Forget/Password'));
});

Route::prefix('admin')->group(function () {
    Route::get('dashboard', fn() => inertia('panel/Dashboard'));

    Route::prefix('question-manage')->group(function () {
        Route::get('categories', fn() => inertia('panel/Questions/Categories/List'));
    });

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
