<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\TokenValidator;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
        apiPrefix: 'api/v1',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);
        $middleware->alias([
            'tokenCheck' => TokenValidator::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (NotFoundHttpException $exception, Request $request) {
            return messageResponse("Route not found.", 404, 'error');
        });

        $exceptions->render(function (AuthenticationException $exception, Request $request) {
            return messageResponse("Unauthenticated.", 401, 'error');
        });

        $exceptions->render(function (ThrottleRequestsException $exception, Request $request) {
            return messageResponse("Too many attempts, please slow down the request..", 500, 'server_error');
        });
    })->create();
