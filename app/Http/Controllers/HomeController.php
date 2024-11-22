<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function show()
    {
        // Hardcoded default list of recommended movies
        $recommendationList = ["tt0111161", "tt0068646", "tt0468569", "tt0110912", "tt1853728", "tt0120689", "tt0245429", "tt6751668"];
        $recommendationListTitle = "Popular";

        if (Auth::check()) {
            $recentMovies = (new \App\Http\Controllers\SavedMovieController())->showRecentSavedMovies()->getData();
            if ($recentMovies) {
                $recommendationList = array_column($recentMovies, 'imdb_id');
                $recommendationListTitle = "Recently Saved";
            }
        }

        // Use OmdbApiController to fetch movie details
        $omdbApiController = new OmdbApiController();
        $movies = [];

        foreach ($recommendationList as $movieId) {
            $response = $omdbApiController->searchById($movieId);
            $movieData = $response->getData();

            if (is_object($movieData)) {
                $movieData = json_decode(json_encode($movieData), true);
            }

            // Check if movie data is valid
            if (isset($movieData['Response']) && $movieData['Response'] == "True") {
                $movies[] = $movieData;
            }
        }

        return Inertia::render("Home", [
            'collectionTitle' => $recommendationListTitle,
            'movieCollection' => $movies,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    }


}
