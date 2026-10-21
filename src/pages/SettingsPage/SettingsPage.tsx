import { content } from '../../config/content';
import { useAuth } from '../../hooks/useAuth';
import { useRequest } from '../../hooks/useRequest';
import { settingsService } from '../../services/settings.service';
import { Card } from '../../components/ui/Card/Card';
import { NotificationsForm } from '../../features/settings/NotificationsForm';
import { PasswordForm } from '../../features/settings/PasswordForm';
import { ProfileForm } from '../../features/settings/ProfileForm';
import styles from './SettingsPage.module.css';

const copy = content.settings;

export function SettingsPage() {
  const { user, updateUser } = useAuth();
  const notifications = useRequest(settingsService.getNotifications);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{copy.title}</h1>
        <p className={styles.subtitle}>{copy.subtitle}</p>
      </header>
      <div className={styles.grid}>
        <Card title={copy.profile.title} className={styles.wide}>
          {user && <ProfileForm user={user} onSaved={updateUser} />}
        </Card>
        <Card
          title={copy.notifications.title}
          isLoading={notifications.isLoading}
          error={notifications.error}
          onRetry={notifications.retry}
        >
          {notifications.data && <NotificationsForm initial={notifications.data} />}
        </Card>
        <Card title={copy.password.title}>
          <PasswordForm />
        </Card>
      </div>
    </div>
  );
}
