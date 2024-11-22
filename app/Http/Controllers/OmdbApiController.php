<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class OmdbApiController extends Controller
{
    private $omdb_api_key;
    public function __construct()
    {
        $this->omdb_api_key = env("OMDB_API_KEY");
    }

    public function searchById($id)
    {
        $url = "http://www.omdbapi.com/?i=$id&apikey=$this->omdb_api_key";

        try {
            $response = file_get_contents($url);
            $decodedResponse = json_decode($response, true);
            if ($decodedResponse['Response'] == "True") {
                return response()->json($decodedResponse);
            }

            return response()->json([
                "Error" => $decodedResponse['Error'] ?? 'Unknown error',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                "Error" => "API request failed: " . $e->getMessage(),
            ], 500);
        }
    }

    public function searchByName($title, $page = 1)
    {
        try {
            if (empty($title)) {
                return response()->json([
                    "Error" => "Search title cannot be empty",
                ], 400);
            }

            $page = max(1, (int) $page);

            $response = Http::get("http://www.omdbapi.com/", [
                's' => $title,
                'page' => $page,
                'apikey' => $this->omdb_api_key
            ]);

            if (!$response->successful()) {
                return response()->json([
                    "Error" => "API request failed",
                ], $response->status());
            }

            $decodedResponse = $response->json();

            if ($decodedResponse['Response'] == "True" && isset($decodedResponse['Search'])) {
                return response()->json([
                    "Search" => $decodedResponse['Search'],
                    "TotalResults" => $decodedResponse['totalResults'] ?? count($decodedResponse['Search']),
                    "Response" => $decodedResponse['Response'],
                    "Page" => $page
                ]);
            }

            return response()->json([
                "Error" => $decodedResponse['Error'] ?? 'No results found',
                "Page" => $page
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                "Error" => "An unexpected error occurred: " . $e->getMessage(),
                "Page" => $page
            ], 500);
        }
    }
}