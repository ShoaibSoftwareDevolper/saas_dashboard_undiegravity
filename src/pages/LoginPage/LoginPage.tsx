import { useRef, useState, type FormEvent, type MouseEvent } from 'react';
import { CircleAlert, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { appConfig } from '../../config/app.config';
import { content } from '../../config/content';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../services/api/api-error';
import type { LoginPayload } from '../../types';
import { EMAIL_PATTERN, MIN_PASSWORD_LENGTH } from '../../utils/validation';
import { Button } from '../../components/ui/Button/Button';
import { Logo } from '../../components/ui/Logo/Logo';
import { TextField } from '../../components/ui/TextField/TextField';
import { HeroBackdrop } from './HeroBackdrop';
import styles from './LoginPage.module.css';

type FieldErrors = Partial<Record<keyof LoginPayload, string>>;

const copy = content.auth;

const validate = ({ email, password }: LoginPayload): FieldErrors => {
  const errors: FieldErrors = {};
  if (!email.trim()) errors.email = copy.validation.emailRequired;
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = copy.validation.emailInvalid;
  if (!password) errors.password = copy.validation.passwordRequired;
  else if (password.length < MIN_PASSWORD_LENGTH) errors.password = copy.validation.passwordShort;
  return errors;
};

const initialValues: LoginPayload = appConfig.api.useMock
  ? { ...appConfig.auth.demoCredentials }
  : { email: '', password: '' };

export function LoginPage() {
  const { login } = useAuth();
  const [values, setValues] = useState<LoginPayload>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  const handleParallax = (event: MouseEvent<HTMLElement>) => {
    const hero = heroRef.current;
    if (!hero) return;
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    hero.style.setProperty('--px', (x * 2).toFixed(3));
    hero.style.setProperty('--py', (y * 2).toFixed(3));
  };

  const resetParallax = () => {
    heroRef.current?.style.setProperty('--px', '0');
    heroRef.current?.style.setProperty('--py', '0');
  };

  const updateField = (field: keyof LoginPayload, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFormError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      return;
    }
    setIsSubmitting(true);
    try {
      await login({ email: values.email.trim(), password: values.password }, remember);
    } catch (error) {
      setFormError(getErrorMessage(error, content.common.error));
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.page} onMouseMove={handleParallax} onMouseLeave={resetParallax}>
      <div className={styles.shell}>
        <section className={styles.formPanel}>
          <Logo size="lg" />
          <div className={styles.heading}>
            <h1 className={styles.title}>{copy.title}</h1>
            <p className={styles.subtitle}>{copy.subtitle}</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <TextField
              id="login-email"
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
              id="login-password"
              label={copy.passwordLabel}
              type={showPassword ? 'text' : 'password'}
              icon={Lock}
              autoComplete="current-password"
              placeholder={copy.passwordPlaceholder}
              value={values.password}
              error={errors.password}
              onChange={(event) => updateField('password', event.target.value)}
              trailing={
                <button
                  type="button"
                  className={styles.toggle}
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? copy.hidePassword : copy.showPassword}
                >
                  {showPassword ? (
                    <EyeOff className={styles.toggleIcon} aria-hidden />
                  ) : (
                    <Eye className={styles.toggleIcon} aria-hidden />
                  )}
                </button>
              }
            />

            <label className={styles.remember}>
              <input
                id="login-remember"
                type="checkbox"
                className={styles.checkbox}
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
              {copy.rememberMe}
            </label>

            {formError && (
              <p className={styles.alert} role="alert">
                <CircleAlert className={styles.alertIcon} aria-hidden />
                {formError}
              </p>
            )}

            <Button id="login-submit" type="submit" size="lg" className={styles.submit} isLoading={isSubmitting}>
              {copy.submit}
            </Button>

            <button type="button" className={styles.forgot}>
              {copy.forgotPassword}
            </button>
          </form>

          {appConfig.api.useMock && (
            <div className={styles.demo}>
              <span className={styles.demoTitle}>{copy.demoHint}</span>
              <span>{appConfig.auth.demoCredentials.email}</span>
              <span>{appConfig.auth.demoCredentials.password}</span>
            </div>
          )}

          <svg className={styles.wave} viewBox="0 0 100 800" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,0 L35,0 C15,140 70,240 90,380 C110,520 20,640 45,800 L0,800 Z" fill="var(--color-surface)" />
          </svg>
        </section>

        <section ref={heroRef} className={styles.hero} aria-hidden>
          <HeroBackdrop />
          <h2 className={styles.heroTitle}>
            {copy.heroTitle.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <p className={styles.heroSubtitle}>{copy.heroSubtitle}</p>
        </section>
      </div>
    </main>
  );
}
