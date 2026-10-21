import { useId, type CSSProperties } from 'react';
import { content } from '../../../config/content';
import { useRequest } from '../../../hooks/useRequest';
import { dashboardService } from '../../../services/workspace.service';
import { Card } from '../../../components/ui/Card/Card';
import styles from './ProgressCard.module.css';

const VIEWBOX_WIDTH = 220;
const VIEWBOX_HEIGHT = 125;
const STROKE = 34;
const RADIUS = (VIEWBOX_WIDTH - STROKE) / 2;
const BASELINE = VIEWBOX_HEIGHT - 5;
const ARC_PATH = `M ${STROKE / 2} ${BASELINE} A ${RADIUS} ${RADIUS} 0 0 1 ${VIEWBOX_WIDTH - STROKE / 2} ${BASELINE}`;
const PATTERN_SIZE = 6;

export function ProgressCard({ className }: { className?: string }) {
  const { data, isLoading, error, retry } = useRequest(dashboardService.getProgress);
  const id = useId();
  const gradientId = `${id}-gradient`;
  const patternId = `${id}-pattern`;
  const value = Math.min(Math.max(data?.percentage ?? 0, 0), 100);

  return (
    <Card isLoading={isLoading} error={error} onRetry={retry} className={className}>
      <div className={styles.gauge} role="img" aria-label={`${content.dashboard.progress.title} ${value}%`}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          style={{ '--gauge-stroke': STROKE, '--gauge-value': value } as CSSProperties}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" className={styles.stopStart} />
              <stop offset="100%" className={styles.stopEnd} />
            </linearGradient>
            <pattern id={patternId} width={PATTERN_SIZE} height={PATTERN_SIZE} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width={PATTERN_SIZE} height={PATTERN_SIZE} className={styles.patternBg} />
              <line x1="0" y1="0" x2="0" y2={PATTERN_SIZE} className={styles.patternLine} />
            </pattern>
          </defs>
          <path d={ARC_PATH} className={styles.track} stroke={`url(#${patternId})`} pathLength={100} />
          <path d={ARC_PATH} className={styles.progress} stroke={`url(#${gradientId})`} pathLength={100} />
        </svg>
        <div className={styles.summary}>
          <span className={styles.value}>{value}%</span>
          <span className={styles.label}>{data?.label}</span>
        </div>
      </div>
    </Card>
  );
}
