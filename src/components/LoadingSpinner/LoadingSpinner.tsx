import styles from './LoadingSpinner.module.css';
import type { LoadingSpinnerProps } from './types';
import { CONSTANTS } from './constants';

export const LoadingSpinner = ({ message = CONSTANTS.DEFAULT_MESSAGE }: LoadingSpinnerProps) => {
  return (
    <div className={styles.loadingSpinner}>
      <div className={styles.spinner}></div>
      <p>{message}</p>
    </div>
  );
};

