import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import type { MoviesResponse } from "../../types/tmdb";

export type InfiniteMoviesQuery = UseInfiniteQueryResult<
  InfiniteData<MoviesResponse>
>;

export function getActiveQuery({
  debouncedQuery,
  selectedGenreId,
  searchQuery,
  genreQuery,
  popularQuery,
}: {
  debouncedQuery: string;
  selectedGenreId: number | null;
  searchQuery: InfiniteMoviesQuery;
  genreQuery: InfiniteMoviesQuery;
  popularQuery: InfiniteMoviesQuery;
}) {
  if (debouncedQuery) return searchQuery;
  if (selectedGenreId !== null) return genreQuery;
  return popularQuery;
}
