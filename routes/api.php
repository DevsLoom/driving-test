<?php

use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\Questions\QuestionCategoryController;
use App\Http\Controllers\Api\Questions\QuestionController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\SummaryController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\TestController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('login', [\App\Http\Controllers\Api\Auth\LoginController::class, 'login']);
    Route::post('register', [\App\Http\Controllers\Api\Auth\RegisterController::class, 'register']);

    Route::prefix('register')->group(function () {
        Route::post('', [\App\Http\Controllers\Api\Auth\RegisterController::class, 'register']);
        Route::post('request', [\App\Http\Controllers\Api\Auth\RegisterController::class, 'registerRequest']);
        Route::post('verify', [\App\Http\Controllers\Api\Auth\RegisterController::class, 'registerVerify']);
    });

    Route::prefix('forget')->group(function () {
        Route::post('request', [\App\Http\Controllers\Api\Auth\ForgetController::class, 'forgetRequest']);
        Route::post('verify', [\App\Http\Controllers\Api\Auth\ForgetController::class, 'forgetVerify']);
        Route::post('password', [\App\Http\Controllers\Api\Auth\ForgetController::class, 'forgetPassword']);
    });
    Route::middleware(['auth:api', 'tokenCheck'])->group(function () {
        Route::get('me', [\App\Http\Controllers\Api\Auth\LoginController::class, 'me']);
        Route::patch('update', [\App\Http\Controllers\Api\Auth\LoginController::class, 'update']);
        Route::post('change-password', [\App\Http\Controllers\Api\Auth\LoginController::class, 'changePassword']);
        Route::post('logout', [\App\Http\Controllers\Api\Auth\LoginController::class, 'logout']);
    });
});

Route::middleware(['auth:api', 'tokenCheck'])->group(function () {
    Route::apiResource('tests', TestController::class)->except(['create', 'edit']);
    Route::prefix('question-manage')->group(function () {
        Route::apiResource('categories', QuestionCategoryController::class)->except(['create', 'edit']);
        Route::apiResource('questions', QuestionController::class)->except(['create', 'edit']);
    });

    Route::apiResource('users', UserController::class)->except(['create', 'edit']);
    Route::apiResource('tags', TagController::class)->except(['create', 'edit']);
    Route::apiResource('favorites', FavoriteController::class)->except(['create', 'edit']);
    Route::apiResource('reports', ReportController::class)->except(['create', 'edit']);
});

Route::apiResource('media-files', MediaController::class)->only(['index', 'store', 'destroy']);
Route::get('summaries', [SummaryController::class, 'summary']);

Route::get('init', function () {
    Artisan::call('migrate --seed');
    Artisan::call('optimize:clear');
    return 'Initial process done';
});
