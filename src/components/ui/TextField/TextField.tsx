import { useId, type InputHTMLAttributes, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cx } from '../../../utils/format';
import styles from './TextField.module.css';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
  trailing?: ReactNode;
}

export function TextField({ label, icon: Icon, error, trailing, id, ...rest }: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;

  return (
    <div className={styles.wrapper}>
      <div className={cx(styles.field, error && styles.invalid)}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        {Icon && <Icon className={styles.icon} aria-hidden />}
        <input
          id={inputId}
          className={styles.input}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? messageId : undefined}
          {...rest}
        />
        {trailing}
      </div>
      {error && (
        <p id={messageId} className={styles.message}>
          {error}
        </p>
      )}
    </div>
  );
}
