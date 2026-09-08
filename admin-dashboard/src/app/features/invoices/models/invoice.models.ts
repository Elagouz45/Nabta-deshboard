export type InvoicePaymentStatus = 'paid' | 'collecting' | 'partially_paid' | 'refunded';
export type InvoiceSortField = 'invoiceNumber' | 'issuedAt' | 'total' | 'paymentStatus';
export type SortDirection = 'asc' | 'desc';

export interface InvoiceItem {
  readonly id: string;
  readonly productName: string;
  readonly variant: string | null;
  readonly sku: string;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly discount: number;
  readonly tax: number;
  readonly total: number;
}

export interface Invoice {
  readonly id: string;
  readonly invoiceNumber: string;
  readonly orderId: string;
  readonly orderNumber: string;
  readonly customerName: string;
  readonly customerMobile: string;
  readonly branchId: string;
  readonly branchName: string;
  readonly issuedAt: string;
  readonly paymentStatus: InvoicePaymentStatus;
  readonly paymentMethod: string;
  readonly transactionReference: string | null;
  readonly subtotal: number;
  readonly discount: number;
  readonly tax: number;
  readonly shipping: number;
  readonly total: number;
  readonly paidAmount: number;
  readonly refundedAmount: number;
  readonly remainingAmount: number;
  readonly items: readonly InvoiceItem[];
}

export interface InvoiceQuery {
  readonly search: string;
  readonly paymentStatus: InvoicePaymentStatus | '';
  readonly branchId: string;
  readonly dateFrom: string;
  readonly dateTo: string;
  readonly sort: InvoiceSortField;
  readonly direction: SortDirection;
  readonly page: number;
  readonly perPage: number;
}

export interface InvoiceSummary { readonly total: number; readonly paid: number; readonly collecting: number; readonly refunded: number; }
export interface InvoicePage { readonly items: readonly Invoice[]; readonly summary: InvoiceSummary; readonly page: number; readonly perPage: number; readonly total: number; }

export const INVOICE_STATUS_LABELS: Record<InvoicePaymentStatus, string> = {
  paid: 'مدفوعة', collecting: 'قيد التحصيل', partially_paid: 'مدفوعة جزئيًا', refunded: 'مستردة',
};
