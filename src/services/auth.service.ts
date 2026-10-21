import { endpoints } from '../config/endpoints';
import type { AuthResponse, LoginPayload, User } from '../types';
import { httpClient } from './api/http-client';

export const authService = {
  login: (payload: LoginPayload) => httpClient.post<AuthResponse>(endpoints.auth.login, payload),
  me: () => httpClient.get<User>(endpoints.auth.me),
  logout: () => httpClient.post<null>(endpoints.auth.logout),
};
