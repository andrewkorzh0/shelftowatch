<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MovieList extends Model
{

    use HasFactory;

    protected $fillable = ['name', 'user_id'];

    public function savedMovies()
    {
        return $this->hasMany(SavedMovie::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}