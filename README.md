# Shelf To Watch

![Search any movie](media/searchanymovie.gif)

Shelf To Watch is a simple web app for discovering and organizing movies. Keep track of what you've watched and plan your next movie night with ease.

## Features

-   User authentication and authorization
-   Search for movies by title, genre, or year
-   Save movies to your own movie lists
-   View your saved movies and their details

## Installation

1. Clone the repository
2. Run `composer install`
3. Run `npm install`
4. Create a `.env` file and add `OMDB_API_KEY=your_api_key_here` to it, replacing `your_api_key_here` with your actual OMDB API key.
5. Run `php artisan key:generate`
6. Run `php artisan migrate`
7. Run `php artisan serve`
8. Run `npm run dev`
9. Open the app in your browser at `http://localhost:8000`

## Technologies Used

- Laravel
- PHP
- React
- TypeScript
- Tailwind CSS
- Jest
- Pest
- SQLite

## Endpoints

-   For the request body descriptions, refer to the [code base](app/Http/Controllers/).

### GET /search/{query}/{page?}

-   Search for movies by title, genre, or year.
-   The `{query}` parameter should be the search query.
-   The `{page}` parameter is optional and defaults to 1, it should be the page number of the search results to return.

### GET /title/{id}

-   Get a movie by its id.
-   The `{id}` parameter should be the id of the movie.

### GET /movie-lists

-   Get all movie lists of the authenticated user.

### GET /movie-lists/{id}

-   Get a movie list by its id.
-   The `{id}` parameter should be the id of the movie list.

### POST /saved-movies

-   Save a movie to the authenticated user's movie lists.
-   The request body should contain the movie id and the list of movie lists to add the movie to.

### DELETE /saved-movies/{id}

-   Delete a movie from the authenticated user's movie lists.
-   The `{id}` parameter should be the id of the movie.
