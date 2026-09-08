import { Injectable, computed, signal } from '@angular/core';
import { PurchaseOrder, PurchaseOrderInput, Supplier, SupplierInput, SupplyReceipt } from '../models/procurement.model';

@Injectable({ providedIn: 'root' })
export class ProcurementStore {
  private readonly suppliersState = signal<readonly Supplier[]>([
    { id: 'sup-1', name: 'شركة النيل للتنمية الزراعية', contactName: 'خالد محمود', phone: '01024568890', email: 'sales@alnile.example', city: 'القاهرة', status: 'active', ordersCount: 8 },
    { id: 'sup-2', name: 'جرين لاند للتوريدات', contactName: 'سارة عادل', phone: '01193821044', email: 'hello@greenland.example', city: 'الجيزة', status: 'active', ordersCount: 5 },
    { id: 'sup-3', name: 'جذور للمستلزمات', contactName: 'أحمد علي', phone: '01265017332', email: 'orders@juthoor.example', city: 'المنوفية', status: 'inactive', ordersCount: 3 },
  ]);
  private readonly ordersState = signal<readonly PurchaseOrder[]>([
    { id: 'po-1', number: 'PO-2048', supplierId: 'sup-1', supplierName: 'شركة النيل للتنمية الزراعية', createdAt: '2026-09-01', expectedAt: '2026-09-10', itemsCount: 12, total: 48500, status: 'sent', receivedItems: 0 },
    { id: 'po-2', number: 'PO-2047', supplierId: 'sup-2', supplierName: 'جرين لاند للتوريدات', createdAt: '2026-08-28', expectedAt: '2026-09-06', itemsCount: 8, total: 32750, status: 'partial', receivedItems: 5 },
    { id: 'po-3', number: 'PO-2046', supplierId: 'sup-1', supplierName: 'شركة النيل للتنمية الزراعية', createdAt: '2026-08-20', expectedAt: '2026-08-30', itemsCount: 6, total: 19600, status: 'received', receivedItems: 6 },
  ]);
  private readonly receiptsState = signal<readonly SupplyReceipt[]>([
    { id: 'rec-1', number: 'REC-901', purchaseOrderId: 'po-2', purchaseOrderNumber: 'PO-2047', supplierName: 'جرين لاند للتوريدات', warehouse: 'مخزن الجيزة', receivedAt: '2026-09-05', receivedItems: 5, totalItems: 8, receiver: 'مها محمد', complete: false },
    { id: 'rec-2', number: 'REC-900', purchaseOrderId: 'po-3', purchaseOrderNumber: 'PO-2046', supplierName: 'شركة النيل للتنمية الزراعية', warehouse: 'فرع القاهرة', receivedAt: '2026-08-30', receivedItems: 6, totalItems: 6, receiver: 'مها محمد', complete: true },
  ]);
  private readonly feedbackState = signal<string | null>(null);
  readonly suppliers = this.suppliersState.asReadonly(); readonly orders = this.ordersState.asReadonly(); readonly receipts = this.receiptsState.asReadonly(); readonly feedback = this.feedbackState.asReadonly();
  readonly activeSuppliers = computed(() => this.suppliersState().filter((item) => item.status === 'active'));
  readonly pendingOrders = computed(() => this.ordersState().filter((item) => item.status === 'sent' || item.status === 'partial'));
  readonly totalPurchasing = computed(() => this.ordersState().reduce((sum, item) => sum + item.total, 0));
  addSupplier(input: SupplierInput): void { this.suppliersState.update((items) => [{ id: `sup-${Date.now()}`, ...input, status: 'active', ordersCount: 0 }, ...items]); this.feedbackState.set('تمت إضافة المورد في بيئة العرض.'); }
  toggleSupplier(id: string): void { this.suppliersState.update((items) => items.map((item) => item.id === id ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' } : item)); this.feedbackState.set('تم تحديث حالة المورد.'); }
  addOrder(input: PurchaseOrderInput): void { const supplier = this.suppliersState().find((item) => item.id === input.supplierId); if (!supplier) return; this.ordersState.update((items) => [{ id: `po-${Date.now()}`, number: `PO-${2049 + items.length}`, supplierId: supplier.id, supplierName: supplier.name, createdAt: new Date().toISOString().slice(0, 10), expectedAt: input.expectedAt, itemsCount: input.itemsCount, total: input.total, status: 'draft', receivedItems: 0 }, ...items]); this.feedbackState.set('تم حفظ أمر الشراء كمسودة.'); }
  submitOrder(id: string): void { this.ordersState.update((items) => items.map((item) => item.id === id && item.status === 'draft' ? { ...item, status: 'sent' } : item)); this.feedbackState.set('تم إرسال أمر الشراء للمورد.'); }
  receive(orderId: string, quantity: number, warehouse: string): void { const order = this.ordersState().find((item) => item.id === orderId); if (!order) return; const remaining = order.itemsCount - order.receivedItems; const accepted = Math.min(Math.max(quantity, 1), remaining); const newReceived = order.receivedItems + accepted; const complete = newReceived === order.itemsCount; this.ordersState.update((items) => items.map((item) => item.id === orderId ? { ...item, receivedItems: newReceived, status: complete ? 'received' : 'partial' } : item)); this.receiptsState.update((items) => [{ id: `rec-${Date.now()}`, number: `REC-${902 + items.length}`, purchaseOrderId: order.id, purchaseOrderNumber: order.number, supplierName: order.supplierName, warehouse, receivedAt: new Date().toISOString().slice(0, 10), receivedItems: accepted, totalItems: order.itemsCount, receiver: 'مها محمد', complete }, ...items]); this.feedbackState.set(complete ? 'تم استلام التوريد وإكمال أمر الشراء.' : 'تم تسجيل استلام جزئي وتحديث أمر الشراء.'); }
  clearFeedback(): void { this.feedbackState.set(null); }
}
