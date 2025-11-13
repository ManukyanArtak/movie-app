import { useInfiniteQuery } from "@tanstack/react-query";
import { tmdbService } from "../../services/tmdb";

export const usePopularMoviesQuery = () => {
  return useInfiniteQuery({
    queryKey: ["movies", "popular"],
    queryFn: ({ pageParam }) => tmdbService.getPopularMovies(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    staleTime: 5 * 60 * 1000,
  });
};
