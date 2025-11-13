import { useQuery } from "@tanstack/react-query";
import { tmdbService } from "../../services/tmdb";

export const useMovieCreditsQuery = (movieId: string) => {
  return useQuery({
    queryKey: ["movie", "credits", movieId],
    queryFn: () => tmdbService.getMovieCredits(parseInt(movieId, 10)),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};
