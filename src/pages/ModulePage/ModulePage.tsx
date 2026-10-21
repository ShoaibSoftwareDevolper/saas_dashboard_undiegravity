import { content } from '../../config/content';
import type { ModuleId, NavItem } from '../../config/navigation';
import styles from './ModulePage.module.css';

export function ModulePage({ item }: { item: NavItem & { id: ModuleId } }) {
  const Icon = item.icon;

  return (
    <section className={styles.module}>
      <span className={styles.iconWrap}>
        <Icon className={styles.icon} aria-hidden />
      </span>
      <h1 className={styles.title}>{item.label}</h1>
      <p className={styles.description}>{content.modules[item.id]}</p>
      <p className={styles.hint}>{content.modules.connectHint}</p>
    </section>
  );
}
