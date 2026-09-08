export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'partially_refunded';
export type PaymentMethod = 'card' | 'cash_on_delivery' | 'wallet';
export interface PaymentRecord { readonly id:string; readonly paymentNumber:string; readonly orderId:string; readonly orderNumber:string; readonly customerName:string; readonly method:PaymentMethod; readonly amount:number; readonly status:PaymentStatus; readonly createdAt:string; }
export interface PaymentFilters { readonly search:string; readonly status:PaymentStatus|''; readonly method:PaymentMethod|''; readonly period:'all'|'today'|'week'|'month'; readonly page:number; readonly perPage:number; }
export interface PaymentSummary { readonly totalAmount:number; readonly paidAmount:number; readonly pendingAmount:number; readonly refundedAmount:number; readonly paidCount:number; readonly pendingCount:number; readonly refundedCount:number; }
export interface PaymentPage { readonly items:readonly PaymentRecord[]; readonly summary:PaymentSummary; readonly total:number; readonly page:number; readonly perPage:number; }
export const PAYMENT_STATUS_LABELS:Record<PaymentStatus,string>={paid:'مدفوع',pending:'قيد الانتظار',failed:'فشل',partially_refunded:'مسترد جزئيًا'};
export const PAYMENT_METHOD_LABELS:Record<PaymentMethod,string>={card:'بطاقة بنكية',cash_on_delivery:'الدفع عند الاستلام',wallet:'محفظة إلكترونية'};
