import { useState } from 'react';
import { Plus } from 'lucide-react';
import { content } from '../../../config/content';
import { useRequest } from '../../../hooks/useRequest';
import { teamService } from '../../../services/workspace.service';
import { Avatar } from '../../../components/ui/Avatar/Avatar';
import { StatusBadge } from '../../../components/ui/Badge/StatusBadge';
import { Button } from '../../../components/ui/Button/Button';
import { Card } from '../../../components/ui/Card/Card';
import { QuickAddForm } from '../../../components/ui/QuickAddForm/QuickAddForm';
import styles from './WorkspaceLists.module.css';

const copy = content.dashboard.team;

export function TeamCard({ className }: { className?: string }) {
  const { data, isLoading, error, retry, mutate } = useRequest(teamService.list);
  const [isAdding, setIsAdding] = useState(false);

  const createMember = async (name: string) => {
    const member = await teamService.create({ name, task: copy.defaultTask });
    mutate((current) => [member, ...(current ?? [])]);
  };

  return (
    <Card
      title={copy.title}
      className={className}
      isLoading={isLoading}
      error={error}
      onRetry={retry}
      action={
        <Button id="team-add" variant="outline" size="sm" icon={Plus} onClick={() => setIsAdding(true)}>
          {copy.add}
        </Button>
      }
    >
      {isAdding && (
        <QuickAddForm placeholder={copy.placeholder} onSubmit={createMember} onCancel={() => setIsAdding(false)} />
      )}
      {data?.length ? (
        <ul className={styles.list}>
          {data.map((member) => (
            <li key={member.id} className={styles.item}>
              <Avatar name={member.name} src={member.avatarUrl} size="lg" />
              <span className={styles.text}>
                <span className={styles.title}>{member.name}</span>
                <span className={styles.task}>{member.task}</span>
              </span>
              <StatusBadge status={member.status} />
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>{copy.empty}</p>
      )}
    </Card>
  );
}
