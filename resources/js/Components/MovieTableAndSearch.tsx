import React, { useState, useMemo } from "react";

const MovieTableSearch = ({ movies }) => {
    const [sortConfig, setSortConfig] = useState<{
        key: string | null;
        direction: "asc" | "desc";
    }>({
        key: null,
        direction: "asc",
    });
    const [filters, setFilters] = useState({
        rating: "all",
        year: "all",
        date_added: "all",
    });
    const [searchConfig, setSearchConfig] = useState({
        enabled: false,
        fields: {
            title: true,
            genre: true,
            list: true,
        },
        query: "",
    });

    const getRatingColor = (rating) => {
        if (!rating) return "text-gray-400";
        const numRating = parseFloat(rating);
        if (numRating >= 8.0) return "text-green-500";
        if (numRating >= 6.0) return "text-yellow-500";
        return "text-red-500";
    };

    const sortedMovies = useMemo(() => {
        let sortableMovies = [...movies];

        if (sortConfig.key) {
            sortableMovies.sort((a, b) => {
                let aValue: string | number = "";
                let bValue: string | number = "";
                switch (sortConfig.key) {
                    case "title":
                        aValue = (a.omdbData?.Title || "").toLowerCase();
                        bValue = (b.omdbData?.Title || "").toLowerCase();
                        break;
                    case "year":
                        aValue = parseInt(a.omdbData?.Year || "0");
                        bValue = parseInt(b.omdbData?.Year || "0");
                        break;
                    case "rating":
                        aValue = parseFloat(a.omdbData?.imdbRating || "0");
                        bValue = parseFloat(b.omdbData?.imdbRating || "0");
                        break;
                    case "dateAdded":
                        aValue = -new Date(a.savedMovie?.created_at).getTime();
                        bValue = new Date(b.savedMovie?.created_at).getTime();
                        break;
                    default:
                        return 0;
                }

                if (aValue < bValue)
                    return sortConfig.direction === "asc" ? -1 : 1;
                if (aValue > bValue)
                    return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }

        return sortableMovies;
    }, [movies, sortConfig]);

    const filteredMovies = useMemo(() => {
        return sortedMovies.filter((movie) => {
            // Rating and year filters
            const ratingMatch =
                filters.rating === "all" ||
                (filters.rating === "high" &&
                    parseFloat(movie.omdbData?.imdbRating || "0") >= 8.0) ||
                (filters.rating === "medium" &&
                    parseFloat(movie.omdbData?.imdbRating || "0") >= 6.0 &&
                    parseFloat(movie.omdbData?.imdbRating || "0") < 8.0) ||
                (filters.rating === "low" &&
                    parseFloat(movie.omdbData?.imdbRating || "0") < 6.0);

            const yearMatch =
                filters.year === "all" ||
                (filters.year === "2020+" &&
                    parseInt(movie.omdbData?.Year || "0") >= 2020) ||
                (filters.year === "2010-2019" &&
                    parseInt(movie.omdbData?.Year || "0") >= 2010 &&
                    parseInt(movie.omdbData?.Year || "0") < 2020) ||
                (filters.year === "older" &&
                    parseInt(movie.omdbData?.Year || "0") < 2010);

            // Search filter
            let searchMatch = true;
            if (searchConfig.enabled && searchConfig.query) {
                const query = searchConfig.query.toLowerCase();
                searchMatch = false;

                if (searchConfig.fields.title && movie.omdbData?.Title) {
                    searchMatch =
                        searchMatch ||
                        movie.omdbData.Title.toLowerCase().includes(query);
                }
                if (searchConfig.fields.genre && movie.omdbData?.Genre) {
                    searchMatch =
                        searchMatch ||
                        movie.omdbData.Genre.toLowerCase().includes(query);
                }
                if (
                    searchConfig.fields.list &&
                    movie.savedMovie?.movie_list?.name
                ) {
                    searchMatch =
                        searchMatch ||
                        movie.savedMovie.movie_list.name
                            .toLowerCase()
                            .includes(query);
                }
            }

            return ratingMatch && yearMatch && searchMatch;
        });
    }, [sortedMovies, filters, searchConfig]);

    const handleSort = (key) => {
        setSortConfig((current) => ({
            key,
            direction:
                current.key === key && current.direction === "asc"
                    ? "desc"
                    : "asc",
        }));
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return "↕️";
        return sortConfig.direction === "asc" ? "↑" : "↓";
    };

    const toggleSearchField = (field) => {
        setSearchConfig((prev) => ({
            ...prev,
            fields: {
                ...prev.fields,
                [field]: !prev.fields[field],
            },
        }));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Search Section */}
            <div className="mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search movies..."
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={searchConfig.query}
                            onChange={(e) =>
                                setSearchConfig((prev) => ({
                                    ...prev,
                                    enabled: true,
                                    query: e.target.value,
                                }))
                            }
                        />
                        <div className="absolute right-3 top-2.5">
                            {searchConfig.query && (
                                <button
                                    className="text-gray-400 hover:text-gray-600"
                                    onClick={() =>
                                        setSearchConfig((prev) => ({
                                            ...prev,
                                            query: "",
                                        }))
                                    }
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Search Options */}
                <div className="flex flex-wrap gap-3">
                    <span className="text-sm text-gray-600">Search in:</span>
                    {Object.entries(searchConfig.fields).map(
                        ([field, enabled]) => (
                            <button
                                key={field}
                                onClick={() => toggleSearchField(field)}
                                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                                    enabled
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-600"
                                }`}
                            >
                                {field.charAt(0).toUpperCase() + field.slice(1)}
                            </button>
                        )
                    )}
                </div>
            </div>

            {/* Filters Section */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <select
                    className="border rounded-md pr-8 pl-3 py-2 bg-white"
                    value={filters.rating}
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            rating: e.target.value,
                        }))
                    }
                >
                    <option value="all">All Ratings</option>
                    <option value="high">High (8+)</option>
                    <option value="medium">Medium (6-7.9)</option>
                    <option value="low">Low (&lt;6)</option>
                </select>

                <select
                    className="border rounded-md pl-3 pr-8 py-2 bg-white"
                    value={filters.year}
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            year: e.target.value,
                        }))
                    }
                >
                    <option value="all">All Years</option>
                    <option value="2020+">2020+</option>
                    <option value="2010-2019">2010-2019</option>
                    <option value="older">Before 2010</option>
                </select>
            </div>

            {/* Results count */}
            <div className="mb-4 text-sm text-gray-600">
                {filteredMovies.length}{" "}
                {filteredMovies.length === 1 ? "movie" : "movies"} found
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-lg rounded-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left">
                                <button
                                    className="font-semibold text-gray-600 hover:text-gray-900"
                                    onClick={() => handleSort("title")}
                                >
                                    Title {getSortIcon("title")}
                                </button>
                            </th>
                            <th className="px-6 py-3 text-left">
                                <button
                                    className="font-semibold text-gray-600 hover:text-gray-900"
                                    onClick={() => handleSort("year")}
                                >
                                    Year {getSortIcon("year")}
                                </button>
                            </th>
                            <th className="px-6 py-3 text-left">
                                <button
                                    className="font-semibold text-gray-600 hover:text-gray-900"
                                    onClick={() => handleSort("rating")}
                                >
                                    Rating {getSortIcon("rating")}
                                </button>
                            </th>
                            <th className="px-6 py-3 text-left">Genre</th>
                            <th className="px-6 py-3 text-left">List</th>
                            <th className="px-6 py-3 text-left">
                                <button
                                    className="font-semibold text-gray-600 hover:text-gray-900"
                                    onClick={() => handleSort("dateAdded")}
                                >
                                    Date Added {getSortIcon("dateAdded")}
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredMovies.map((movie) => (
                            <tr
                                key={movie.savedMovie.id}
                                className="hover:bg-gray-50 transition-colors duration-200"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-36 flex-shrink-0">
                                            {movie.omdbData?.Poster &&
                                            movie.omdbData.Poster !== "N/A" ? (
                                                <a
                                                    href={`/title/${movie.omdbData?.imdbID}`}
                                                >
                                                    <img
                                                        src={
                                                            movie.omdbData
                                                                .Poster
                                                        }
                                                        alt={
                                                            movie.omdbData.Title
                                                        }
                                                        className="h-full w-full object-cover rounded"
                                                    />
                                                </a>
                                            ) : (
                                                <div className="h-full w-full bg-gray-200 rounded flex items-center justify-center">
                                                    <span className="text-xs text-gray-400">
                                                        No Image
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="font-medium text-gray-900">
                                            {movie.omdbData?.Title ? (
                                                <a
                                                    href={`/title/${movie.omdbData?.imdbID}`}
                                                >
                                                    {movie.omdbData.Title}
                                                </a>
                                            ) : (
                                                "Unknown Title"
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {movie.omdbData?.Year || "N/A"}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`font-medium ${getRatingColor(
                                            movie.omdbData?.imdbRating
                                        )}`}
                                    >
                                        {movie.omdbData?.imdbRating || "N/A"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {movie.omdbData?.Genre || "N/A"}
                                </td>
                                <td className="px-6 py-4 text-blue-600">
                                    {movie.savedMovie.movie_list.name}
                                </td>
                                <td className="px-6 py-4">
                                    {new Intl.DateTimeFormat("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "2-digit",
                                    }).format(
                                        new Date(movie.savedMovie.created_at)
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MovieTableSearch;
