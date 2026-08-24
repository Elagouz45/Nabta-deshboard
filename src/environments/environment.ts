import { AppEnvironment } from './environment.model';

export const environment: AppEnvironment = {
  production: false,
  useMockApi: true,
  apiBaseUrl: '/api/v1',
  enableDebugLogs: true,
  siteUrl: 'http://localhost:4200',
};
