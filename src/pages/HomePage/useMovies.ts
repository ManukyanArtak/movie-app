import { useState, useMemo } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import {
  usePopularMoviesQuery,
  useSearchMoviesQuery,
  useMoviesByGenreQuery,
} from "../../hooks/queries";

export const useMovies = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);

  const popularQuery = usePopularMoviesQuery();
  const searchQuery = useSearchMoviesQuery(debouncedQuery);
  const genreQuery = useMoviesByGenreQuery(selectedGenreId);

  const activeQuery = debouncedQuery
    ? searchQuery
    : selectedGenreId !== null
    ? genreQuery
    : popularQuery;

  const movies = useMemo(
    () => activeQuery.data?.pages.flatMap((page) => page.results) ?? [],
    [activeQuery.data]
  );

  const handleGenreSelect = (genreId: number | null) => {
    setSelectedGenreId(genreId);
    setQuery("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value) {
      setSelectedGenreId(null);
    }
  };

  const handleClearSearch = () => {
    setQuery("");
  };

  const handleReset = () => {
    setQuery("");
    setSelectedGenreId(null);
  };

  return {
    query,
    movies,
    isLoading: activeQuery.isLoading,
    error: activeQuery.error
      ? "Failed to load movies. Please try again."
      : null,
    hasMore: activeQuery.hasNextPage ?? false,
    handleLoadMore: () => activeQuery.fetchNextPage(),
    handleReset,
    selectedGenreId,
    handleGenreSelect,
    handleSearchChange,
    handleClearSearch,
  };
};
