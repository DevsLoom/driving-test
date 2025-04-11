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

    Route::prefix('tests')->group(function () {
        Route::get('', fn() => inertia('panel/Tests/List'));
        Route::prefix('{id}')->group(function () {
            Route::get('show', fn($id) => inertia('panel/Tests/Show', ['id' => $id]));
        });
    });

    Route::prefix('question-manage')->group(function () {
        Route::get('categories', fn() => inertia('panel/QuestionManage/Categories/List'));
        Route::prefix('questions')->group(function () {
            Route::get('', fn() => inertia('panel/QuestionManage/Questions/List'));
            Route::get('create', fn() => inertia('panel/QuestionManage/Questions/Form'));
            Route::prefix('{id}')->group(function () {
                Route::get('edit', fn($id) => inertia('panel/QuestionManage/Questions/Form', ['id' => $id]));
            });
        });
    });

    Route::prefix('roles')->group(function () {
        Route::get('', fn() => inertia('panel/Roles/List'));
        Route::get('create', fn() => inertia('panel/Roles/Form'));
        Route::prefix('{id}')->group(function () {
            Route::get('edit', fn($id) => inertia('panel/Roles/Form', ['id' => $id]));
        });
    });
    Route::get('stuffs', fn() => inertia('panel/Stuffs/List'));
});
