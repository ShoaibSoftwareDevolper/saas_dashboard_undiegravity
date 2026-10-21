import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { content } from '../../../config/content';
import type { StatMetric } from '../../../types';
import { cx } from '../../../utils/format';
import { Card } from '../../../components/ui/Card/Card';
import { IconButton } from '../../../components/ui/IconButton/IconButton';
import styles from './StatCard.module.css';

export function StatCard({ stat }: { stat: StatMetric }) {
  return (
    <Card variant={stat.highlighted ? 'highlight' : 'default'}>
      <div className={styles.body}>
        <div className={styles.header}>
          <h2 className={styles.label}>{stat.label}</h2>
          <IconButton
            to={stat.href}
            icon={ArrowUpRight}
            label={`${content.dashboard.viewDetails} ${stat.label}`}
            variant={stat.highlighted ? 'surface' : 'outline'}
            size="sm"
          />
        </div>
        <p className={styles.value}>{stat.value}</p>
        {stat.trend && (
          <p className={cx(styles.trend, styles[stat.trend.direction])}>
            <span className={styles.trendValue}>
              {stat.trend.value}
              <TrendingUp className={styles.trendIcon} aria-hidden />
            </span>
            {content.dashboard.trend[stat.trend.direction]}
          </p>
        )}
        {stat.caption && <p className={styles.caption}>{stat.caption}</p>}
      </div>
    </Card>
  );
}
