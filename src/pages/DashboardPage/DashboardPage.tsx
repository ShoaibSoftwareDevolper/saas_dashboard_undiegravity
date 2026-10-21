import { content } from '../../config/content';
import { useRequest } from '../../hooks/useRequest';
import { dashboardService } from '../../services/workspace.service';
import { Card } from '../../components/ui/Card/Card';
import { AnalyticsCard } from '../../features/dashboard/AnalyticsCard/AnalyticsCard';
import { ProgressCard } from '../../features/dashboard/ProgressCard/ProgressCard';
import { StatCard } from '../../features/dashboard/StatCard/StatCard';
import { TimeTrackerCard } from '../../features/dashboard/TimeTrackerCard/TimeTrackerCard';
import { ProjectsCard } from '../../features/dashboard/WorkspaceLists/ProjectsCard';
import { TeamCard } from '../../features/dashboard/WorkspaceLists/TeamCard';
import styles from './DashboardPage.module.css';

const STAT_PLACEHOLDERS = ['stat-a', 'stat-b', 'stat-c'];

export function DashboardPage() {
  const stats = useRequest(dashboardService.getStats);

  return (
    <div className={styles.grid}>
      <h1 className="visually-hidden">{content.dashboard.title}</h1>
      {stats.error && <Card error={stats.error} onRetry={stats.retry} className={styles.title} />}
      {stats.isLoading && STAT_PLACEHOLDERS.map((key) => <Card key={key} isLoading />)}
      {stats.data?.map((stat) => <StatCard key={stat.id} stat={stat} />)}
      <AnalyticsCard className={styles.wide} />
      <ProjectsCard />
      <TeamCard />
      <ProgressCard />
      <TimeTrackerCard />
    </div>
  );
}
