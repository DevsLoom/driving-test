<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\TokenBlacklist;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function login(LoginRequest $request)
    {
        try {
            $condition = [];
            $loginBy   = str_contains($request->input('user'), '@') ? 'email' : 'phone';

            if ($loginBy === 'email') {
                $condition['email'] = $request->input('user');
                $user               = User::query()->where($condition)->first();
            } else {
                $condition['phone'] = $request->input('user');
                $user               = User::query()->where($condition)->where($condition)->first();
            }

            if (!$user) {
                return validateError(['user' => ['Sorry, User not found...']], true);
            }

            if (!Hash::check($request->input('password'), $user->password)) {
                return validateError(['password' => ['The password does not match...']], true);
            }

            if ($user->status !== 'active') {
                return messageResponse("Sorry, Currently, You can't access the system", 403);
            }

            $userField = [primaryKey(), 'type', 'first_name', 'last_name', 'email', 'phone', 'avatar', 'status', 'role', 'profile'];

            return entityResponse([
                // 'user'  => collect($user->load(['role:id,name', 'profile']))->only($userField)->toArray(),
                // 'token' => $this->issueToken($user->load(['role:id,name']), $request),
                'token' => $this->issueToken($user, $request),
            ], 200, 'success', 'Welcome back! You are successfully logged in.');
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    public function logout()
    {
        try {
            $token = explode(' ', request()->header('authorization'))[1];
            if (!TokenBlacklist::query()->create(['token' => $token])) {
                return messageResponse('Sorry, Token is not valid...');
            }
            auth()->logout();
            return messageResponse('Successfully logged out', 200, 'success');
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    // public function update(UserUpdateRequest $request)
    // {
    //     try {
    //         if (!$user = User::query()->where([primaryKey() => auth()->id()])->first()) {
    //             return messageResponse('Sorry, User not found');
    //         }
    //         if (!$profile = Profile::query()->where(['user_id' => auth()->id()])->first()) {
    //             return messageResponse('Sorry, Profile not found');
    //         }

    //         if (request()->has('skills') && is_array(request()->input('skills')) && count(request()->input('skills'))) {
    //             $categoryId = SkillCategory::query()->firstOrCreate(['name' => 'Others'])->id;

    //             foreach (request()->input('skills') as $skill) {
    //                 $skillId = $skill['id'] ?? Skill::query()->create([
    //                     'skill_category_id' => $categoryId,
    //                     'name'              => $skill['name'],
    //                 ])->id;

    //                 UserSkillMap::query()->create([
    //                     'user_id'  => auth()->id(),
    //                     'skill_id' => $skillId,
    //                 ]);
    //             }
    //         }

    //         if (request()->has('hobbies') && is_array(request()->input('hobbies')) && count(request()->input('hobbies'))) {
    //             foreach (request()->input('hobbies') as $hItem) {
    //                 if (!$exist = Hobby::query()->where('name', $hItem)->exists()) {
    //                     Hobby::create(['name' => $hItem]);
    //                 }
    //             }
    //         }

    //         $user->update($request->only(['first_name', 'last_name', 'phone', 'email', 'avatar']));
    //         $profile->update($request->validated());

    //         return entityResponse([
    //             'user'    => collect($user->toArray())->except(['email_verified_at', 'created_by', 'updated_by', 'deleted_by', 'created_at', 'updated_at', 'deleted_at']),
    //             'profile' => collect($profile->toArray())->except(['created_by', 'updated_by', 'deleted_by', 'created_at', 'updated_at', 'deleted_at']),
    //             'token'   => $this->issueToken($user, $request),
    //         ], 200, 'success', 'User information updated successfully');
    //     } catch (Exception $e) {
    //         return messageResponse($e->getMessage(), 500, 'server_error');
    //     }
    // }

    public function me()
    {
        try {
            $user = User::query()->where([primaryKey() => auth()->id()])->with([
                'role:id,name',
                'skills:id,name',
                'profile:id,user_id,father_name,mother_name,gender,marital_status,blood_group,height,weight,nid_number,date_of_birth,nationality,present_address,permanent_address,signature,hobbies',
            ])->first();
            $userField = [primaryKey(), 'type', 'first_name', 'last_name', 'email', 'phone', 'avatar', 'status', 'skills', 'role', 'profile'];
            return entityResponse(collect($user)->only($userField)->toArray());
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    public function changePassword(ChangePasswordRequest $request)
    {
        try {
            if (!Hash::check($request->input('current_password'), auth()->user()->password)) {
                return validateError(['current_password' => ['Current password not matched...']], true);
            }

            User::query()->where([primaryKey() => auth()->id()])->update(['password' => Hash::make($request->input('password'))]);
            $this->logout();
            return entityResponse(['logout' => true], 200, 'success', 'Password change successfully');
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    public function issueToken($user, $request, $custom = [])
    {
        $userField = [primaryKey(), 'first_name', 'last_name', 'email', 'phone', 'avatar', 'type', 'status', 'role'];
        $payload   = array_merge($custom, ['remember_me' => $request->input('remember_me')], collect($user)->only($userField)->toArray());

        return auth()->claims($payload)->setTTL($payload['remember_me'] ? 60 * 60 : 30 * 60)->login($user);
    }
}
