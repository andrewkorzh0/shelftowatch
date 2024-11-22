import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Common from "@/Layouts/CommonLayout";
import Guest from "@/Layouts/GuestLayout";
import { Link, usePage } from "@inertiajs/react";
import SaveMovieButton from "@/Components/SaveMovieButton";
import MovieNotFound from "@/Components/MovieNotFound";

const Title = ({ movie, error }) => {
    const user = usePage().props.auth.user;
    if (error) {
        return <MovieNotFound />;
    }
    return (
        <Common header={movie.Title}>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        {/* Header Section */}
                        <div className="border-b border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <img
                                        src={movie.Poster}
                                        alt={movie.Title}
                                        className="w-48 h-auto rounded-lg shadow-lg"
                                    />
                                    <div>
                                        <h1 className="text-3xl font-bold mb-2">
                                            {movie.Title} ({movie.Year})
                                        </h1>
                                        <div className="flex gap-4 text-gray-600">
                                            <span>{movie.Rated}</span>
                                            <span>•</span>
                                            <span>{movie.Runtime}</span>
                                            <span>•</span>
                                            <span>{movie.Genre}</span>
                                        </div>
                                        <div className="m-2 ml-0">
                                            {/* <AddToShelfButton /> */}
                                            {user && (
                                                <SaveMovieButton
                                                    movie={movie}
                                                ></SaveMovieButton>
                                            )}
                                            {!user && (
                                                <span className="text-sm text-gray-500">
                                                    Login to use shelves
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-6">
                            <div className="space-y-6">
                                {/* Plot Section */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">
                                        Plot
                                    </h3>
                                    <p className="text-gray-700">
                                        {movie.Plot}
                                    </p>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Movie Details */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">
                                            Details
                                        </h3>
                                        <dl className="space-y-2">
                                            <div>
                                                <dt className="text-gray-600">
                                                    Director
                                                </dt>
                                                <dd className="font-medium">
                                                    {movie.Director}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-gray-600">
                                                    Writers
                                                </dt>
                                                <dd className="font-medium">
                                                    {movie.Writer}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-gray-600">
                                                    Actors
                                                </dt>
                                                <dd className="font-medium">
                                                    {movie.Actors}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-gray-600">
                                                    Release Date
                                                </dt>
                                                <dd className="font-medium">
                                                    {movie.Released}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>

                                    {/* Ratings */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">
                                            Ratings
                                        </h3>
                                        <dl className="space-y-2">
                                            {movie.Ratings?.map(
                                                (rating, index) => (
                                                    <div key={index}>
                                                        <dt className="text-gray-600">
                                                            {rating.Source}
                                                        </dt>
                                                        <dd className="font-medium">
                                                            {rating.Value}
                                                        </dd>
                                                    </div>
                                                )
                                            )}
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Common>
    );
};

export default Title;
