<?php

use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\TestController;
use Illuminate\Support\Facades\Route;

Route::apiResource('tests', TestController::class)->except(['create', 'edit']);
Route::apiResource('questions', QuestionController::class)->except(['create', 'edit']);
Route::apiResource('favorites', FavoriteController::class)->except(['create', 'edit']);
Route::apiResource('reports', ReportController::class)->except(['create', 'edit']);
