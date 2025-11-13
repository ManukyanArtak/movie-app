import type { MovieDetails } from '../../types/tmdb';

export interface MovieDetailsHeroBannerProps {
  movie: MovieDetails;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

