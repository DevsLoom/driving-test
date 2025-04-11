<?php

namespace App\Http\Middleware;

use App\Models\TokenBlacklist;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TokenValidator
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = explode(' ', $request->header('authorization'))[1];
        if (TokenBlacklist::query()->where(['token' => $token])->exists()) {
            // return messageResponse('Sorry, Token is invalid');
            return messageResponse("Unauthenticated.", 401, 'error');
        }

        return $next($request);
    }
}
