import { appConfig } from '../../../config/app.config';
import { content } from '../../../config/content';
import styles from './FullScreenLoader.module.css';

export function FullScreenLoader() {
  return (
    <div className={styles.loader} role="status">
      <img src={appConfig.logo} alt="" className={styles.mark} />
      <p>{content.auth.sessionLoading}</p>
    </div>
  );
}
