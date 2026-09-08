export type ReportId = 'sales-analysis' | 'orders' | 'inventory' | 'products' | 'customers';
export interface ReportMetric { readonly label: string; readonly value: string; readonly hint: string; }
export interface ReportRow { readonly id: string; readonly cells: readonly string[]; }
export interface ReportDefinition { readonly id: ReportId; readonly title: string; readonly subtitle: string; readonly headers: readonly string[]; readonly metrics: readonly ReportMetric[]; readonly rows: readonly ReportRow[]; }
