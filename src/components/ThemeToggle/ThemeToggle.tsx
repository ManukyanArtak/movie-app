import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../contexts";
import styles from "./ThemeToggle.module.css";
import { CONSTANTS } from "./constants";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const ariaLabel = theme === "light"
    ? CONSTANTS.ARIA_LABEL.LIGHT_TO_DARK
    : CONSTANTS.ARIA_LABEL.DARK_TO_LIGHT;

  return (
    <button
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {theme === "light" ? (
        <Moon className={styles.icon} size={CONSTANTS.ICON_SIZE} />
      ) : (
        <Sun className={styles.icon} size={CONSTANTS.ICON_SIZE} />
      )}
    </button>
  );
}

