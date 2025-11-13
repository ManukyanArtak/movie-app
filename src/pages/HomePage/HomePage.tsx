import { useMovies } from './useMovies';
import styles from './HomePage.module.css';
import { Header } from '../../components/Header';
import { MovieGrid } from '../../components/Movie';
import { useFavorites } from '../../hooks/useFavorites';
import { EmptyState } from '../../components/EmptyState';
import { GenreFilter } from '../../components/GenreFilter';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';


export const HomePage = () => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const {
    query,
    selectedGenreId,
    movies,
    isLoading,
    error,
    hasMore,
    handleGenreSelect,
    handleSearchChange,
    handleClearSearch,
    handleReset,
    handleLoadMore,
  } = useMovies();

  const { loadMoreRef } = useInfiniteScroll({
    isLoading,
    hasMore,
    onLoadMore: handleLoadMore,
    threshold: 0.1,
  });

  return (
    <div className={styles.homePage}>
      <Header
        query={query}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
      />

      <div className={styles.homeContent}>
        <aside className={styles.sidebar}>
          <GenreFilter selectedGenreId={selectedGenreId} onGenreSelect={handleGenreSelect} />
        </aside>

        <main className={styles.mainContent}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          {movies.length === 0 && !isLoading && (
            <EmptyState
              query={query}
              selectedGenreId={selectedGenreId}
              onReset={handleReset}
            />
          )}

          <MovieGrid
            movies={movies}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />

          {isLoading && <LoadingSpinner message="Loading movies..." />}

          <div ref={loadMoreRef} className={styles.loadMoreTrigger} />
        </main>
      </div>
    </div>
  );
};

