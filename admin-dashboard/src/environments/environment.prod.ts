import { AdminEnvironment } from './environment.model';

export const environment: AdminEnvironment = {
  production: true,
  apiBaseUrl: '/api/v1',
  demoAdmin: null,
  verifiedFeatures: [],
} as const;
