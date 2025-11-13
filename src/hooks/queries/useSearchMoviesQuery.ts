import { useInfiniteQuery } from "@tanstack/react-query";
import { tmdbService } from "../../services/tmdb";

export const useSearchMoviesQuery = (query: string) => {
  return useInfiniteQuery({
    queryKey: ["movies", "search", query],
    queryFn: ({ pageParam }) => tmdbService.searchMovies(query, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    enabled: !!query,
    staleTime: 5 * 60 * 1000,
  });
};
