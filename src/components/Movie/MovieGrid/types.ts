import type { Movie } from '../../../types/tmdb';

export interface MovieGridProps {
  movies: Movie[];
  isFavorite: (movieId: number) => boolean;
  onToggleFavorite: (movie: Movie) => void;
}

