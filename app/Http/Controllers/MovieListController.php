<?php

namespace App\Http\Controllers;

use App\Models\MovieList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MovieListController extends Controller
{
    public static $standardListNames = ['Watched', 'Favorite', 'Planned', 'Watching',];

    public function index()
    {
        $lists = Auth::user()->movieLists()
            ->orderBy('name')
            ->get();

        return response()->json([
            'lists' => $lists
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255']
        ]);

        try {
            $list = MovieList::create([
                'name' => $validated['name'],
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'message' => 'List created successfully',
                'list' => $list
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create list',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, MovieList $movieList)
    {
        if ($this->isStandardList($movieList)) {
            return response()->json([
                'message' => 'Cannot modify standard lists'
            ], 403);
        }

        if ($movieList->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255']
        ]);

        try {
            $movieList->update($validated);

            return response()->json([
                'message' => 'List updated successfully',
                'list' => $movieList
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update list',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(MovieList $movieList)
    {
        if ($this->isStandardList($movieList)) {
            return response()->json([
                'message' => 'Cannot delete standard lists'
            ], 403);
        }

        if ($movieList->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            $movieList->delete();
            return response()->json(['message' => 'List deleted successfully']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete list',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function isStandardList(MovieList $movieList): bool
    {
        return in_array($movieList->name, $this->standardListNames);
    }
    public function getUserLists()
    {
        $lists = MovieList::where('user_id', Auth::id())
            ->select('id', 'name')
            ->get();

        return response()->json($lists);
    }
}