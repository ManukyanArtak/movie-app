import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTrailerCarousel } from '../../hooks/useTrailerCarousel';
import styles from './TrailerCarousel.module.css';
import type { TrailerCarouselProps } from './types';
import { CONSTANTS } from './constants';

export const TrailerCarousel = ({ videos }: TrailerCarouselProps) => {
  const { trailers, currentTrailer, currentIndex, handlePrev, handleNext, goToIndex } =
    useTrailerCarousel(videos);

  return (
    <div className={styles.trailerCarousel}>
      <h3 className={styles.trailerCarouselTitle}>{CONSTANTS.TITLE}</h3>
      <div className={styles.trailerCarouselContainer}>
        {trailers.length > CONSTANTS.MIN_TRAILERS_FOR_NAVIGATION && (
          <button
            className={`${styles.carouselButton} ${styles.prev}`}
            onClick={handlePrev}
            aria-label={CONSTANTS.ARIA_LABELS.PREVIOUS}
          >
            <ChevronLeft size={CONSTANTS.ICON_SIZE} />
          </button>
        )}
        <div className={styles.trailerWrapper}>
          <iframe
            src={`${CONSTANTS.YOUTUBE_EMBED_URL}${currentTrailer.key}`}
            title={currentTrailer.name}
            frameBorder="0"
            allow={CONSTANTS.IFRAME_PERMISSIONS}
            allowFullScreen
            className={styles.trailerIframe}
          />
          <p className={styles.trailerName}>{currentTrailer.name}</p>
        </div>
        {trailers.length > CONSTANTS.MIN_TRAILERS_FOR_NAVIGATION && (
          <button
            className={`${styles.carouselButton} ${styles.next}`}
            onClick={handleNext}
            aria-label={CONSTANTS.ARIA_LABELS.NEXT}
          >
            <ChevronRight size={CONSTANTS.ICON_SIZE} />
          </button>
        )}
      </div>
      {trailers.length > CONSTANTS.MIN_TRAILERS_FOR_NAVIGATION && (
        <div className={styles.carouselDots}>
          {trailers.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
              onClick={() => goToIndex(index)}
              aria-label={`${CONSTANTS.ARIA_LABELS.GO_TO_VIDEO} ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

