export const appConfig = {
  name: 'Onixpas',
  logo: '/Glossy%20Orange%20Orbit%20Emblem.png',
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
    useMock: import.meta.env.VITE_USE_MOCK_API !== 'false',
    mockLatency: Number(import.meta.env.VITE_MOCK_LATENCY ?? 600),
  },
  auth: {
    tokenStorageKey: 'onixpas.token',
    demoCredentials: {
      email: 'demo@onixpas.com',
      password: 'onixpas123',
    },
  },
  search: {
    debounceMs: 300,
    minLength: 2,
  },
  mobileApp: {
    downloadUrl: 'https://onixpas.com/download',
  },
  locale: 'en-US',
} as const;
