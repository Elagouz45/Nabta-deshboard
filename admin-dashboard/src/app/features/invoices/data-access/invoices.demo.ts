import { Invoice } from '../models/invoice.models';

const names = ['مزارع الخير', 'شركة النيل للتنمية الزراعية', 'أحمد محمود علي', 'مزارع السعادة', 'شركة الدلتا الزراعية', 'محمد إبراهيم حسن', 'التعاون الزراعي', 'روضة النخيل', 'أرض الخير', 'حدائق الوادي', 'مؤسسة الحصاد', 'بستان الشرق'];
const branches = [{ id: 'cairo', name: 'فرع القاهرة' }, { id: 'giza', name: 'مخزن الجيزة' }, { id: 'alex', name: 'فرع الإسكندرية' }];
const statuses = ['paid', 'collecting', 'partially_paid', 'paid', 'refunded', 'paid', 'collecting'] as const;

export const DEMO_INVOICES: readonly Invoice[] = Array.from({ length: 32 }, (_, index) => {
  const total = 3200 + ((index * 1370) % 12600);
  const status = statuses[index % statuses.length];
  const branch = branches[index % branches.length];
  const paidAmount = status === 'paid' ? total : status === 'partially_paid' ? Math.round(total * .55) : status === 'refunded' ? 0 : 0;
  return {
    id: String(1284 - index), invoiceNumber: `INV-${1284 - index}`, orderId: String(5639 - index), orderNumber: `ORD-${5639 - index}`,
    customerName: names[index % names.length], customerMobile: `010${String(90523549 + index).padStart(8, '0')}`,
    branchId: branch.id, branchName: branch.name, issuedAt: new Date(2026, 8, 3 - index).toISOString(), paymentStatus: status,
    paymentMethod: index % 2 ? 'الدفع عند الاستلام' : 'بطاقة بنكية', transactionReference: index % 2 ? null : `TX-${9000 + index}`,
    subtotal: total - 300, discount: 100, tax: 0, shipping: 400, total, paidAmount,
    refundedAmount: status === 'refunded' ? total : 0, remainingAmount: status === 'collecting' ? total : status === 'partially_paid' ? total - paidAmount : 0,
    items: [{ id: `item-${index}`, productName: index % 2 ? 'سماد NPK المتوازن' : 'رشاشة ظهر يدوية', variant: index % 2 ? 'عبوة 20 كجم' : '16 لتر', sku: `SKU-${100 + index}`, quantity: 2, unitPrice: (total - 400) / 2, discount: 100, tax: 0, total: total - 400 }],
  } satisfies Invoice;
});
