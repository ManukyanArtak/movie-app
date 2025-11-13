import { CastCard } from '../CastCard';
import styles from './CastList.module.css';
import type { CastListProps } from './types';
import { CONSTANTS } from './constants';

export const CastList = ({ cast }: CastListProps) => {
  return (
    <div className={styles.castSection}>
      <h3 className={styles.sectionTitle}>{CONSTANTS.TITLE}</h3>
      <div className={styles.castGrid}>
        {cast.map((actor) => (
          <CastCard key={actor.id} actor={actor} />
        ))}
      </div>
    </div>
  );
};

