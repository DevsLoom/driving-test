<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\QuestionRequest;
use App\Models\Option;
use App\Models\Question;
use App\Models\QuestionCorrectOption;
use App\Models\QuestionExplanation;
use App\Models\QuestionOptionMap;
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

            $fields    = [primaryKey(), 'test_id', 'title'];
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
            $lastEntry = Question::where(['test_id' => request()->input('test_id')])->latest()->first();
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

            $fields    = [primaryKey(), 'test_id', 'title', 'tags', 'position', 'status'];
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

            $existingCorrectOptions = QuestionCorrectOption::query()->where('question_id', $id)->pluck('option_id')->toArray();
            $newCorrectOptions      = [];

            foreach (request()->input('options') as $item) {
                $oQuery = Option::query()->where([primaryKey() => $item['id']])->first();
                $oQuery->update(['title' => $item['title']]);

                if (!empty($item['is_correct'])) {
                    $newCorrectOptions[] = $item['id'];
                    if (!in_array($item['id'], $existingCorrectOptions)) {
                        QuestionCorrectOption::create([
                            'question_id' => $query->id,
                            'option_id'   => $item['id'],
                        ]);
                    }
                }
            }

            $optionsToRemove = array_diff($existingCorrectOptions, $newCorrectOptions);
            if (!empty($optionsToRemove)) {
                QuestionCorrectOption::query()->where('question_id', $id)->whereIn('option_id', $optionsToRemove)->delete();
            }

            foreach (request()->input('explanations') as $item) {
                if (isset($item['id'])) {
                    $eQuery = QuestionExplanation::query()->where([primaryKey() => $item['id']])->first();
                    $eQuery->update([
                        'language'    => $item['language'],
                        'explanation' => $item['explanation'],
                    ]);
                } else {
                    QuestionExplanation::create([
                        'question_id' => $query->id,
                        'language'    => $item['language'],
                        'explanation' => $item['explanation'],
                    ]);
                }
            }

            $query->update($request->validated());
            return entityResponse($query, 201, 'success', 'Question updated successfully.');
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
