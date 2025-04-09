<?php

namespace App\Http\Controllers\Api\Questions;

use App\Http\Controllers\Controller;
use App\Http\Requests\Questions\QuestionCategoryRequest;
use App\Models\Questions\QuestionCategory;
use Exception;

class QuestionCategoryController extends Controller
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

            $fields    = [primaryKey(), 'name', 'image'];
            $condition = [];
            $relations = [];
            $counts    = [];
            $queries   = QuestionCategory::query();

            if (request()->has('status') && request()->input('status')) {
                $condition['status'] = request()->input('status');
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
                $queries     = $queries->where('name', 'like', '%' . $searchValue . '%');
            }

            $queries->select($fields)->with($relations)->withCount($counts)->where(fn($q) => $q->where($condition))->orderBy($orderBy, $orderDirection);
            if (request()->has('limit') && request()->has('offset')) {
                $queries = $queries->skip($offset)->take($limit)->get();
            } else {
                $queries = $queries->get();
            }
            return entityResponse($queries);
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(QuestionCategoryRequest $request)
    {
        try {
            $lastEntry = QuestionCategory::latest()->first();
            $position  = $lastEntry ? $lastEntry->position + 1 : 1;

            if ($query = QuestionCategory::query()->create(array_merge($request->validated(), ['position' => $position]))) {
                return entityResponse($query, 201, 'success', 'Category added successfully.');
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

            $fields    = [primaryKey(), 'name', 'image', 'status'];
            $relations = [];
            $counts    = [];

            if (request()->has('fields') && request()->input('fields')) {
                $fields = gettype(request()->input('fields')) === 'array' ? request()->input('fields') : explode(',', request()->input('fields'));
            }

            if (request()->has('relations') && request()->input('relations')) {
                $relations = gettype(request()->input('relations')) === 'array' ? request()->input('relations') : explode(',', request()->input('relations'));
            }

            if (request()->has('counts') && request()->input('counts')) {
                $counts = gettype(request()->input('counts')) === 'array' ? request()->input('counts') : explode(',', request()->input('counts'));
            }

            if (!$query = QuestionCategory::query()->select($fields)->with($relations)->withCount($counts)->where($condition)->first()) {
                return messageResponse('Category not found...', 404, 'error');
            }
            return entityResponse($query);
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(QuestionCategoryRequest $request, string $id)
    {
        try {
            $searchKey = request()->input('searchKey') ?? primaryKey();
            $condition = [$searchKey => $id];

            if (!$query = QuestionCategory::query()->where($condition)->first()) {
                return messageResponse('Category not found...', 404, 'error');
            }

            $query->update($request->validated());
            return entityResponse($query, 201, 'success', 'Category updated successfully.');
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

            if (!$query = QuestionCategory::query()->where($condition)->first()) {
                return messageResponse('Category not found...', 404, 'error');
            }

            $query->delete();
            return messageResponse('Category deleted successfully');
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }
}
