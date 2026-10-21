import { content } from '../../../config/content';
import type { MemberStatus } from '../../../types';
import { cx } from '../../../utils/format';
import styles from './Badge.module.css';

export function StatusBadge({ status }: { status: MemberStatus }) {
  return <span className={cx(styles.badge, styles[status])}>{content.dashboard.team.status[status]}</span>;
}
