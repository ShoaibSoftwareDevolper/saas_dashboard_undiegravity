import { routePaths } from '../../config/routes';
import type {
  AnalyticsPoint,
  NotificationPreferences,
  NotificationSummary,
  Project,
  ProgressSummary,
  StatMetric,
  TeamMember,
  TimeTrackerSession,
  User,
} from '../../types';

const DAY_MS = 86_400_000;

export const daysFromNow = (days: number) => new Date(Date.now() + days * DAY_MS).toISOString();

export const mockAccounts: Array<{ password: string; user: User }> = [
  {
    password: 'onixpas123',
    user: {
      id: 'usr_01',
      name: 'Costsco Andrei',
      email: 'demo@onixpas.com',
      role: 'Product Manager',
    },
  },
];

export const mockStats: StatMetric[] = [
  {
    id: 'total',
    label: 'Total Projects',
    value: 15,
    href: routePaths.tasks,
    highlighted: true,
    trend: { value: 3, direction: 'up' },
  },
  {
    id: 'ended',
    label: 'Ended Projects',
    value: 10,
    href: routePaths.analytics,
    trend: { value: 5, direction: 'up' },
  },
  {
    id: 'pending',
    label: 'Pending Projects',
    value: 2,
    href: routePaths.tasks,
    caption: 'On discuss',
  },
];

export const mockAnalytics: AnalyticsPoint[] = [
  { label: 'S', value: 46, isActive: false },
  { label: 'M', value: 72, isActive: true },
  { label: 'T', value: 64, isActive: true },
  { label: 'W', value: 88, isActive: true },
  { label: 'T', value: 58, isActive: false },
  { label: 'F', value: 76, isActive: false },
  { label: 'S', value: 52, isActive: false },
];

export const mockProjects: Project[] = [
  { id: 'prj_01', title: 'Analyze the status of the website', category: 'research', dueDate: daysFromNow(2) },
  { id: 'prj_02', title: 'Continue building the website', category: 'development', dueDate: daysFromNow(4) },
  { id: 'prj_03', title: 'Create a launch post for the community', category: 'marketing', dueDate: daysFromNow(6) },
  { id: 'prj_04', title: 'New open source projects to check out', category: 'community', dueDate: daysFromNow(9) },
];

export const mockTeam: TeamMember[] = [
  { id: 'mem_01', name: 'Alex Smitt', task: 'Working on CRM Flow Setup', status: 'in_progress' },
  { id: 'mem_02', name: 'John Miller', task: 'Working on CRM Flow Setup', status: 'completed' },
  { id: 'mem_03', name: 'Sara Collins', task: 'Reviewing onboarding screens', status: 'pending' },
];

export const mockProgress: ProgressSummary = {
  percentage: 41,
  label: 'Project Ended',
};

export const mockTimeTracker: TimeTrackerSession = {
  elapsedSeconds: 5109,
  isRunning: true,
};

export const mockNotifications: NotificationSummary = {
  messages: 3,
  notifications: 5,
};

export const mockNotificationPreferences: NotificationPreferences = {
  emailUpdates: true,
  pushAlerts: true,
  weeklyDigest: false,
  taskReminders: true,
};
