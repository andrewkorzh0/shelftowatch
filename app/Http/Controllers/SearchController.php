<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function showSearch($query, $page = 1)
    {
        $omdbApiController = new OmdbApiController();

        $response = $omdbApiController->searchByName($query, $page);
        $searchResults = $response->getData();


        // If searchResults is an object, convert it to an array
        if (is_object($searchResults)) {
            $searchResults = json_decode(json_encode($searchResults), true);
        }

        if (isset($searchResults['Search'])) {
            return Inertia::render("Search", [
                'searchResults' => $searchResults,
                'query' => $query,
                'currentPage' => $page,
                'totalResults' => $searchResults['TotalResults'] ?? count($searchResults['Search'])
            ]);
        }

        return Inertia::render("Search", [
            'searchResults' => [],
            'query' => $query,
            'currentPage' => $page,
            'error' => $searchResults['Error'] ?? 'No results found'
        ]);
    }
}
