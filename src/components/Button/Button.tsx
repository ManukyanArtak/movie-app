import clsx from 'clsx';
import styles from './Button.module.css';
import type { ButtonProps } from './types';

export const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button 
      className={clsx(
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        className
      )} 
      {...props}
    >
      {children}
    </button>
  );
};

