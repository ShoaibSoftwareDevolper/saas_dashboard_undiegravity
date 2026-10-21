import { useState, type FormEvent } from 'react';
import { BriefcaseBusiness, Mail, UserRound } from 'lucide-react';
import { content } from '../../config/content';
import { useFormSubmit } from '../../hooks/useFormSubmit';
import { settingsService } from '../../services/settings.service';
import type { UpdateProfilePayload, User } from '../../types';
import { EMAIL_PATTERN } from '../../utils/validation';
import { Button } from '../../components/ui/Button/Button';
import { FormStatus } from '../../components/ui/FormStatus/FormStatus';
import { TextField } from '../../components/ui/TextField/TextField';
import styles from './SettingsForm.module.css';

type FieldErrors = Partial<Record<keyof UpdateProfilePayload, string>>;

interface ProfileFormProps {
  user: User;
  onSaved: (user: User) => void;
}

const copy = content.settings.profile;

const toValues = ({ name, email, role }: User): UpdateProfilePayload => ({ name, email, role });

const validate = ({ name, email, role }: UpdateProfilePayload): FieldErrors => {
  const errors: FieldErrors = {};
  if (!name.trim()) errors.name = copy.validation.nameRequired;
  if (!email.trim()) errors.email = copy.validation.emailRequired;
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = copy.validation.emailInvalid;
  if (!role.trim()) errors.role = copy.validation.roleRequired;
  return errors;
};

export function ProfileForm({ user, onSaved }: ProfileFormProps) {
  const [values, setValues] = useState(() => toValues(user));
  const [errors, setErrors] = useState<FieldErrors>({});
  const { submit, reset, isSubmitting, isSuccess, error } = useFormSubmit();

  const saved = toValues(user);
  const isDirty = (Object.keys(values) as Array<keyof UpdateProfilePayload>).some((key) => values[key] !== saved[key]);

  const updateField = (field: keyof UpdateProfilePayload, value: string) => {
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
    const payload: UpdateProfilePayload = {
      name: values.name.trim(),
      email: values.email.trim(),
      role: values.role.trim(),
    };
    await submit(async () => {
      const updated = await settingsService.updateProfile(payload);
      setValues(toValues(updated));
      onSaved(updated);
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.fields}>
        <TextField
          id="profile-name"
          label={copy.nameLabel}
          icon={UserRound}
          autoComplete="name"
          placeholder={copy.namePlaceholder}
          value={values.name}
          error={errors.name}
          onChange={(event) => updateField('name', event.target.value)}
        />
        <TextField
          id="profile-email"
          label={copy.emailLabel}
          type="email"
          icon={Mail}
          autoComplete="email"
          placeholder={copy.emailPlaceholder}
          value={values.email}
          error={errors.email}
          onChange={(event) => updateField('email', event.target.value)}
        />
        <TextField
          id="profile-role"
          label={copy.roleLabel}
          icon={BriefcaseBusiness}
          autoComplete="organization-title"
          placeholder={copy.rolePlaceholder}
          value={values.role}
          error={errors.role}
          onChange={(event) => updateField('role', event.target.value)}
        />
      </div>
      <div className={styles.actions}>
        <FormStatus error={error} success={isSuccess ? copy.saved : null} />
        <Button id="profile-save" type="submit" size="lg" isLoading={isSubmitting} disabled={!isDirty}>
          {copy.save}
        </Button>
      </div>
    </form>
  );
}
