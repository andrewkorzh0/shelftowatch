import React from "react";
import Common from "@/Layouts/CommonLayout";
import { Link } from "@inertiajs/react";

const MovieNotFound = () => {
    return (
        <Common header="Movie Not Found">
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="p-6">
                            <div className="text-center">
                                {/* Error Message */}
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    Movie Not Found
                                </h2>
                                <p className="text-lg text-gray-600 mb-8">
                                    Sorry, we couldn't find the movie you're
                                    looking for.
                                </p>

                                {/* Action Buttons */}
                                <div className="flex justify-center gap-4">
                                    <Link
                                        href="/"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Return Home
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Common>
    );
};

export default MovieNotFound;
