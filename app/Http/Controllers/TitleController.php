<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\OmdbApiController;

class TitleController extends Controller
{
    private $omdbApiController;

    public function __construct(OmdbApiController $omdbApiController)
    {
        $this->omdbApiController = $omdbApiController;
    }

    public function showTitle($id)
    {
        $response = $this->omdbApiController->searchById($id);

        if ($response->getStatusCode() == 200) {
            $movie = $response->getData(true);
            return Inertia::render("Title", ['movie' => $movie]);
        }

        return Inertia::render("Title", ['error' => $response->getData(true)]);
    }
}