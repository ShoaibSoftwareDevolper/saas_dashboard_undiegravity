export const endpoints = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  dashboard: {
    stats: '/dashboard/stats',
    analytics: '/dashboard/analytics',
    progress: '/dashboard/progress',
  },
  settings: {
    profile: '/settings/profile',
    notifications: '/settings/notifications',
    password: '/settings/password',
  },
  projects: '/projects',
  team: '/team',
  timeTracker: '/time-tracker',
  notifications: '/notifications/summary',
  search: '/search',
} as const;
