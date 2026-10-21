import type { NotificationPreferences } from '../types';

export const notificationPreferenceKeys = [
  'emailUpdates',
  'pushAlerts',
  'weeklyDigest',
  'taskReminders',
] as const satisfies ReadonlyArray<keyof NotificationPreferences>;
