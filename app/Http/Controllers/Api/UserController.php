<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Models\User;
use Exception;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $limit          = request()->input('limit') ?? 10;
            $offset         = request()->input('offset') ?? 0;
            $orderBy        = request()->input('order_by') ?? 'created_at';
            $orderDirection = request()->input('order_direction') ?? 'desc';

            $fields    = [primaryKey(), 'role_id', 'first_name', 'last_name', 'email', 'phone', 'status'];
            $condition = [];
            $relations = [];
            $counts    = [];
            $queries   = User::query();

            if (request()->has('type') && request()->input('type')) {
                $condition['type'] = request()->input('type');
            }

            if (request()->has('role_id') && request()->input('role_id')) {
                $condition['role_id'] = request()->input('role_id');
            }

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
                $queries     = $queries->where('first_name', 'like', '%' . $searchValue . '%')
                    ->orWhere('last_name', 'like', '%' . $searchValue . '%')
                    ->orWhere('email', 'like', '%' . $searchValue . '%')
                    ->orWhere('phone', 'like', '%' . $searchValue . '%');
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
    public function store(UserRequest $request)
    {
        try {
            if ($query = User::query()->create($request->validated())) {
                return entityResponse($query, 201, 'success', 'User added successfully.');
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

            $fields    = [primaryKey(), 'role_id', 'type', 'first_name', 'last_name', 'email', 'phone', 'avatar', 'status'];
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

            if (!$query = User::query()->select($fields)->with($relations)->withCount($counts)->where($condition)->first()) {
                return messageResponse('User not found...', 404, 'error');
            }
            return entityResponse($query);
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');

        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, string $id)
    {
        try {
            $searchKey = request()->input('searchKey') ?? primaryKey();
            $condition = [$searchKey => $id];

            if (!$query = User::query()->where($condition)->first()) {
                return messageResponse('User not found...', 404, 'error');
            }
            $query->update($request->validated());
            return entityResponse($query, 201, 'success', 'User updated successfully.');
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

            if (!$query = User::query()->where($condition)->first()) {
                return messageResponse('User not found...', 404, 'error');
            }
            $query->delete();
            return messageResponse('User deleted successfully');
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }
}
