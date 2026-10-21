import { cx, getInitials } from '../../../utils/format';
import styles from './Avatar.module.css';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  return (
    <span className={cx(styles.avatar, styles[size], className)} aria-hidden>
      {src ? <img src={src} alt="" /> : getInitials(name)}
    </span>
  );
}
