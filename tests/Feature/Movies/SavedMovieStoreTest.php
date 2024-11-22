<?php

use App\Models\MovieList;
use App\Models\User;
test('can store a new saved movie', function () {
  $user = User::factory()->create();
  $movieList = MovieList::factory()->create(['user_id' => $user->id]);
  $imdbId = 'tt1234567';

  $response = $this->actingAs($user)
    ->postJson('/saved-movies', [
      'imdb_id' => $imdbId,
      'movie_list_id' => $movieList->id,
    ]);

  $response->assertStatus(201);
  $this->assertDatabaseHas('saved_movies', [
    'user_id' => $user->id,
    'imdb_id' => $imdbId,
    'movie_list_id' => $movieList->id,
  ]);
});

test('cannot store a new saved movie without authentication', function () {
  $movieList = MovieList::factory()->create();
  $imdbId = 'tt1234567';

  $response = $this->postJson('/saved-movies', [
    'imdb_id' => $imdbId,
    'movie_list_id' => $movieList->id,
  ]);

  $response->assertStatus(401);
});

test('cannot store a new saved movie with invalid data', function () {
  $user = User::factory()->create();
  $movieList = MovieList::factory()->create(['user_id' => $user->id]);

  $response = $this->actingAs($user)
    ->postJson('/saved-movies', [
      'imdb_id' => '', // Invalid imdb_id (empty string)
      'movie_list_id' => $movieList->id,
    ]);

  $response->assertStatus(422); // Unprocessable Entity
});