import { appConfig } from '../../config/app.config';
import { endpoints } from '../../config/endpoints';
import { routePaths } from '../../config/routes';
import { notificationPreferenceKeys } from '../../config/settings';
import type {
  AuthResponse,
  ChangePasswordPayload,
  CreateMemberPayload,
  CreateProjectPayload,
  LoginPayload,
  NotificationPreferences,
  Project,
  SearchResult,
  TeamMember,
  UpdateProfilePayload,
  User,
} from '../../types';
import { MIN_PASSWORD_LENGTH } from '../../utils/validation';
import { ApiError } from '../api/api-error';
import type { ApiRequest } from '../api/http-client';
import {
  daysFromNow,
  mockAccounts,
  mockAnalytics,
  mockNotificationPreferences,
  mockNotifications,
  mockProgress,
  mockProjects,
  mockStats,
  mockTeam,
  mockTimeTracker,
} from './mock-data';

type Handler = (request: ApiRequest) => unknown;

const TOKEN_PREFIX = 'mock.';

const db = {
  projects: [...mockProjects],
  team: [...mockTeam],
  preferences: { ...mockNotificationPreferences },
};

const createId = (prefix: string) => `${prefix}_${crypto.randomUUID().slice(0, 8)}`;

const findAccount = (token: string | null) => {
  const userId = token?.startsWith(TOKEN_PREFIX) ? atob(token.slice(TOKEN_PREFIX.length)) : null;
  const account = mockAccounts.find((item) => item.user.id === userId);
  if (!account) {
    throw new ApiError(401, 'Your session has expired. Please sign in again.');
  }
  return account;
};

const authenticate = (token: string | null): User => findAccount(token).user;

const secured =
  (resolve: Handler): Handler =>
  (request) => {
    authenticate(request.token);
    return resolve(request);
  };

const requireText = (value: unknown, field: string) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new ApiError(422, `${field} is required`);
  }
  return value.trim();
};

const parsePreferences = (body: unknown): NotificationPreferences => {
  const source = (body ?? {}) as Record<string, unknown>;
  const entries = notificationPreferenceKeys.map((key) => {
    const value = source[key];
    if (typeof value !== 'boolean') {
      throw new ApiError(422, `${key} must be true or false`);
    }
    return [key, value] as const;
  });
  return Object.fromEntries(entries) as unknown as NotificationPreferences;
};

const handlers: Record<string, Handler> = {
  [`POST ${endpoints.auth.login}`]: ({ body }): AuthResponse => {
    const { email, password } = body as LoginPayload;
    const account = mockAccounts.find(
      (item) => item.user.email.toLowerCase() === email.trim().toLowerCase() && item.password === password,
    );
    if (!account) {
      throw new ApiError(401, 'Invalid email or password');
    }
    return { token: `${TOKEN_PREFIX}${btoa(account.user.id)}`, user: account.user };
  },
  [`GET ${endpoints.auth.me}`]: ({ token }) => authenticate(token),
  [`POST ${endpoints.auth.logout}`]: () => null,
  [`GET ${endpoints.dashboard.stats}`]: secured(() => mockStats),
  [`GET ${endpoints.dashboard.analytics}`]: secured(() => mockAnalytics),
  [`GET ${endpoints.dashboard.progress}`]: secured(() => mockProgress),
  [`GET ${endpoints.timeTracker}`]: secured(() => mockTimeTracker),
  [`GET ${endpoints.notifications}`]: secured(() => mockNotifications),
  [`GET ${endpoints.settings.notifications}`]: secured(() => db.preferences),
  [`PUT ${endpoints.settings.notifications}`]: secured(({ body }) => {
    db.preferences = parsePreferences(body);
    return db.preferences;
  }),
  [`PUT ${endpoints.settings.profile}`]: ({ token, body }): User => {
    const account = findAccount(token);
    const payload = body as UpdateProfilePayload;
    const name = requireText(payload.name, 'Full name');
    const email = requireText(payload.email, 'Email');
    const role = requireText(payload.role, 'Job title');
    const isTaken = mockAccounts.some(
      (item) => item !== account && item.user.email.toLowerCase() === email.toLowerCase(),
    );
    if (isTaken) {
      throw new ApiError(409, 'This email is already in use');
    }
    account.user = { ...account.user, name, email, role };
    return account.user;
  },
  [`PUT ${endpoints.settings.password}`]: ({ token, body }) => {
    const account = findAccount(token);
    const { currentPassword, newPassword } = body as ChangePasswordPayload;
    if (account.password !== currentPassword) {
      throw new ApiError(422, 'Current password is incorrect');
    }
    if (typeof newPassword !== 'string' || newPassword.length < MIN_PASSWORD_LENGTH) {
      throw new ApiError(422, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    }
    account.password = newPassword;
    return null;
  },
  [`GET ${endpoints.projects}`]: secured(() => db.projects),
  [`POST ${endpoints.projects}`]: secured(({ body }) => {
    const project: Project = {
      id: createId('prj'),
      title: requireText((body as CreateProjectPayload).title, 'Title'),
      category: 'research',
      dueDate: daysFromNow(7),
    };
    db.projects = [project, ...db.projects];
    return project;
  }),
  [`GET ${endpoints.team}`]: secured(() => db.team),
  [`POST ${endpoints.team}`]: secured(({ body }) => {
    const payload = body as CreateMemberPayload;
    const member: TeamMember = {
      id: createId('mem'),
      name: requireText(payload.name, 'Name'),
      task: requireText(payload.task, 'Task'),
      status: 'pending',
    };
    db.team = [member, ...db.team];
    return member;
  }),
  [`GET ${endpoints.search}`]: secured(({ query }): SearchResult[] => {
    const term = (query?.q ?? '').trim().toLowerCase();
    if (!term) {
      return [];
    }
    const projects: SearchResult[] = db.projects
      .filter((item) => item.title.toLowerCase().includes(term))
      .map((item) => ({ id: item.id, type: 'project', title: item.title, subtitle: item.category, href: routePaths.tasks }));
    const members: SearchResult[] = db.team
      .filter((item) => item.name.toLowerCase().includes(term))
      .map((item) => ({ id: item.id, type: 'member', title: item.name, subtitle: item.task, href: routePaths.team }));
    return [...projects, ...members];
  }),
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockAdapter = async <T>(request: ApiRequest): Promise<T> => {
  await wait(appConfig.api.mockLatency);
  const handler = handlers[`${request.method} ${request.path}`];
  if (!handler) {
    throw new ApiError(404, `No mock handler for ${request.method} ${request.path}`);
  }
  return structuredClone(handler(request)) as T;
};
