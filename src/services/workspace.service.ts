import { endpoints } from '../config/endpoints';
import type {
  AnalyticsPoint,
  CreateMemberPayload,
  CreateProjectPayload,
  NotificationSummary,
  Project,
  ProgressSummary,
  SearchResult,
  StatMetric,
  TeamMember,
  TimeTrackerSession,
} from '../types';
import { httpClient } from './api/http-client';

export const dashboardService = {
  getStats: () => httpClient.get<StatMetric[]>(endpoints.dashboard.stats),
  getAnalytics: () => httpClient.get<AnalyticsPoint[]>(endpoints.dashboard.analytics),
  getProgress: () => httpClient.get<ProgressSummary>(endpoints.dashboard.progress),
  getTimeTracker: () => httpClient.get<TimeTrackerSession>(endpoints.timeTracker),
  getNotifications: () => httpClient.get<NotificationSummary>(endpoints.notifications),
  search: (term: string) => httpClient.get<SearchResult[]>(endpoints.search, { q: term }),
};

export const projectService = {
  list: () => httpClient.get<Project[]>(endpoints.projects),
  create: (payload: CreateProjectPayload) => httpClient.post<Project>(endpoints.projects, payload),
};

export const teamService = {
  list: () => httpClient.get<TeamMember[]>(endpoints.team),
  create: (payload: CreateMemberPayload) => httpClient.post<TeamMember>(endpoints.team, payload),
};
