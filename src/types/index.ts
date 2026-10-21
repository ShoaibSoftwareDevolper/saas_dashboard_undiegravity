export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type TrendDirection = 'up' | 'down';

export interface StatMetric {
  id: string;
  label: string;
  value: number;
  href: string;
  highlighted?: boolean;
  trend?: {
    value: number;
    direction: TrendDirection;
  };
  caption?: string;
}

export interface AnalyticsPoint {
  label: string;
  value: number;
  isActive: boolean;
}

export type ProjectCategory = 'research' | 'development' | 'marketing' | 'community';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  dueDate: string;
}

export interface CreateProjectPayload {
  title: string;
}

export type MemberStatus = 'completed' | 'in_progress' | 'pending';

export interface TeamMember {
  id: string;
  name: string;
  task: string;
  status: MemberStatus;
  avatarUrl?: string;
}

export interface CreateMemberPayload {
  name: string;
  task: string;
}

export interface ProgressSummary {
  percentage: number;
  label: string;
}

export interface TimeTrackerSession {
  elapsedSeconds: number;
  isRunning: boolean;
}

export interface NotificationSummary {
  messages: number;
  notifications: number;
}

export type SearchResultType = 'project' | 'member';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  href: string;
}

export interface NotificationPreferences {
  emailUpdates: boolean;
  pushAlerts: boolean;
  weeklyDigest: boolean;
  taskReminders: boolean;
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
  role: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
