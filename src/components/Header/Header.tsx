import { Film, X } from 'lucide-react';
import styles from './Header.module.css';
import { ThemeToggle } from '../ThemeToggle';
import type { HeaderProps } from './types';
import { CONSTANTS } from './constants';

export const Header = ({ query, onSearchChange, onClearSearch }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <h3 className={styles.title}>
        <Film size={CONSTANTS.ICON_SIZES.TITLE} /> {CONSTANTS.TITLE}
      </h3>
      <div className={styles.actions}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder={CONSTANTS.SEARCH_PLACEHOLDER}
            value={query}
            onChange={onSearchChange}
          />
          {query && (
            <button className={styles.searchClear} onClick={onClearSearch}>
              <X size={CONSTANTS.ICON_SIZES.CLEAR} />
            </button>
          )}
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

