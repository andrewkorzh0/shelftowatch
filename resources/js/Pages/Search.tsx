import React from "react";
import { Link, usePage } from "@inertiajs/react";
import SearchBar from "@/Components/SearchBar";
import Common from "@/Layouts/CommonLayout";

export default function Search({ searchResults, query, currentPage, error }) {
    const { url } = usePage();

    // Determine total results and pages
    const totalResults =
        searchResults?.TotalResults || searchResults?.totalResults || 0;
    const resultsPerPage = 10; // OMDB API typically returns 10 results per page
    const totalPages = Math.ceil(totalResults / resultsPerPage);

    // Pagination logic
    const generatePaginationRange = () => {
        const range = [];
        const maxPagesToShow = 5;
        let start = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let end = Math.min(totalPages, start + maxPagesToShow - 1);

        // Adjust start if we're at the end of pages
        if (end === totalPages) {
            start = Math.max(1, end - maxPagesToShow + 1);
        }

        for (let i = start; i <= end; i++) {
            range.push(i as never);
        }

        return range;
    };

    const paginationRange = generatePaginationRange();

    return (
        <Common>
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <SearchBar
                            initialQuery={query}
                            className="max-w-2xl mx-auto"
                        />
                    </div>

                    {/* Error Handling */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                            <p className="text-center">{error}</p>
                        </div>
                    )}

                    {/* Successful Search Results */}
                    {searchResults?.Search &&
                    searchResults.Search.length > 0 ? (
                        <>
                            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                                Search Results for "{query}" ({totalResults}{" "}
                                total)
                            </h1>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 sm:gap-6 mb-8">
                                {searchResults.Search.map((movie) => (
                                    <Link
                                        key={movie.imdbID}
                                        href={`/title/${movie.imdbID}`}
                                        className="block bg-white rounded-lg shadow hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
                                    >
                                        <div className="aspect-[2/3] relative overflow-hidden rounded-t-lg">
                                            {movie.Poster &&
                                            movie.Poster !== "N/A" ? (
                                                <img
                                                    src={movie.Poster}
                                                    alt={`Poster for ${movie.Title}`}
                                                    className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-500 text-sm text-center px-2">
                                                        No Poster Available
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-3">
                                            <h2 className="font-semibold text-gray-900 mb-1 text-sm line-clamp-2">
                                                {movie.Title}
                                            </h2>
                                            <div className="flex items-center justify-between text-xs text-gray-600">
                                                <span>{movie.Year}</span>
                                                <span className="capitalize px-2 py-0.5 bg-gray-100 rounded-full">
                                                    {movie.Type}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center space-x-2 mt-8">
                                    {/* Previous Button */}
                                    {currentPage > 1 && (
                                        <Link
                                            href={`/search/${query}/${
                                                currentPage - 1
                                            }`}
                                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                                        >
                                            Previous
                                        </Link>
                                    )}

                                    {/* Page Numbers */}
                                    {paginationRange.map((page) => (
                                        <Link
                                            key={page}
                                            href={`/search/${query}/${page}`}
                                            className={`px-4 py-2 rounded transition ${
                                                currentPage == page
                                                    ? "bg-blue-500 text-white" // Active page styling
                                                    : "bg-gray-200 hover:bg-gray-300"
                                            }`}
                                        >
                                            {page}
                                        </Link>
                                    ))}

                                    {/* Next Button */}
                                    {currentPage < totalPages && (
                                        <Link
                                            href={`/search/${query}/${
                                                currentPage + 1
                                            }`}
                                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                                        >
                                            Next
                                        </Link>
                                    )}
                                </div>
                            )}
                        </>
                    ) : query && !error ? (
                        <div className="text-center py-12">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                No Results Found
                            </h1>
                            <p className="text-gray-600 mb-6">
                                We couldn't find any movies matching "{query}".
                            </p>
                            <p className="text-gray-500">
                                Try different keywords or check the spelling.
                            </p>
                        </div>
                    ) : null}
                </div>
            </div>
        </Common>
    );
}
