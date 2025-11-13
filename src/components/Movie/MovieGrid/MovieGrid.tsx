import { MovieCard } from '../MovieCard';
import styles from './MovieGrid.module.css';
import type { MovieGridProps } from './types';

export const MovieGrid = ({
  movies,
  isFavorite,
  onToggleFavorite,
}: MovieGridProps) => {
  return (
    <div className={styles.moviesGrid}>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isFavorite={isFavorite(movie.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};

