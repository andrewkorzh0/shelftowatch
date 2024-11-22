import MovieTableSearch from "@/Components/MovieTableAndSearch";
import SavedMovieList from "@/Components/SavedMoviesTable";
import CommonLayout from "@/Layouts/CommonLayout";

export default function MoviesIndex({ movies, filters, movieLists }) {
    return (
        <CommonLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <MovieTableSearch movies={movies}></MovieTableSearch>
                {/* <SavedMovieList movies={movies} /> */}
            </div>
        </CommonLayout>
    );
}
