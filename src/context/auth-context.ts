import { createContext } from 'react';
import type { LoginPayload, User } from '../types';

export interface AuthContextValue {
  user: User | null;
  isRestoring: boolean;
  login: (payload: LoginPayload, remember: boolean) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
