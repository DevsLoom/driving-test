<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Requests\Auth\ResetRequest;
use App\Http\Requests\Auth\ResetVerifyRequest;
use App\Mail\Auth\ForgetRequestMail;
use App\Models\OtpCode;
use App\Models\User;
use App\Services\MailService;
use Exception;

class ForgetController extends Controller
{
    public function forgetRequest(ResetRequest $request)
    {
        try {
            $condition = [];
            $fetchBy   = str_contains($request->input('user'), '@') ? 'email' : 'phone';

            if ($fetchBy === 'email') {
                $condition['email'] = $request->input('user');
                $user               = User::query()->where($condition)->first();
            } else {
                $condition['phone'] = $request->input('user');
                $user               = User::query()->where($condition)->where($condition)->first();
            }

            if (!$user) {
                return validateError(['user' => ['Sorry, User not found...']], true);
            }

            if ($user->status !== 'active') {
                return messageResponse("Sorry, Currently, You can't access the system", 403);
            }

            $code = mt_rand(100000, 999999);

            OtpCode::query()->where(['model' => 'reset', 'model_id' => $user->id])->delete();
            OtpCode::query()->create([
                'model' => 'reset', 'model_id' => $user->id, 'code' => $code, 'valid_till' => now()->addMinutes(5),
            ]);

            // $mailService = new MailService(new ForgetRequestMail($user, $code));
            // $mailService->send();

            return entityResponse(['verify_required' => true, 'code' => $code, 'user' => $request->input('user')], 201, 'success', 'Forget password request successful');
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    public function forgetVerify(ResetVerifyRequest $request)
    {
        try {
            $condition = [];
            $fetchBy   = str_contains($request->input('user'), '@') ? 'email' : 'phone';

            if ($fetchBy === 'email') {
                $condition['email'] = $request->input('user');
                $user               = User::query()->where($condition)->first();
            } else {
                $condition['phone'] = $request->input('user');
                $user               = User::query()->where($condition)->where($condition)->first();
            }

            if (!$user) {
                return validateError(['user' => ['Sorry, User not found...']], true);
            }

            if ($user->status !== 'active') {
                return messageResponse("Sorry, Currently, You can't access the system", 403);
            }

            if (!$otp = OtpCode::query()
                ->where(['model' => 'reset', 'model_id' => $user->id, 'code' => $request->input('code'), 'status' => 'pending'])
                ->where('valid_till', '>', now())
                ->first()) {
                return messageResponse('Otp is invalid', 400);
            };
            $otp->update(['status' => 'verify']);

            return entityResponse(['password_required' => true, 'user' => $request->input('user')], 201, 'success', 'Forget password otp verify successful');
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    public function forgetPassword(ResetPasswordRequest $request)
    {
        try {
            $condition = [];
            $fetchBy   = str_contains($request->input('user'), '@') ? 'email' : 'phone';

            if ($fetchBy === 'email') {
                $condition['email'] = $request->input('user');
                $user               = User::query()->where($condition)->first();
            } else {
                $condition['phone'] = $request->input('user');
                $user               = User::query()->where($condition)->where($condition)->first();
            }

            if (!$user) {
                return validateError(['user' => ['Sorry, User not found...']], true);
            }

            if ($user->status !== 'active') {
                return messageResponse("Sorry, Currently, You can't access the system", 403);
            }

            if (!$otp = OtpCode::query()
                ->where(['model' => 'reset', 'model_id' => $user->id, 'status' => 'verify'])
                ->where('valid_till', '<>', now())
                ->first()) {
                return messageResponse('Sorry, You are not validate the otp...', 400);
            };

            $user->update(['password' => $request->input('password')]);
            $otp->delete();

            return messageResponse('Password changed successfully', 201, 'success');
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }
}
