import { Button } from '../Button';
import styles from './EmptyState.module.css';
import type { EmptyStateProps } from './types';
import { CONSTANTS } from './constants';

export const EmptyState = ({
  query,
  selectedGenreId,
  onReset,
  message = CONSTANTS.DEFAULT_MESSAGE,
}: EmptyStateProps) => {
  const showResetButton = (query || selectedGenreId) && onReset;

  return (
    <div className={styles.emptyState}>
      <p>{message}</p>
      {showResetButton && (
        <Button onClick={onReset} variant="secondary">
          {CONSTANTS.RESET_BUTTON_TEXT}
        </Button>
      )}
    </div>
  );
};

