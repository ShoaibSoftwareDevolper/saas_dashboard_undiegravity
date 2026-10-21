import type { ReactNode } from 'react';
import { RotateCw } from 'lucide-react';
import { content } from '../../../config/content';
import { cx } from '../../../utils/format';
import { Button } from '../Button/Button';
import styles from './Card.module.css';

interface CardProps {
  title?: string;
  action?: ReactNode;
  variant?: 'default' | 'highlight' | 'dark';
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
  children?: ReactNode;
}

export function Card({
  title,
  action,
  variant = 'default',
  isLoading = false,
  error,
  onRetry,
  className,
  children,
}: CardProps) {
  const renderBody = () => {
    if (isLoading) {
      return (
        <div className={styles.skeleton} aria-label={content.common.loading} role="status">
          <span className={styles.skeletonLine} />
          <span className={styles.skeletonLine} />
          <span className={styles.skeletonLine} />
        </div>
      );
    }
    if (error) {
      return (
        <div className={styles.error} role="alert">
          <p>{error}</p>
          {onRetry && (
            <Button variant="outline" size="sm" icon={RotateCw} onClick={onRetry}>
              {content.common.retry}
            </Button>
          )}
        </div>
      );
    }
    return children;
  };

  return (
    <section className={cx(styles.card, styles[variant], className)}>
      {(title || action) && (
        <header className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {action}
        </header>
      )}
      <div className={styles.body}>{renderBody()}</div>
    </section>
  );
}
