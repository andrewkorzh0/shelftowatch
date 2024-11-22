import React from "react";
import { Link } from "@inertiajs/react";
import SearchBar from "@/Components/SearchBar";
import Common from "@/Layouts/CommonLayout";
interface Movie {
    imdbID: string;
    Title: string;
    Year: string;
    Type: string;
    Poster: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface HomePageProps {
    auth: {
        user: User | null;
    };
    movieCollection: Movie[];
    collectionTitle: string;
}

export default function HomePage({
    auth,
    movieCollection,
    collectionTitle,
}: HomePageProps) {
    const text = "Search   any    movie";
    return (
        <Common>
            <div className="min-h-screen bg-gray-50">
                {/* Main Content */}
                <main className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Title Section */}
                        <div className="flex justify-center items-center max-h-12 md:max-h-24 pb-18 p-4">
                            <div className="flex space-x-1 md:space-x-2">
                                {text.split("").map((char, index) => (
                                    <span
                                        key={index}
                                        className="text-lg md:text-2xl font-bold animate-float"
                                        style={{
                                            animationDelay: `${index * 0.1}s`,
                                            display: "inline-block",
                                            animationDuration: "2s",
                                            animationIterationCount: "infinite",
                                        }}
                                    >
                                        {char}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {/* Search Section */}
                        <div className="max-w-2xl mx-auto mb-12">
                            <SearchBar className="w-full" />
                        </div>

                        {/* Movie Collection Section */}
                        {movieCollection.length > 0 && (
                            <div className="mt-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    {collectionTitle}
                                </h2>
                                <div className="relative">
                                    <div className="overflow-x-auto pb-6 scrollbar-hide">
                                        <div
                                            className="flex space-x-6"
                                            style={{ minWidth: "max-content" }}
                                        >
                                            {movieCollection.map((movie) => (
                                                <div
                                                    key={movie.imdbID}
                                                    className="w-48 flex-shrink-0"
                                                >
                                                    <Link
                                                        href={`/title/${movie.imdbID}`}
                                                        className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
                                                    >
                                                        <div className="aspect-[2/3] relative">
                                                            {movie.Poster &&
                                                            movie.Poster !==
                                                                "N/A" ? (
                                                                <img
                                                                    src={
                                                                        movie.Poster
                                                                    }
                                                                    alt={
                                                                        movie.Title
                                                                    }
                                                                    className="w-full h-full object-cover rounded-t-lg"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-t-lg">
                                                                    <span className="text-gray-400">
                                                                        No
                                                                        Poster
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="p-4">
                                                            <h2 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                                                {movie.Title}
                                                            </h2>
                                                            <div className="flex items-center justify-between text-sm text-gray-600">
                                                                <span>
                                                                    {movie.Year}
                                                                </span>
                                                                <span className="capitalize px-2 py-1 bg-gray-100 rounded-full text-xs">
                                                                    {movie.Type}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </Common>
    );
}
