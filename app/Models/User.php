<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Http\Controllers\MovieListController;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'verified_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function savedMovies(): HasMany
    {
        return $this->hasMany(SavedMovie::class);
    }

    public function getMoviesByList($listType, $listId)
    {
        return $this->savedMovies()
            ->when($listType === 'predefined', function ($query) use ($listId) {
                return $query->where('predefined_list_id', $listId);
            })
            ->when($listType === 'custom', function ($query) use ($listId) {
                return $query->where('custom_list_id', $listId);
            })
            ->orderBy('created_at', 'desc');
    }
    protected static function booted()
    {
        static::created(function ($user) {
            $standardLists = MovieListController::$standardListNames;

            collect($standardLists)->each(function ($listName) use ($user) {
                MovieList::create([
                    'name' => $listName,
                    'user_id' => $user->id,
                ]);
            });
        });
    }

    public function movieLists()
    {
        return $this->hasMany(MovieList::class);
    }

}
