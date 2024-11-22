<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserList extends Model
{
    protected $table = "user_lists";
    protected $fillable = ["name"];
    public function savedMovies(): HasMany
    {
        return $this->hasMany(SavedMovie::class, 'user_list_id');
    }
}
