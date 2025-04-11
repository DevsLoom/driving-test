<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Leafwrap\RoleSanctions\Facades\RoleSanction;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        if( auth()->guard('api')->check() && auth()->guard('api')->user()->role){
            RoleSanction::demonstrate(auth()->guard('api')->user()->role);
        }
    }
}
