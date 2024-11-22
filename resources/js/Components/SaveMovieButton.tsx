import React, { useState, useEffect } from "react";
import axios from "axios";

interface Movie {
    imdbID: string;
    Title: string;
}

interface MovieList {
    id: number;
    name: string;
}

interface SaveMovieButtonProps {
    movie: Movie;
}

const SaveMovieButton: React.FC<SaveMovieButtonProps> = ({ movie }) => {
    const [lists, setLists] = useState<MovieList[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [currentList, setCurrentList] = useState<MovieList | null>(null);
    const [message, setMessage] = useState<{
        text: string;
        isError: boolean;
    } | null>(null);

    useEffect(() => {
        // Fetch available lists
        axios
            .get("/user/movie-lists")
            .then((response) => setLists(response.data))
            .catch((error) => {
                console.error("Error fetching lists:", error);
                setMessage({ text: "Failed to load lists", isError: true });
            });

        // Check if movie is already in a list
        axios
            .get(`/saved-movies/check/${movie.imdbID}`)
            .then((response) => {
                console.log(
                    "SavedMovieController@checkMovie response:",
                    response.data
                );
                if (response.data.isSaved) {
                    console.log("Movie is already in a list");
                    var result = response.data.savedMovie.movie_list;
                    setCurrentList({
                        id: Number(result.id),
                        name: result.name,
                    });
                }
            })
            .catch((error) => {
                console.error("Error checking movie status:", error);
            });
    }, [movie.imdbID]);

    const handleSaveToList = async (list: MovieList) => {
        setIsSaving(true);
        setMessage(null);

        try {
            await axios.post("/saved-movies", {
                imdb_id: movie.imdbID,
                movie_list_id: list.id,
            });

            setMessage({ text: `Added to ${list.name}!`, isError: false });
            setCurrentList(list);
            setIsOpen(false);
        } catch (error) {
            console.error("Error saving movie:", error);
            setMessage({ text: "Failed to save movie", isError: true });
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemoveFromList = async () => {
        if (!currentList) return;

        setIsSaving(true);
        setMessage(null);

        try {
            await axios.delete(`/saved-movies/by-imdb/${movie.imdbID}`);
            setMessage({ text: "Removed from list", isError: false });
            setCurrentList(null);
        } catch (error) {
            console.error("Error removing movie:", error);
            setMessage({ text: "Failed to remove movie", isError: true });
        } finally {
            setIsSaving(false);
        }
    };

    if (currentList) {
        return (
            <div className="relative">
                <button
                    onClick={handleRemoveFromList}
                    disabled={isSaving}
                    className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    <span className="mr-2">×</span>
                    {isSaving
                        ? "Removing..."
                        : `Remove from ${currentList.name}`}
                </button>
                {/* */}
                {message && (
                    <div
                        className={`absolute mt-2 text-sm ${
                            message.isError ? "text-red-600" : "text-green-600"
                        }`}
                    >
                        {message.text}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative inline-block text-left">
            <div>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={isSaving}
                    className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {isSaving ? (
                        "Saving..."
                    ) : (
                        <>
                            {isOpen ? "Select List" : "Add to List"}
                            <svg
                                className={`-mr-1 ml-2 h-5 w-5 transform ${
                                    isOpen ? "rotate-180" : ""
                                }`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </>
                    )}
                </button>
            </div>
            {message && (
                <div
                    className={`absolute mt-2 text-sm ${
                        message.isError ? "text-red-600" : "text-green-600"
                    }`}
                >
                    {message.text}
                </div>
            )}
            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                    >
                        {lists.map((list) => (
                            <button
                                key={list.id}
                                onClick={() => handleSaveToList(list)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                role="menuitem"
                            >
                                {list.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SaveMovieButton;
