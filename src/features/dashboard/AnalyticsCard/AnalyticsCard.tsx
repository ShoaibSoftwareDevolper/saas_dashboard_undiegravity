import type { CSSProperties } from 'react';
import { content } from '../../../config/content';
import { useRequest } from '../../../hooks/useRequest';
import { dashboardService } from '../../../services/workspace.service';
import { cx } from '../../../utils/format';
import { Card } from '../../../components/ui/Card/Card';
import styles from './AnalyticsCard.module.css';

const BAR_DELAY_STEP_MS = 70;

export function AnalyticsCard({ className }: { className?: string }) {
  const { data, isLoading, error, retry } = useRequest(dashboardService.getAnalytics);
  const max = Math.max(...(data ?? []).map((point) => point.value), 1);

  return (
    <Card
      title={content.dashboard.analytics.title}
      isLoading={isLoading}
      error={error}
      onRetry={retry}
      className={className}
    >
      <div className={styles.chart}>
        {data?.map((point, index) => (
          <div key={`${point.label}-${index}`} className={styles.column}>
            <div className={styles.track}>
              <div
                className={cx(styles.bar, point.isActive ? styles.active : styles.idle)}
                style={
                  {
                    '--bar-height': `${(point.value / max) * 100}%`,
                    '--bar-delay': `${index * BAR_DELAY_STEP_MS}ms`,
                  } as CSSProperties
                }
              >
                <span className={styles.tooltip}>
                  {point.value} {content.dashboard.analytics.unit}
                </span>
              </div>
            </div>
            <span className={styles.label}>{point.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
