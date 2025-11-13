import { useInfiniteQuery } from "@tanstack/react-query";
import { tmdbService } from "../../services/tmdb";

export const useMoviesByGenreQuery = (genreId: number) => {
  return useInfiniteQuery({
    queryKey: ["movies", "genre", genreId],
    queryFn: ({ pageParam }) =>
      tmdbService.getMoviesByGenre(genreId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

