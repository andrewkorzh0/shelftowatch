<?php

use App\Models\MovieList;
use App\Models\User;
use App\Models\SavedMovie;

beforeEach(function () {
  $this->actingAs(User::factory()->create());
});

test('can delete a saved movie', function () {
  $user = User::factory()->create();
  $movieList = MovieList::factory()->create(['user_id' => $user->id]);
  $savedMovie = SavedMovie::factory()->create([
    'user_id' => $user->id,
    'movie_list_id' => $movieList->id,
  ]);

  $response = $this->actingAs($user)
    ->deleteJson('/saved-movies/by-imdb/' . $savedMovie->imdb_id);

  $response->assertStatus(200);
  $this->assertDatabaseMissing('saved_movies', [
    'id' => $savedMovie->id,
  ]);
});

test('cannot delete a saved movie without being authenticated', function () {
  $user = User::factory()->create();
  $movieList = MovieList::factory()->create(['user_id' => $user->id]);
  $savedMovie = SavedMovie::factory()->create([
    'user_id' => $user->id,
    'movie_list_id' => $movieList->id,
  ]);

  $response = $this->deleteJson('/saved-movies/by-imdb/' . $savedMovie->imdb_id);

  $response->assertStatus(500);
});
