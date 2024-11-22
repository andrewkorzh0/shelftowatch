import React from "react";

const MovieList = ({ movies }) => {
    const getRatingColor = (rating) => {
        if (!rating) return "text-gray-400";
        const numRating = parseFloat(rating);
        if (numRating >= 8.0) return "text-green-500";
        if (numRating >= 6.0) return "text-yellow-500";
        return "text-red-500";
    };

    const formatRuntime = (runtime) => {
        if (!runtime || runtime === "N/A") return "Duration N/A";
        return runtime;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {movies.length === 0 ? (
                <div className="text-center text-gray-500">No movies found</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {movies.map((movie) => (
                        <div
                            key={movie.savedMovie.id}
                            className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                        >
                            {movie.fetchError ? (
                                <div className="p-4 bg-red-50 text-red-700">
                                    <p className="font-semibold">
                                        Error loading movie details
                                    </p>
                                    <p className="text-sm">
                                        {movie.errorMessage}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="relative h-96">
                                        {movie.omdbData?.Poster &&
                                        movie.omdbData.Poster !== "N/A" ? (
                                            <img
                                                src={movie.omdbData.Poster}
                                                alt={movie.omdbData.Title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-400">
                                                    No Poster Available
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute top-0 right-0 m-2 px-2 py-1 bg-black bg-opacity-75 rounded text-white text-sm">
                                            {movie.omdbData?.Year || "N/A"}
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h2 className="text-xl font-bold truncate">
                                                {movie.omdbData?.Title ||
                                                    "Unknown Title"}
                                            </h2>
                                            <span
                                                className={`ml-2 font-bold ${getRatingColor(
                                                    movie.omdbData?.imdbRating
                                                )}`}
                                            >
                                                {movie.omdbData?.imdbRating ||
                                                    "N/A"}
                                            </span>
                                        </div>

                                        <div className="text-sm text-gray-600 mb-2">
                                            {formatRuntime(
                                                movie.omdbData?.Runtime
                                            )}
                                            <span className="mx-2">•</span>
                                            {movie.omdbData?.Genre ||
                                                "Genre N/A"}
                                        </div>

                                        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                                            {movie.omdbData?.Plot ||
                                                "Plot not available"}
                                        </p>

                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-blue-600">
                                                List:{" "}
                                                {
                                                    movie.savedMovie.movie_list
                                                        .name
                                                }
                                            </span>
                                            {movie.savedMovie.rating && (
                                                <span className="text-yellow-500">
                                                    Your Rating:{" "}
                                                    {movie.savedMovie.rating}/10
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MovieList;
