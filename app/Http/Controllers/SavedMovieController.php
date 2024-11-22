<?php

namespace App\Http\Controllers;

use App\Models\SavedMovie;
use App\Models\MovieList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SavedMovieController extends Controller
{

    public function index(Request $request)
    {
        $query = Auth::user()->savedMovies()
            ->with(['movieList']);

        if ($request->has('list_id')) {
            $query->where('movie_list_id', $request->input('list_id'));
        }

        if ($request->has('rating')) {
            $query->where('rating', $request->input('rating'));
        }

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('imdb_id', 'LIKE', "%{$search}%");
        }

        $sortField = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $movies = $query->get();

        // Create an instance of OmdbApiController
        $omdbApiController = new OmdbApiController();

        // Fetch OMDB data for each movie
        $moviesWithDetails = $movies->map(function ($movie) use ($omdbApiController) {
            try {
                $response = $omdbApiController->searchById($movie->imdb_id);

                if ($response->getStatusCode() == 200) {
                    $omdbData = $response->getData(true);

                    return [
                        'savedMovie' => $movie,
                        'omdbData' => $omdbData,
                        'fetchError' => false
                    ];
                } else {
                    $errorData = $response->getData(true);
                    return [
                        'savedMovie' => $movie,
                        'omdbData' => null,
                        'fetchError' => true,
                        'errorMessage' => $errorData['Error'] ?? 'Failed to fetch movie details'
                    ];
                }
            } catch (\Exception $e) {
                return [
                    'savedMovie' => $movie,
                    'omdbData' => null,
                    'fetchError' => true,
                    'errorMessage' => 'API request failed: ' . $e->getMessage()
                ];
            }
        });

        return Inertia::render('Movies/Index', [
            'movies' => $moviesWithDetails,
            'filters' => $request->all(['list_id', 'rating', 'search', 'sort_by', 'sort_direction']),
            'movieLists' => MovieList::all(),
        ]);
    }

    public function store(Request $request)
    {
        \Log::info('Received request data:', $request->all());

        $validated = $request->validate([
            'imdb_id' => ['required', 'string'],
            'movie_list_id' => ['required', 'exists:movie_lists,id'],
            'rating' => ['nullable', 'integer', 'min:1', 'max:10'],
        ]);

        \Log::info('Validated data:', $validated);

        try {
            $existingMovie = SavedMovie::where('user_id', Auth::id())
                ->where('imdb_id', $validated['imdb_id'])
                ->first();

            if ($existingMovie) {
                \Log::info('Updating existing movie:', ['movie_id' => $existingMovie->id]);
                $existingMovie->movie_list_id = $validated['movie_list_id'];
                $existingMovie->save();

                return back()->with('success', 'Movie moved to new shelf');
            }

            \Log::info('Creating new movie entry');
            $movie = SavedMovie::create([
                'user_id' => Auth::id(),
                'imdb_id' => $validated['imdb_id'],
                'rating' => $validated['rating'] ?? null,
                'movie_list_id' => $validated['movie_list_id']
            ]);

            return response()->json(['message' => 'Movie added to shelf'], 201);
            //maybe use redirect?
            //return back()->with('success', 'Movie added to shelf');


        } catch (\Exception $e) {
            \Log::error('Error saving movie:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors(['error' => 'Failed to save movie']);
        }
    }

    public function update(Request $request, SavedMovie $savedMovie)
    {
        $validated = $request->validate([
            'movie_list_id' => ['sometimes', 'exists:movie_lists,id'],
            'rating' => ['sometimes', 'nullable', 'integer', 'min:1', 'max:10'],
        ]);

        try {
            $savedMovie->fill($validated);
            $savedMovie->save();

            return response()->json([
                'message' => 'Movie updated successfully',
                'movie' => $savedMovie->load('movieList')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update movie',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(SavedMovie $savedMovie)
    {
        try {
            $savedMovie->delete();
            return response()->json(['message' => 'Movie removed successfully']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to remove movie',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function checkMovie(Request $request, $imdbId)
    {
        $savedMovie = SavedMovie::where('user_id', Auth::id())
            ->where('imdb_id', $imdbId)
            ->with('movieList')
            ->first();

        return response()->json([
            'isSaved' => $savedMovie !== null,
            'savedMovie' => $savedMovie
        ]);
    }

    public function destroyByImdbId(string $imdbId)
    {
        try {
            $savedMovie = SavedMovie::where('imdb_id', $imdbId)
                ->where('user_id', auth()->id())
                ->firstOrFail();

            $savedMovie->delete();
            return response()->json(['message' => 'Movie removed successfully']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to remove movie',
                'error' => $e->getMessage()
            ], status: 500);
        }
    }

    public function showRecentSavedMovies()
    {
        $savedMovies = SavedMovie::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();
        return response()->json($savedMovies);
    }
}

