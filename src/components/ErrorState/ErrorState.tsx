import { Button } from '../Button';
import styles from './ErrorState.module.css';
import type { ErrorStateProps } from './types';
import { CONSTANTS } from './constants';

export const ErrorState = ({ message = CONSTANTS.DEFAULT_MESSAGE, onBack }: ErrorStateProps) => {
  return (
    <div className={styles.errorState}>
      <div className={styles.errorContainer}>
        <h2>{CONSTANTS.TITLE}</h2>
        <p>{message}</p>
        <Button onClick={onBack} variant="primary">
          {CONSTANTS.BACK_BUTTON_TEXT}
        </Button>
      </div>
    </div>
  );
};

