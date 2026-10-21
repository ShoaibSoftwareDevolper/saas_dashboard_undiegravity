import { Link } from 'react-router';
import { appConfig } from '../../../config/app.config';
import { routePaths } from '../../../config/routes';
import { cx } from '../../../utils/format';
import styles from './Logo.module.css';

export function Logo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  return (
    <Link to={routePaths.dashboard} className={cx(styles.logo, styles[size])}>
      <img src={appConfig.logo} alt="" className={styles.mark} />
      <span>{appConfig.name}</span>
    </Link>
  );
}
