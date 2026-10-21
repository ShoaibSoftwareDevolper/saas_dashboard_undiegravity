import { NavLink } from 'react-router';
import { Download, LogOut, X } from 'lucide-react';
import { appConfig } from '../../config/app.config';
import { content } from '../../config/content';
import { navigation } from '../../config/navigation';
import { routePaths } from '../../config/routes';
import { useAuth } from '../../hooks/useAuth';
import { cx } from '../../utils/format';
import { IconButton } from '../../components/ui/IconButton/IconButton';
import { Logo } from '../../components/ui/Logo/Logo';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  onNavigate: () => void;
}

export function Sidebar({ isOpen, onNavigate }: SidebarProps) {
  const { logout } = useAuth();

  return (
    <aside className={cx(styles.sidebar, isOpen && styles.open)}>
      <div className={styles.brand}>
        <Logo />
        <IconButton
          icon={X}
          label={content.nav.closeMenu}
          variant="ghost"
          size="sm"
          className={styles.close}
          onClick={onNavigate}
        />
      </div>

      <nav className={styles.nav} aria-label={content.nav.primary}>
        {navigation.map((group) => (
          <div key={group.id} className={styles.group}>
            <span className={styles.groupLabel}>{group.label}</span>
            {group.items.map(({ id, label, path, icon: Icon }) => (
              <NavLink
                key={id}
                id={`nav-${id}`}
                to={path}
                end={path === routePaths.dashboard}
                onClick={onNavigate}
                className={({ isActive }) => cx(styles.link, isActive && styles.active)}
              >
                <Icon className={styles.icon} aria-hidden />
                {label}
              </NavLink>
            ))}
            {group.id === navigation[navigation.length - 1].id && (
              <button id="nav-logout" type="button" className={styles.link} onClick={logout}>
                <LogOut className={styles.icon} aria-hidden />
                {content.nav.logout}
              </button>
            )}
          </div>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.promo}>
          <img src={appConfig.logo} alt="" className={styles.promoMark} />
          <p className={styles.promoTitle}>{content.promo.title}</p>
          <p className={styles.promoText}>{content.promo.subtitle}</p>
          <a
            id="promo-download"
            href={appConfig.mobileApp.downloadUrl}
            target="_blank"
            rel="noreferrer"
            className={styles.promoAction}
          >
            <Download className={styles.promoIcon} aria-hidden />
            {content.promo.action}
          </a>
        </div>
      </div>
    </aside>
  );
}
