import {
  BookOpen,
  Calendar,
  ChartColumn,
  CircleHelp,
  FileCode2,
  LayoutDashboard,
  ListTodo,
  Megaphone,
  Settings,
  Search,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { content } from './content';
import { routePaths } from './routes';
import type { ProjectCategory } from '../types';

export type ModuleId = keyof Omit<typeof content.modules, 'connectHint'>;

export interface NavItem {
  id: 'dashboard' | ModuleId;
  label: string;
  path: string;
  icon: LucideIcon;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

export const navigation: NavGroup[] = [
  {
    id: 'menu',
    label: content.nav.menu,
    items: [
      { id: 'dashboard', label: content.nav.items.dashboard, path: routePaths.dashboard, icon: LayoutDashboard },
      { id: 'tasks', label: content.nav.items.tasks, path: routePaths.tasks, icon: ListTodo },
      { id: 'calendar', label: content.nav.items.calendar, path: routePaths.calendar, icon: Calendar },
      { id: 'analytics', label: content.nav.items.analytics, path: routePaths.analytics, icon: ChartColumn },
      { id: 'team', label: content.nav.items.team, path: routePaths.team, icon: Users },
    ],
  },
  {
    id: 'general',
    label: content.nav.general,
    items: [
      { id: 'settings', label: content.nav.items.settings, path: routePaths.settings, icon: Settings },
      { id: 'help', label: content.nav.items.help, path: routePaths.help, icon: CircleHelp },
    ],
  },
];

export const moduleNavItems = navigation
  .flatMap((group) => group.items)
  .filter((item): item is NavItem & { id: ModuleId } => item.id !== 'dashboard');

export const modulePlaceholderItems = moduleNavItems.filter((item) => item.id !== 'settings');

export const projectCategoryIcons: Record<ProjectCategory, LucideIcon> = {
  research: Search,
  development: FileCode2,
  marketing: Megaphone,
  community: BookOpen,
};
