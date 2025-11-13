import { useParams, useNavigate } from 'react-router';
import { useFavorites } from '../../hooks/useFavorites';
import { useMovieDetails } from './useMovieDetails';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorState } from '../../components/ErrorState';
import { MovieDetailsHeroBanner } from '../../components/MovieDetailsHeroBanner';
import { CastList } from '../../components/Cast';
import { TrailerCarousel } from '../../components/TrailerCarousel';
import { Button } from '../../components/Button';
import styles from './MovieDetailsPage.module.css';
import { BACKDROP_BASE_URL } from "../../services/tmdb";

export const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  
  if (!id) {
    return <ErrorState message="Movie ID is required" onBack={() => navigate('/')} />;
  }
  
  const { movie, cast, videos, isLoading, error } = useMovieDetails(id);

  if (isLoading) {
    return <LoadingSpinner message="Loading movie details..." />;
  }

  if (error || !movie) {
    return <ErrorState message={error || 'Movie not found'} onBack={() => navigate('/')} />;
  }

  return (
    <div className={styles.movieDetailsPage}>
      <Button className={styles.floating} onClick={() => navigate('/')} variant="primary">
        ← Back
      </Button>

      <div className={styles.backdrop} style={{ backgroundImage: `url(${BACKDROP_BASE_URL}${movie.backdrop_path})` }}>
        <div className={styles.backdropOverlay} />
      </div>

      <div className={styles.movieDetailsContent}>
        <MovieDetailsHeroBanner
          movie={movie}
          isFavorite={isFavorite(movie.id)}
          onToggleFavorite={() => toggleFavorite(movie)}
        />

        <CastList cast={cast} />

        {videos.length > 0 && <TrailerCarousel videos={videos} />}
      </div>
    </div>
  );
};

