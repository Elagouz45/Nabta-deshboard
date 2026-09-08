export type SupplierStatus = 'active' | 'inactive';
export type PurchaseOrderStatus = 'draft' | 'sent' | 'partial' | 'received' | 'cancelled';
export interface Supplier { readonly id: string; readonly name: string; readonly contactName: string; readonly phone: string; readonly email: string; readonly city: string; readonly status: SupplierStatus; readonly ordersCount: number; }
export interface PurchaseOrder { readonly id: string; readonly number: string; readonly supplierId: string; readonly supplierName: string; readonly createdAt: string; readonly expectedAt: string; readonly itemsCount: number; readonly total: number; readonly status: PurchaseOrderStatus; readonly receivedItems: number; }
export interface SupplyReceipt { readonly id: string; readonly number: string; readonly purchaseOrderId: string; readonly purchaseOrderNumber: string; readonly supplierName: string; readonly warehouse: string; readonly receivedAt: string; readonly receivedItems: number; readonly totalItems: number; readonly receiver: string; readonly complete: boolean; }
export interface SupplierInput { readonly name: string; readonly contactName: string; readonly phone: string; readonly email: string; readonly city: string; }
export interface PurchaseOrderInput { readonly supplierId: string; readonly expectedAt: string; readonly itemsCount: number; readonly total: number; }
