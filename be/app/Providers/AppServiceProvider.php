<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $classes = [
            'Blogs',
            'BlogLikes',
            'Medias',
            'Categories',
            'User'
        ];

        foreach ($classes as $class) {
            $this->app->bind(
                "App\Repositories\\{$class}\\{$class}Interface",
                "App\Repositories\\{$class}\\{$class}Repository"
            );
        }
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
