<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SavedMovie>
 */
class SavedMovieFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'imdb_id' => "tt0848228",
            'movie_list_id' => function (array $attributes) {
                return MovieListFactory::new()->user(['id' => $attributes['user_id']])->create()->id;
            },
            'user_id' => fake()->randomElement([1, 2]),
        ];
    }
}
