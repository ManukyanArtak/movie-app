import { Star, Heart } from 'lucide-react';
import { IMAGE_BASE_URL } from '../../services/tmdb';
import { Button } from '../Button';
import styles from './MovieDetailsHeroBanner.module.css';
import type { MovieDetailsHeroBannerProps } from './types';
import { CONSTANTS } from './constants';

export const MovieDetailsHeroBanner = ({
  movie,
  isFavorite,
  onToggleFavorite
}: MovieDetailsHeroBannerProps) => {

  const rating = movie.vote_average.toFixed(CONSTANTS.RATING_DECIMALS);
  const releaseYear = new Date(movie.release_date).getFullYear();
  const runtime = `${Math.floor(movie.runtime / CONSTANTS.MINUTES_PER_HOUR)}h ${movie.runtime % CONSTANTS.MINUTES_PER_HOUR}m`;

  return (
    <div className={styles.movieHero}>
      <img src={`${IMAGE_BASE_URL}${movie.poster_path}`} alt={movie.title} className={styles.moviePoster} />

      <div className={styles.movieInfo}>
        <h1 className={styles.movieTitle}>{movie.title}</h1>
        {movie.tagline && <p className={styles.movieTagline}>"{movie.tagline}"</p>}

        <div className={styles.movieMeta}>
          <span className={styles.metaItem}>
            <Star size={CONSTANTS.ICON_SIZES.STAR} fill="currentColor" /> {rating}
          </span>
          <span className={styles.metaItem}>{releaseYear}</span>
          <span className={styles.metaItem}>{runtime}</span>
        </div>

        <div className={styles.movieGenres}>
          {movie.genres.map((genre) => (
            <span key={genre.id} className={styles.genreBadge}>
              {genre.name}
            </span>
          ))}
        </div>

        <Button
          variant="primary"
          onClick={onToggleFavorite}
          className={styles.favoriteButton}
        >
          <Heart
            size={CONSTANTS.ICON_SIZES.HEART}
            fill={isFavorite ? 'currentColor' : 'none'}
            color={isFavorite ? CONSTANTS.FAVORITE_COLOR : 'currentColor'}
          />
          {isFavorite ? CONSTANTS.REMOVE_FROM_FAVORITES : CONSTANTS.ADD_TO_FAVORITES}
        </Button>

        <div className={styles.movieOverview}>
          <h3>{CONSTANTS.OVERVIEW_TITLE}</h3>
          <p>{movie.overview || CONSTANTS.NO_OVERVIEW_TEXT}</p>
        </div>
      </div>
    </div>
  );
};

