import { useState } from 'react';
import { Plus } from 'lucide-react';
import { content } from '../../../config/content';
import { projectCategoryIcons } from '../../../config/navigation';
import { useRequest } from '../../../hooks/useRequest';
import { projectService } from '../../../services/workspace.service';
import { formatDate } from '../../../utils/format';
import { Button } from '../../../components/ui/Button/Button';
import { Card } from '../../../components/ui/Card/Card';
import { QuickAddForm } from '../../../components/ui/QuickAddForm/QuickAddForm';
import styles from './WorkspaceLists.module.css';

const copy = content.dashboard.projects;

export function ProjectsCard({ className }: { className?: string }) {
  const { data, isLoading, error, retry, mutate } = useRequest(projectService.list);
  const [isAdding, setIsAdding] = useState(false);

  const createProject = async (title: string) => {
    const project = await projectService.create({ title });
    mutate((current) => [project, ...(current ?? [])]);
  };

  return (
    <Card
      title={copy.title}
      className={className}
      isLoading={isLoading}
      error={error}
      onRetry={retry}
      action={
        <Button id="projects-add" variant="outline" size="sm" icon={Plus} onClick={() => setIsAdding(true)}>
          {copy.add}
        </Button>
      }
    >
      {isAdding && (
        <QuickAddForm placeholder={copy.placeholder} onSubmit={createProject} onCancel={() => setIsAdding(false)} />
      )}
      {data?.length ? (
        <ul className={styles.list}>
          {data.map((project) => {
            const Icon = projectCategoryIcons[project.category];
            return (
              <li key={project.id} className={styles.item}>
                <span className={styles.tile}>
                  <Icon className={styles.tileIcon} aria-hidden />
                </span>
                <span className={styles.text}>
                  <span className={styles.title}>{project.title}</span>
                  <span className={styles.meta}>
                    {copy.dueDate}: {formatDate(project.dueDate)}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className={styles.empty}>{copy.empty}</p>
      )}
    </Card>
  );
}
