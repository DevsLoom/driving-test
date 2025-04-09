<?php

use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\Questions\QuestionCategoryController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\TestController;
use Illuminate\Support\Facades\Route;

Route::apiResource('tags', TagController::class)->except(['create', 'edit']);
Route::apiResource('tests', TestController::class)->except(['create', 'edit']);
Route::apiResource('questions', QuestionController::class)->except(['create', 'edit']);
Route::apiResource('favorites', FavoriteController::class)->except(['create', 'edit']);
Route::apiResource('reports', ReportController::class)->except(['create', 'edit']);

Route::prefix('question-manage')->group(function () {
    Route::apiResource('categories', QuestionCategoryController::class)->except(['create', 'edit']);
});

Route::apiResource('media-files', MediaController::class)->only(['index', 'store', 'destroy']);
