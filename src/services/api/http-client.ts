import { appConfig } from '../../config/app.config';
import { ApiError } from './api-error';
import { tokenStorage } from './token-storage';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequest {
  path: string;
  method: HttpMethod;
  body?: unknown;
  query?: Record<string, string>;
  token: string | null;
}

let unauthorizedHandler: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  unauthorizedHandler = handler;
};

const sendHttp = async <T>({ path, method, body, query, token }: ApiRequest): Promise<T> => {
  const url = new URL(`${appConfig.api.baseUrl}${path}`, window.location.origin);
  Object.entries(query ?? {}).forEach(([name, value]) => url.searchParams.set(name, value));

  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const payload: { message?: string } | null = await response.json().catch(() => null);
    throw new ApiError(response.status, payload?.message ?? response.statusText);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

const sendMock = async <T>(payload: ApiRequest): Promise<T> => {
  const { mockAdapter } = await import('../mock/mock-adapter');
  return mockAdapter<T>(payload);
};

const request = async <T>(
  method: HttpMethod,
  path: string,
  options: Pick<ApiRequest, 'body' | 'query'> = {},
): Promise<T> => {
  const payload: ApiRequest = { method, path, token: tokenStorage.get(), ...options };

  try {
    return appConfig.api.useMock ? await sendMock<T>(payload) : await sendHttp<T>(payload);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401 && payload.token) {
      unauthorizedHandler?.();
    }
    throw error;
  }
};

export const httpClient = {
  get: <T>(path: string, query?: Record<string, string>) => request<T>('GET', path, { query }),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, { body }),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, { body }),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, { body }),
  delete: <T>(path: string) => request<T>('DELETE', path),
};
