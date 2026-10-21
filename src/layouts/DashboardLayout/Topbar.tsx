import { Bell, Mail, Menu } from 'lucide-react';
import { content } from '../../config/content';
import { useAuth } from '../../hooks/useAuth';
import { useRequest } from '../../hooks/useRequest';
import { dashboardService } from '../../services/workspace.service';
import { Avatar } from '../../components/ui/Avatar/Avatar';
import { IconButton } from '../../components/ui/IconButton/IconButton';
import { SearchBox } from './SearchBox';
import styles from './Topbar.module.css';

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuth();
  const { data: summary } = useRequest(dashboardService.getNotifications);

  return (
    <header className={styles.topbar}>
      <IconButton
        icon={Menu}
        label={content.nav.openMenu}
        className={styles.menu}
        onClick={onMenuClick}
      />
      <SearchBox />
      <div className={styles.actions}>
        <IconButton id="topbar-messages" icon={Mail} label={content.topbar.messages} badge={summary?.messages} />
        <IconButton
          id="topbar-notifications"
          icon={Bell}
          label={content.topbar.notifications}
          badge={summary?.notifications}
        />
        {user && (
          <div className={styles.profile}>
            <Avatar name={user.name} src={user.avatarUrl} />
            <div className={styles.profileText}>
              <span className={styles.profileName}>{user.name}</span>
              <span className={styles.profileEmail}>{user.email}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
