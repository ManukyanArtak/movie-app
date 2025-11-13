import { useQuery } from "@tanstack/react-query";
import { tmdbService } from "../../services/tmdb";

export const useGenresQuery = () => {
  return useQuery({
    queryKey: ["genres"],
    queryFn: () => tmdbService.getGenres(),
    staleTime: 24 * 60 * 60 * 1000,
  });
};
