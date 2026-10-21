import { endpoints } from '../config/endpoints';
import type { ChangePasswordPayload, NotificationPreferences, UpdateProfilePayload, User } from '../types';
import { httpClient } from './api/http-client';

export const settingsService = {
  getNotifications: () => httpClient.get<NotificationPreferences>(endpoints.settings.notifications),
  updateNotifications: (payload: NotificationPreferences) =>
    httpClient.put<NotificationPreferences>(endpoints.settings.notifications, payload),
  updateProfile: (payload: UpdateProfilePayload) => httpClient.put<User>(endpoints.settings.profile, payload),
  changePassword: (payload: ChangePasswordPayload) => httpClient.put<null>(endpoints.settings.password, payload),
};
