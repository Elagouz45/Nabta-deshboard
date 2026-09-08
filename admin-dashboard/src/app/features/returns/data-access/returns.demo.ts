import { ReturnRequest } from '../models/returns.models';
const names = ['أحمد علي', 'سارة خالد', 'محمد عبدالله', 'نورة سعد', 'خالد منصور', 'هدى أمين'];
const products = ['سماد عضوي نباتي', 'بذور طماطم هجينة', 'مبيد حشري طبيعي', 'أصيص زراعي بلاستيكي', 'منشار تقليم أشجار'];
const reasons = ['منتج تالف', 'منتج غير مطابق', 'تغيير الرأي', 'مقاس غير مناسب', 'منتج تالف'];
const statuses = ['new', 'awaiting_receipt', 'inspecting', 'approved', 'rejected'] as const;
const methods = ['original', 'wallet', 'bank'] as const;
export const DEMO_RETURNS: readonly ReturnRequest[] = Array.from({ length: 42 }, (_, index) => ({ id: String(1048 - index), returnNumber: `RET-${1048 - index}`, orderId: String(3021 - index), orderNumber: `ORD-${3021 - index}`, customerName: names[index % names.length], productName: products[index % products.length], reason: reasons[index % reasons.length], refundAmount: index % 5 === 4 ? 0 : 320 + (index % 7) * 130, status: statuses[index % statuses.length], refundMethod: methods[index % methods.length], createdAt: new Date(2026, 8, 7 - Math.floor(index / 3)).toISOString() }));
