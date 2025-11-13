import { Link } from 'react-router';
import { Star, Heart } from 'lucide-react';
import { IMAGE_BASE_URL } from '../../../services/tmdb';
import styles from './MovieCard.module.css';
import type { MovieCardProps } from './types';
import { CONSTANTS } from './constants';

export const MovieCard = ({ movie, isFavorite, onToggleFavorite }: MovieCardProps) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggleFavorite(movie);
  };

  const rating = movie.vote_average.toFixed(CONSTANTS.RATING_DECIMALS);
  const releaseYear = new Date(movie.release_date).getFullYear();

  return (
    <Link to={`/movie/${movie.id}`} className={styles.movieCard}>
      <div className={styles.movieCardPoster}>
        <img src={`${IMAGE_BASE_URL}${movie.poster_path}`} alt={movie.title} loading="lazy" />
        <button
          className={`${styles.favoriteButton} ${isFavorite ? styles.active : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? CONSTANTS.ARIA_LABELS.REMOVE_FROM_FAVORITES : CONSTANTS.ARIA_LABELS.ADD_TO_FAVORITES}
        >
          <Heart size={CONSTANTS.ICON_SIZES.HEART} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className={styles.movieCardInfo}>
        <h3 className={styles.movieCardTitle}>{movie.title}</h3>
        <div className={styles.movieCardMeta}>
          <span className={styles.movieCardRating}>
            <Star size={CONSTANTS.ICON_SIZES.STAR} fill="currentColor" /> {rating}
          </span>
          <span className={styles.movieCardYear}>{releaseYear}</span>
        </div>
      </div>
    </Link>
  );
};

