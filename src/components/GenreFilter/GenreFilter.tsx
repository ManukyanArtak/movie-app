import { useState } from 'react';
import { Folder, ChevronUp, ChevronDown } from 'lucide-react';
import { useGenresQuery } from '../../hooks/queries';
import styles from './GenreFilter.module.css';
import type { GenreFilterProps } from './types';
import { CONSTANTS } from './constants';

export const GenreFilter = ({ selectedGenreId, onGenreSelect }: GenreFilterProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { data, isLoading } = useGenresQuery();
  
  const genres = data?.genres ?? [];

  const handleGenreClick = (genreId: number | null) => {
    onGenreSelect(genreId);
    setIsMobileOpen(false);
  };

  const selectedGenreName = genres.find((g) => g.id === selectedGenreId)?.name || CONSTANTS.ALL_GENRES;

  if (isLoading) {
    return <div className={`${styles.genreFilter} ${styles.loading}`}>{CONSTANTS.LOADING_TEXT}</div>;
  }

  return (
    <>
      <button
        className={styles.genreMobileTrigger}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Folder size={CONSTANTS.ICON_SIZE} /> {selectedGenreName} {isMobileOpen ? <ChevronUp size={CONSTANTS.ICON_SIZE} /> : <ChevronDown size={CONSTANTS.ICON_SIZE} />}
      </button>

      <div className={`${styles.genreFilter} ${isMobileOpen ? styles.mobileOpen : ''}`}>
        <h3 className={styles.genreFilterTitle}>{CONSTANTS.TITLE}</h3>
        <div className={styles.genreList}>
          <button
            className={`${styles.genreItem} ${selectedGenreId === null ? styles.active : ''}`}
            onClick={() => handleGenreClick(null)}
          >
            {CONSTANTS.ALL_GENRES}
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              className={`${styles.genreItem} ${selectedGenreId === genre.id ? styles.active : ''}`}
              onClick={() => handleGenreClick(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {isMobileOpen && (
        <div className={styles.genreMobileOverlay} onClick={() => setIsMobileOpen(false)} />
      )}
    </>
  );
};

