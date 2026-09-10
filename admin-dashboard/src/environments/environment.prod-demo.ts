import { AdminEnvironment } from './environment.model';

export const environment: AdminEnvironment = {
  production: true,
  apiBaseUrl: '/api/v1',
  demoAdmin: { mobile: '01090523549', password: '123456' },
  verifiedFeatures: [
    'orders',
    'invoices',
    'payments',
    'shipping',
    'returns',
    'products',
    'inventory',
    'customers',
    'content',
    'settings',
    'procurement',
    'reports',
  ],
} as const;
