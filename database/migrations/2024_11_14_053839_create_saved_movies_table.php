<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('saved_movies', function (Blueprint $table) {
            $table->id();
            $table->string('imdb_id');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('movie_list_id')->nullable()->constrained('movie_lists');
            $table->integer('rating')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'imdb_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('saved_movies');
    }
};
