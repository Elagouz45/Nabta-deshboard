export interface AdminEnvironment {
  production: boolean;
  apiBaseUrl: string;
  demoAdmin: { mobile: string; password: string } | null;
  verifiedFeatures: readonly AdminFeature[];
}

export type AdminFeature = 'orders' | 'invoices' | 'payments' | 'shipping' | 'returns' | 'products' | 'inventory' | 'customers' | 'content' | 'settings' | 'procurement' | 'reports';
