import { appConfig } from '../../config/app.config';

const key = appConfig.auth.tokenStorageKey;

export const tokenStorage = {
  get: () => localStorage.getItem(key) ?? sessionStorage.getItem(key),
  set: (token: string, persist: boolean) => {
    tokenStorage.clear();
    (persist ? localStorage : sessionStorage).setItem(key, token);
  },
  clear: () => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  },
};
