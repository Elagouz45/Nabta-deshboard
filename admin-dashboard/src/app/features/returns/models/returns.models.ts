export type ReturnStatus = 'new' | 'awaiting_receipt' | 'inspecting' | 'approved' | 'rejected';
export type RefundMethod = 'original' | 'wallet' | 'bank';
export interface ReturnRequest { readonly id: string; readonly returnNumber: string; readonly orderId: string; readonly orderNumber: string; readonly customerName: string; readonly productName: string; readonly reason: string; readonly refundAmount: number; readonly status: ReturnStatus; readonly refundMethod: RefundMethod; readonly createdAt: string; }
export interface ReturnFilters { readonly search: string; readonly status: ReturnStatus | ''; readonly refundMethod: RefundMethod | ''; readonly period: 'all' | 'today' | 'week' | 'month'; readonly page: number; readonly perPage: number; }
export interface ReturnsSummary { readonly total: number; readonly awaitingReceipt: number; readonly inspecting: number; readonly refundedAmount: number; readonly refundedCount: number; }
export interface ReturnsPage { readonly items: readonly ReturnRequest[]; readonly summary: ReturnsSummary; readonly total: number; readonly page: number; readonly perPage: number; }
export const RETURN_STATUS_LABELS: Record<ReturnStatus, string> = { new: 'طلب جديد', awaiting_receipt: 'بانتظار الاستلام', inspecting: 'قيد الفحص', approved: 'مقبول', rejected: 'مرفوض' };
