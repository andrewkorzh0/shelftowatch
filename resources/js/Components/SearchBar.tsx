import React, { useState } from "react";
import { router } from "@inertiajs/react";

export default function SearchBar({ initialQuery = "", className = "" }) {
    const [query, setQuery] = useState(initialQuery);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        window.location.href = `/search/${query}`;
    };

    return (
        <form onSubmit={handleSearch} className={`w-full ${className}`}>
            <div className="relative">
                <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search movies..."
                    className="text-black selection:bg-blue-400 w-full px-4 py-2 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Search
                </button>
            </div>
        </form>
    );
}
