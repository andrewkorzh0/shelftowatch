<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TitleController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\MovieListController;
use App\Http\Controllers\SavedMovieController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'show']);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Movie routes 

    Route::get('/user/movie-lists', [MovieListController::class, 'getUserLists'])
        ->name('movie-lists.user');

    Route::post('/saved-movies', [SavedMovieController::class, 'store'])
        ->name('saved-movies.store');

    Route::delete('/saved-movies/by-imdb/{imdbId}', [SavedMovieController::class, 'destroyByImdbId'])
        ->name('saved-movies.destroy-by-imdb');

    Route::get('/saved-movies/check/{imdbId}', [SavedMovieController::class, 'checkMovie'])
        ->name('saved-movies.check');

    Route::get('/movies', [SavedMovieController::class, 'index'])->name('movies.index');

    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Public routes
Route::get('/title/{id}', [TitleController::class, 'showTitle'])->name('title.id');
Route::get('/search/{query}/{page?}', [SearchController::class, 'showSearch'])
    ->where('page', '[0-9]+')
    ->name('search');

require __DIR__ . '/auth.php';