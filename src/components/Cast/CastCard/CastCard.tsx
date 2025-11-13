import { User } from 'lucide-react';
import { IMAGE_BASE_URL } from '../../../services/tmdb';
import styles from './CastCard.module.css';
import type { CastCardProps } from './types';
import { CONSTANTS } from './constants';

export const CastCard = ({ actor }: CastCardProps) => {
  return (
    <div className={styles.castCard}>
      <div className={styles.castPhoto}>
        {actor.profile_path ? (
          <img
            src={`${IMAGE_BASE_URL}${actor.profile_path}`}
            alt={actor.name}
            loading="lazy"
          />
        ) : (
          <div className={styles.castPhotoPlaceholder}>
            <User size={CONSTANTS.PLACEHOLDER_ICON_SIZE} />
          </div>
        )}
      </div>
      <div className={styles.castInfo}>
        <p className={styles.castName}>{actor.name}</p>
        <p className={styles.castCharacter}>{actor.character}</p>
      </div>
    </div>
  );
};

