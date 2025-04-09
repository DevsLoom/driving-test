<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\FindUserRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\Register\NewUserRequest;
use App\Http\Requests\Auth\Register\RegisterVerifyRequest;
use App\Models\OtpCode;
use App\Models\Profile;
use App\Models\User;
use Exception;

class RegisterController extends Controller
{
    public function register(RegisterRequest $request)
    {
        try {
            $payload   = $request->validated();
            $condition = [];
            $fetchBy   = str_contains($request->input('user'), '@') ? 'email' : 'phone';

            if ($fetchBy === 'email') {
                $condition['email'] = $request->input('user');
                $payload['email']   = $request->input('user');
                $user               = User::query()->where($condition)->first();
            } else {
                $condition['phone'] = $request->input('user');
                $payload['phone']   = $request->input('user');
                $user               = User::query()->where($condition)->where($condition)->first();
            }

            if ($user) {
                return validateError(['user' => ["You're already registered"]], true);
            }

            if (!$otp = OtpCode::query()
                ->where(['model' => 'register', 'model_id' => $request->input('user'), 'status' => 'verify'])
                ->where('valid_till', '<>', now())
                ->first()) {
                return messageResponse('Sorry, You are not validate the otp...', 400);
            };
            $otp->delete();

            if ($user = User::query()->create(array_merge(['type' => 'consumer'], $payload))) {
                Profile::create(['user_id' => $user['id']]);
                return messageResponse('User registration successful', 201, 'success');
            }
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    public function registerRequest(NewUserRequest $request)
    {
        try {
            $code      = mt_rand(100000, 999999);
            $condition = [];
            $fetchBy   = str_contains($request->input('user'), '@') ? 'email' : 'phone';

            if ($fetchBy === 'email') {
                $condition['email'] = $request->input('user');
                $user               = User::query()->where($condition)->first();
            } else {
                $condition['phone'] = $request->input('user');
                $user               = User::query()->where($condition)->where($condition)->first();
            }

            if ($user) {
                return validateError(['user' => ["You're already registered"]], true);
            }

            OtpCode::query()->where(['model' => 'register', 'model_id' => $request->input('user')])->delete();
            OtpCode::query()->create([
                'model' => 'register', 'model_id' => $request->input('user'), 'code' => $code, 'valid_till' => now()->addMinutes(5),
            ]);

            // if ($fetchBy === 'email') {
            //     $mailService = new MailService(new RegisterRequestMail($request->input('user'), $code));
            //     $mailService->send();
            // }

            return entityResponse(['verify_required' => true, 'code' => $code, 'user' => $request->input('user')], 201, 'success', 'Register request successful');
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    public function registerVerify(RegisterVerifyRequest $request)
    {
        try {
            if (!$otp = OtpCode::query()
                ->where(['model' => 'register', 'model_id' => request()->input('user'), 'code' => request()->input('code'), 'status' => 'pending'])
                ->where('valid_till', '>', now())
                ->first()) {
                return messageResponse('Otp is invalid', 400);
            };
            $otp->update(['status' => 'verify']);

            return entityResponse(['register_required' => true, 'user' => $request->input('user')], 201, 'success', 'Register otp verify successful');
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    public function findUser(FindUserRequest $request)
    {
        try {
            $searchBy = str_contains($request->input('user'), '@') ? 'email' : 'phone';
            if ($searchBy === 'email') {
                $condition['email'] = $request->input('user');
                $user               = User::query()->where($condition)->first();
            } else {
                $condition['phone'] = $request->input('user');
                $user               = User::query()->where($condition)->where($condition)->first();
            }

            if (!$user) {
                return validateError(['user' => ['Sorry, User not found...']], true);
            }
            $userField = [primaryKey(), 'type', 'first_name', 'last_name', 'email', 'phone', 'avatar', 'status'];
            return entityResponse(collect($user)->only($userField)->toArray());
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }
}
