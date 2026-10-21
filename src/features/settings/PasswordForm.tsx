import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, KeyRound, Lock } from 'lucide-react';
import { content } from '../../config/content';
import { useFormSubmit } from '../../hooks/useFormSubmit';
import { settingsService } from '../../services/settings.service';
import { MIN_PASSWORD_LENGTH } from '../../utils/validation';
import { Button } from '../../components/ui/Button/Button';
import { FormStatus } from '../../components/ui/FormStatus/FormStatus';
import { TextField } from '../../components/ui/TextField/TextField';
import styles from './SettingsForm.module.css';

interface PasswordValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

type FieldErrors = Partial<Record<keyof PasswordValues, string>>;

const copy = content.settings.password;
const emptyValues: PasswordValues = { currentPassword: '', newPassword: '', confirmPassword: '' };

const validate = ({ currentPassword, newPassword, confirmPassword }: PasswordValues): FieldErrors => {
  const errors: FieldErrors = {};
  if (!currentPassword) errors.currentPassword = copy.validation.currentRequired;
  if (!newPassword) errors.newPassword = copy.validation.newRequired;
  else if (newPassword.length < MIN_PASSWORD_LENGTH) errors.newPassword = copy.validation.newShort;
  else if (newPassword === currentPassword) errors.newPassword = copy.validation.sameAsCurrent;
  if (newPassword && confirmPassword !== newPassword) errors.confirmPassword = copy.validation.mismatch;
  return errors;
};

export function PasswordForm() {
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isVisible, setIsVisible] = useState(false);
  const { submit, reset, isSubmitting, isSuccess, error } = useFormSubmit();

  const inputType = isVisible ? 'text' : 'password';

  const updateField = (field: keyof PasswordValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    reset();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      return;
    }
    await submit(async () => {
      await settingsService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      setValues(emptyValues);
    });
  };

  const visibilityToggle = (
    <button
      type="button"
      className={styles.toggle}
      onClick={() => setIsVisible((value) => !value)}
      aria-label={isVisible ? copy.hidePassword : copy.showPassword}
    >
      {isVisible ? <EyeOff className={styles.toggleIcon} aria-hidden /> : <Eye className={styles.toggleIcon} aria-hidden />}
    </button>
  );

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.stack}>
        <TextField
          id="password-current"
          label={copy.currentLabel}
          type={inputType}
          icon={Lock}
          autoComplete="current-password"
          placeholder={copy.currentPlaceholder}
          value={values.currentPassword}
          error={errors.currentPassword}
          trailing={visibilityToggle}
          onChange={(event) => updateField('currentPassword', event.target.value)}
        />
        <TextField
          id="password-new"
          label={copy.newLabel}
          type={inputType}
          icon={KeyRound}
          autoComplete="new-password"
          placeholder={copy.newPlaceholder}
          value={values.newPassword}
          error={errors.newPassword}
          onChange={(event) => updateField('newPassword', event.target.value)}
        />
        <TextField
          id="password-confirm"
          label={copy.confirmLabel}
          type={inputType}
          icon={KeyRound}
          autoComplete="new-password"
          placeholder={copy.confirmPlaceholder}
          value={values.confirmPassword}
          error={errors.confirmPassword}
          onChange={(event) => updateField('confirmPassword', event.target.value)}
        />
      </div>
      <div className={styles.actions}>
        <FormStatus error={error} success={isSuccess ? copy.saved : null} />
        <Button id="password-save" type="submit" size="lg" isLoading={isSubmitting}>
          {copy.save}
        </Button>
      </div>
    </form>
  );
}
