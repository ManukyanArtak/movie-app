import { useQuery } from "@tanstack/react-query";
import { tmdbService } from "../../services/tmdb";

export const useMovieDetailsQuery = (movieId: string) => {
  return useQuery({
    queryKey: ["movie", "details", movieId],
    queryFn: () => tmdbService.getMovieDetails(parseInt(movieId, 10)),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

