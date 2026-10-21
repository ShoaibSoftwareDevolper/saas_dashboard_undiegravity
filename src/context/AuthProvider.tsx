import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { setUnauthorizedHandler } from '../services/api/http-client';
import { tokenStorage } from '../services/api/token-storage';
import type { LoginPayload, User } from '../types';
import { AuthContext, type AuthContextValue } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isRestoring, setIsRestoring] = useState(() => Boolean(tokenStorage.get()));

  useEffect(() => {
    setUnauthorizedHandler(() => {
      tokenStorage.clear();
      setUser(null);
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  useEffect(() => {
    if (!tokenStorage.get()) {
      return;
    }
    let active = true;
    authService
      .me()
      .then((profile) => {
        if (active) setUser(profile);
      })
      .catch(() => tokenStorage.clear())
      .finally(() => {
        if (active) setIsRestoring(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (payload: LoginPayload, remember: boolean) => {
    const response = await authService.login(payload);
    tokenStorage.set(response.token, remember);
    setUser(response.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      tokenStorage.clear();
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isRestoring, login, logout, updateUser: setUser }),
    [user, isRestoring, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
