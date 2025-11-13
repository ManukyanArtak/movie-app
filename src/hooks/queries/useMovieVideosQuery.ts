import { useQuery } from "@tanstack/react-query";
import { tmdbService } from "../../services/tmdb";

export const useMovieVideosQuery = (movieId: string) => {
  return useQuery({
    queryKey: ["movie", "videos", movieId],
    queryFn: () => tmdbService.getMovieVideos(parseInt(movieId, 10)),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

