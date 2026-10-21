import { useEffect, useState } from 'react';
import { Pause, Play, Square } from 'lucide-react';
import { content } from '../../../config/content';
import { useRequest } from '../../../hooks/useRequest';
import { dashboardService } from '../../../services/workspace.service';
import type { TimeTrackerSession } from '../../../types';
import { cx, formatDuration } from '../../../utils/format';
import { Card } from '../../../components/ui/Card/Card';
import { IconButton } from '../../../components/ui/IconButton/IconButton';
import styles from './TimeTrackerCard.module.css';

const TICK_MS = 1000;
const copy = content.dashboard.tracker;

function TrackerClock({ session }: { session: TimeTrackerSession }) {
  const [seconds, setSeconds] = useState(session.elapsedSeconds);
  const [isRunning, setIsRunning] = useState(session.isRunning);

  useEffect(() => {
    if (!isRunning) {
      return;
    }
    const timer = setInterval(() => setSeconds((value) => value + 1), TICK_MS);
    return () => clearInterval(timer);
  }, [isRunning]);

  const stop = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  return (
    <div className={cx(styles.tracker, isRunning && styles.running)}>
      <time className={styles.time} aria-live="off">
        {formatDuration(seconds)}
      </time>
      <div className={styles.controls}>
        <IconButton
          id="tracker-toggle"
          icon={isRunning ? Pause : Play}
          label={isRunning ? copy.pause : copy.start}
          variant="light"
          onClick={() => setIsRunning((value) => !value)}
        />
        <IconButton id="tracker-stop" icon={Square} label={copy.stop} variant="brand" onClick={stop} />
      </div>
    </div>
  );
}

export function TimeTrackerCard({ className }: { className?: string }) {
  const { data, isLoading, error, retry } = useRequest(dashboardService.getTimeTracker);

  return (
    <Card variant="dark" title={copy.title} isLoading={isLoading} error={error} onRetry={retry} className={className}>
      {data && <TrackerClock session={data} />}
    </Card>
  );
}
