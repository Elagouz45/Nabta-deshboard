export type TrashEntityType = 'category' | 'brand' | 'article' | 'discount' | 'staff' | 'invoice' | 'payment' | 'shipment' | 'return';

export interface TrashEntry {
  readonly trashId: string;
  readonly entityId: string;
  readonly entityType: TrashEntityType;
  readonly entityLabel: string;
  readonly sourceRoute: string;
  readonly deletedAt: string;
  readonly expiresAt: string;
  readonly financialRecord: boolean;
  readonly snapshot: unknown;
}

