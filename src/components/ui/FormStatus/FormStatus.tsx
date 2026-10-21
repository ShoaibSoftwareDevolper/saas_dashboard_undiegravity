import { CircleAlert, CircleCheck } from 'lucide-react';
import { cx } from '../../../utils/format';
import styles from './FormStatus.module.css';

interface FormStatusProps {
  error?: string | null;
  success?: string | null;
}

export function FormStatus({ error, success }: FormStatusProps) {
  if (error) {
    return (
      <p className={cx(styles.status, styles.error)} role="alert">
        <CircleAlert className={styles.icon} aria-hidden />
        {error}
      </p>
    );
  }
  if (success) {
    return (
      <p className={cx(styles.status, styles.success)} role="status">
        <CircleCheck className={styles.icon} aria-hidden />
        {success}
      </p>
    );
  }
  return null;
}
