<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to your application's "home" route.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string
     */
    public const HOME = '/home';

    protected $namespace = 'App\\Http\\Controllers';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */
    public function boot(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(200)->by($request->user()?->id ?: $request->ip());
        });

        $this->routes(function () {
            Route::middleware('api')
                ->prefix('api')
                ->namespace($this->namespace.'\\Api')
                ->group(base_path('routes/api.php'));

            Route::prefix('system')
                ->middleware('web')
                ->namespace($this->namespace.'\\System')
                ->group(base_path('routes/system.php'));

            Route::prefix('canal')
                ->middleware('web')
                ->namespace($this->namespace.'\\Agent')
                ->group(base_path('routes/agent.php'));

            Route::prefix('admin')
                ->middleware('api')
                ->namespace($this->namespace.'\\Admin')
                ->group(base_path('routes/admin.php'));

            Route::middleware('web')
                ->namespace($this->namespace.'\\Web')
                ->group(base_path('routes/web.php'));
        });
    }
}
