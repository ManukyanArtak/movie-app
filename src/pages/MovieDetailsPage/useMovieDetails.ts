import {
  useMovieDetailsQuery,
  useMovieCreditsQuery,
  useMovieVideosQuery,
} from "../../hooks/queries";

export const useMovieDetails = (movieId: string) => {
  const movieQuery = useMovieDetailsQuery(movieId);
  const creditsQuery = useMovieCreditsQuery(movieId);
  const videosQuery = useMovieVideosQuery(movieId);

  const isLoading =
    movieQuery.isLoading || creditsQuery.isLoading || videosQuery.isLoading;
  const hasError = movieQuery.error || creditsQuery.error || videosQuery.error;

  return {
    movie: movieQuery.data ?? null,
    cast: creditsQuery.data?.cast.slice(0, 10) ?? [],
    videos: videosQuery.data?.results ?? [],
    isLoading,
    error: hasError ? "Failed to load movie details. Please try again." : null,
  };
};
