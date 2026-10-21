import { useState, type FormEvent } from 'react';
import { content } from '../../config/content';
import { notificationPreferenceKeys } from '../../config/settings';
import { useFormSubmit } from '../../hooks/useFormSubmit';
import { settingsService } from '../../services/settings.service';
import type { NotificationPreferences } from '../../types';
import { Button } from '../../components/ui/Button/Button';
import { FormStatus } from '../../components/ui/FormStatus/FormStatus';
import { Toggle } from '../../components/ui/Toggle/Toggle';
import styles from './SettingsForm.module.css';

const copy = content.settings.notifications;

export function NotificationsForm({ initial }: { initial: NotificationPreferences }) {
  const [saved, setSaved] = useState(initial);
  const [values, setValues] = useState(initial);
  const { submit, reset, isSubmitting, isSuccess, error } = useFormSubmit();

  const isDirty = notificationPreferenceKeys.some((key) => values[key] !== saved[key]);

  const updateOption = (key: keyof NotificationPreferences, checked: boolean) => {
    setValues((current) => ({ ...current, [key]: checked }));
    reset();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submit(async () => {
      const updated = await settingsService.updateNotifications(values);
      setSaved(updated);
      setValues(updated);
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.toggles}>
        {notificationPreferenceKeys.map((key) => (
          <Toggle
            key={key}
            id={`notifications-${key}`}
            label={copy.options[key].label}
            description={copy.options[key].description}
            checked={values[key]}
            disabled={isSubmitting}
            onChange={(checked) => updateOption(key, checked)}
          />
        ))}
      </div>
      <div className={styles.actions}>
        <FormStatus error={error} success={isSuccess ? copy.saved : null} />
        <Button id="notifications-save" type="submit" size="lg" isLoading={isSubmitting} disabled={!isDirty}>
          {copy.save}
        </Button>
      </div>
    </form>
  );
}
