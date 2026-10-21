import type { ButtonHTMLAttributes } from 'react';
import { LoaderCircle, type LucideIcon } from 'lucide-react';
import { cx } from '../../../utils/format';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  isLoading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(styles.button, styles[variant], styles[size], fullWidth && styles.fullWidth, className)}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...rest}
    >
      {isLoading ? (
        <LoaderCircle className={cx(styles.icon, styles.spinner)} aria-hidden />
      ) : (
        Icon && <Icon className={styles.icon} aria-hidden />
      )}
      {children}
    </button>
  );
}
