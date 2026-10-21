import { useState, type FormEvent } from 'react';
import { Check, X } from 'lucide-react';
import { content } from '../../../config/content';
import { getErrorMessage } from '../../../services/api/api-error';
import { IconButton } from '../IconButton/IconButton';
import styles from './QuickAddForm.module.css';

interface QuickAddFormProps {
  placeholder: string;
  onSubmit: (value: string) => Promise<void>;
  onCancel: () => void;
}

export function QuickAddForm({ placeholder, onSubmit, onCancel }: QuickAddFormProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!value.trim()) {
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(value.trim());
      setValue('');
      onCancel();
    } catch (submitError) {
      setError(getErrorMessage(submitError, content.common.error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          value={value}
          placeholder={placeholder}
          aria-label={placeholder}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => event.key === 'Escape' && onCancel()}
          disabled={isSubmitting}
          autoFocus
        />
        <IconButton icon={X} label={content.common.cancel} variant="ghost" size="sm" onClick={onCancel} />
        <IconButton
          icon={Check}
          label={content.common.save}
          variant="brand"
          size="sm"
          type="submit"
          disabled={isSubmitting || !value.trim()}
        />
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </>
  );
}
