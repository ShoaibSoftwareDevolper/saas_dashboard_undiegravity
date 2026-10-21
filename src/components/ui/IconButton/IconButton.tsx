import type { ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router';
import type { LucideIcon } from 'lucide-react';
import { cx } from '../../../utils/format';
import styles from './IconButton.module.css';

type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
  variant?: 'surface' | 'outline' | 'inverse' | 'light' | 'brand' | 'ghost';
  size?: IconButtonSize;
  badge?: number;
  to?: string;
}

const iconSizes: Record<IconButtonSize, string> = {
  sm: styles.iconSm,
  md: styles.iconMd,
  lg: styles.iconLg,
};

export function IconButton({
  icon: Icon,
  label,
  variant = 'surface',
  size = 'md',
  badge,
  to,
  className,
  type = 'button',
  ...rest
}: IconButtonProps) {
  const classes = cx(styles.iconButton, styles[variant], styles[size], className);
  const inner = (
    <>
      <Icon className={iconSizes[size]} aria-hidden />
      {Boolean(badge) && <span className={styles.badge}>{badge}</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} aria-label={label} title={label} className={classes}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} aria-label={label} title={label} className={classes} {...rest}>
      {inner}
    </button>
  );
}
