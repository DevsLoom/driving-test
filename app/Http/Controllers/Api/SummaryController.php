<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Questions\Question;
use App\Models\Questions\QuestionCategory;
use App\Models\Test;
use Exception;

class SummaryController extends Controller
{
    public function summary()
    {
        try {
            $totalTest             = Test::count();
            $totalQuestionCategory = QuestionCategory::count();
            $totalQuestion         = Question::count();

            return entityResponse([
                'total_test'              => $totalTest,
                'total_question_category' => $totalQuestionCategory,
                'total_question'          => $totalQuestion,
            ]);
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }
}
