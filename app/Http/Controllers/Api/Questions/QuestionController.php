<?php

namespace App\Http\Controllers\Api\Questions;

use App\Http\Controllers\Controller;
use App\Http\Requests\Questions\QuestionRequest;
use App\Models\Questions\Option;
use App\Models\Questions\Question;
use App\Models\Questions\QuestionCorrectOption;
use App\Models\Questions\QuestionExplanation;
use App\Models\Questions\QuestionOptionMap;
use Exception;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $limit          = request()->input('limit') ?? 10;
            $offset         = request()->input('offset') ?? 0;
            $orderBy        = request()->input('order_by') ?? 'position';
            $orderDirection = request()->input('order_direction') ?? 'desc';

            $fields    = [primaryKey(), 'question_category_id', 'title'];
            $condition = [];
            $relations = [
                'options:id,title',
                'questionCorrectOption',
                'explanations:id,question_id,language,explanation',
            ];
            $counts  = [];
            $queries = Question::query();

            if (request()->has('status') && request()->input('status')) {
                $condition['status'] = request()->input('status');
            }

            if (request()->has('test_id') && request()->input('test_id')) {
                $condition['test_id'] = request()->input('test_id');
            }

            if (request()->has('fields') && request()->input('fields')) {
                $fields = gettype(request()->input('fields')) === 'array' ? request()->input('fields') : explode(',', request()->input('fields'));
            }

            if (request()->has('relations') && request()->input('relations')) {
                $relations = gettype(request()->input('relations')) === 'array' ? request()->input('relations') : explode(',', request()->input('relations'));
            }

            if (request()->has('counts') && request()->input('counts')) {
                $counts = gettype(request()->input('counts')) === 'array' ? request()->input('counts') : explode(',', request()->input('counts'));
            }

            if (request()->has('search') && request()->input('search')) {
                $searchValue = trim(request()->input('search'));
                $queries     = $queries->where('title', 'like', '%' . $searchValue . '%')
                    ->orWhereJsonContains('tags', $searchValue);
            }

            $queries->select($fields)->with($relations)->withCount($counts)->where(fn($q) => $q->where($condition))->orderBy($orderBy, $orderDirection);
            if (request()->has('limit') && request()->has('offset')) {
                $queries = $queries->skip($offset)->take($limit)->get();
            } else {
                $queries = $queries->get();
            }

            $queries = $queries->map(fn($q) => array_merge($q->only($fields), [
                'options'               => $q->options,
                'questionCorrectOption' => $q->questionCorrectOption ? $q->questionCorrectOption->option_id : null,
                'explanations'          => $q->explanations,
            ]));
            return entityResponse($queries);
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(QuestionRequest $request)
    {
        try {
            $lastEntry = Question::latest()->first();
            $position  = $lastEntry ? $lastEntry->position + 1 : 1;

            if ($query = Question::query()->create(array_merge($request->validated(), ['position' => $position]))) {
                if (request()->has('options') && request()->input('options')) {
                    foreach (request()->input('options') as $item) {
                        $option = Option::create(['title' => $item['title']]);
                        QuestionOptionMap::create([
                            'question_id' => $query->id,
                            'option_id'   => $option->id,
                        ]);
                        if ($item['is_correct']) {
                            QuestionCorrectOption::create([
                                'question_id' => $query->id,
                                'option_id'   => $option->id,
                            ]);
                        }
                    }
                }
                if (request()->has('explanations') && request()->input('explanations')) {
                    foreach (request()->input('explanations') as $item) {
                        QuestionExplanation::create([
                            'question_id' => $query->id,
                            'language'    => $item['language'],
                            'explanation' => $item['explanation'],
                        ]);
                    }
                }
                return entityResponse($query, 201, 'success', 'Question added successfully.');
            }
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $searchKey = request()->input('searchKey') ?? primaryKey();
            $condition = [$searchKey => $id];

            $fields    = [primaryKey(), 'question_category_id', 'title', 'image', 'video_url', 'tags', 'position', 'status'];
            $relations = [
                'options:id,title',
                'questionCorrectOption:id,question_id,option_id',
                'explanations:id,question_id,language,explanation',
            ];
            $counts = [];

            if (request()->has('fields') && request()->input('fields')) {
                $fields = gettype(request()->input('fields')) === 'array' ? request()->input('fields') : explode(',', request()->input('fields'));
            }

            if (request()->has('relations') && request()->input('relations')) {
                $relations = gettype(request()->input('relations')) === 'array' ? request()->input('relations') : explode(',', request()->input('relations'));
            }

            if (request()->has('counts') && request()->input('counts')) {
                $counts = gettype(request()->input('counts')) === 'array' ? request()->input('counts') : explode(',', request()->input('counts'));
            }

            if (!$query = Question::query()->select($fields)->with($relations)->withCount($counts)->where($condition)->first()) {
                return messageResponse('Question not found...', 404, 'error');
            }
            return entityResponse($query);
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');

        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(QuestionRequest $request, string $id)
    {
        try {
            $searchKey = request()->input('searchKey') ?? primaryKey();
            $condition = [$searchKey => $id];

            if (!$query = Question::query()->where($condition)->first()) {
                return messageResponse('Question not found...', 404, 'error');
            }

            $query->update($request->validated());

            if (request()->has('options')) {
                $submittedOptions   = request()->input('options');
                $submittedOptionIds = collect($submittedOptions)->pluck('id')->filter()->toArray();
                $existingOptionIds  = $query->options()->pluck('options.id')->toArray();

                $optionsToDelete = array_diff($existingOptionIds, $submittedOptionIds);

                Option::whereIn('id', $optionsToDelete)->delete();
                QuestionOptionMap::whereIn('option_id', $optionsToDelete)->where('question_id', $query->id)->delete();
                QuestionCorrectOption::whereIn('option_id', $optionsToDelete)->where('question_id', $query->id)->delete();
                QuestionCorrectOption::where('question_id', $query->id)->delete();

                foreach ($submittedOptions as $item) {
                    if (isset($item['id'])) {
                        $option = Option::find($item['id']);
                        $option->update(['title' => $item['title']]);
                    } else {
                        $option = Option::create(['title' => $item['title']]);
                        QuestionOptionMap::create([
                            'question_id' => $query->id,
                            'option_id'   => $option->id,
                        ]);
                    }

                    if (!empty($item['is_correct'])) {
                        QuestionCorrectOption::create([
                            'question_id' => $query->id,
                            'option_id'   => $option->id,
                        ]);
                    }
                }
            }

            if (request()->has('explanations')) {
                $submittedExplanations = request()->input('explanations');
                $submittedLanguages    = collect($submittedExplanations)->pluck('language')->toArray();
                $existingLanguages     = $query->explanations()->pluck('language')->toArray();

                $languagesToDelete = array_diff($existingLanguages, $submittedLanguages);
                QuestionExplanation::where('question_id', $query->id)
                    ->whereIn('language', $languagesToDelete)
                    ->delete();

                foreach ($submittedExplanations as $item) {
                    $existing = QuestionExplanation::where([
                        'question_id' => $query->id,
                        'language'    => $item['language'],
                    ])->first();

                    if ($existing) {
                        $existing->update(['explanation' => $item['explanation']]);
                    } else {
                        QuestionExplanation::create([
                            'question_id' => $query->id,
                            'language'    => $item['language'],
                            'explanation' => $item['explanation'],
                        ]);
                    }
                }
            }

            return entityResponse($query, 200, 'success', 'Question updated successfully.');
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $searchKey = request()->input('searchKey') ?? primaryKey();
            $condition = [$searchKey => $id];

            if (!$query = Question::query()->where($condition)->first()) {
                return messageResponse('Question not found...', 404, 'error');
            }

            $query->delete();
            return messageResponse('Question deleted successfully');
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }
}
