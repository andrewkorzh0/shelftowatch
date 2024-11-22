import React from "react";
import { render, screen } from "@testing-library/react";
import Search from "./Search";
import "@testing-library/jest-dom";

jest.mock("@inertiajs/react", () => ({
    ...jest.requireActual("@inertiajs/react"),
    usePage: () => ({
        url: "/search",
    }),
    Link: ({ children, ...props }) => <a {...props}>{children}</a>,
}));

jest.mock("@/Components/SearchBar", () => {
    return function DummySearchBar({ initialQuery }) {
        return <div data-testid="search-bar">Search Bar: {initialQuery}</div>;
    };
});

jest.mock("@/Layouts/CommonLayout", () => {
    return function DummyLayout({ children }) {
        return <div data-testid="common-layout">{children}</div>;
    };
});

describe("Search Component", () => {
    const mockSearchResults = {
        Search: [
            {
                Title: "Test Movie",
                Year: "2024",
                imdbID: "tt1234567",
                Type: "movie",
                Poster: "https://example.com/poster.jpg",
            },
            {
                Title: "Another Movie",
                Year: "2023",
                imdbID: "tt7654321",
                Type: "movie",
                Poster: "N/A",
            },
        ],
        totalResults: "42",
    };

    // 1. Render Search Bar with Initial Query
    it("renders the search bar with the initial query", () => {
        render(
            <Search
                query="test query"
                searchResults={{}}
                currentPage={1}
                error={null}
            />
        );
        expect(screen.getByTestId("search-bar")).toHaveTextContent(
            "test query"
        );
    });

    // 2. Display Error Message when error prop is provided
    it("displays an error message when the error prop is provided", () => {
        const errorMessage = "Something went wrong";
        render(
            <Search
                query={""}
                error={errorMessage}
                searchResults={{}}
                currentPage={1}
            />
        );
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // 3. Display "No Results Found" message when search returns empty results
    it('displays "No Results Found" message when search returns empty results', () => {
        render(
            <Search
                query="nonexistent"
                searchResults={{ Search: [] }}
                currentPage={1}
                error={null}
            />
        );

        expect(screen.getByText("No Results Found")).toBeInTheDocument();
        expect(
            screen.getByText(
                /We couldn't find any movies matching "nonexistent"/
            )
        ).toBeInTheDocument();
    });

    // 4. Render Pagination
    it("renders pagination correctly", () => {
        render(
            <Search
                query="test"
                searchResults={{ ...mockSearchResults, totalResults: "25" }}
                currentPage={2}
                error={null}
            />
        );

        expect(screen.getByText("Previous")).toBeInTheDocument();
        expect(screen.getByText("Next")).toBeInTheDocument();

        const currentPageButton = screen.getByText("2");
        expect(currentPageButton.className).toContain("bg-blue-500");
    });

    // 5. Handle First Page Pagination Correctly
    it("handles first page pagination correctly", () => {
        render(
            <Search
                query="test"
                searchResults={{ ...mockSearchResults, totalResults: "25" }}
                currentPage={1}
                error={null}
            />
        );

        expect(screen.queryByText("Previous")).not.toBeInTheDocument();
        expect(screen.getByText("Next")).toBeInTheDocument();
    });

    // 6. Handle Last Page Pagination Correctly
    it("handles last page pagination correctly", () => {
        render(
            <Search
                query="test"
                searchResults={{ ...mockSearchResults, totalResults: "25" }}
                currentPage={3}
                error={null}
            />
        );

        expect(screen.getByText("Previous")).toBeInTheDocument();
        expect(screen.queryByText("Next")).not.toBeInTheDocument();
    });
});
