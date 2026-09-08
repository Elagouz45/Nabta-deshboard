import { computed, Injectable, signal } from '@angular/core';
import { TrashEntityType, TrashEntry } from './trash.models';

const STORAGE_KEY = 'nabta-admin-trash-v1';
const RETENTION_DAYS = 30;

export interface ArchiveRequest<T> {
  readonly entityId: string;
  readonly entityType: TrashEntityType;
  readonly entityLabel: string;
  readonly sourceRoute: string;
  readonly financialRecord?: boolean;
  readonly snapshot: T;
}

@Injectable({ providedIn: 'root' })
export class TrashService {
  private readonly entriesState = signal<readonly TrashEntry[]>(this.read());
  readonly entries = this.entriesState.asReadonly();
  readonly count = computed(() => this.entriesState().length);

  constructor() { this.purgeExpired(); }

  archive<T>(request: ArchiveRequest<T>): void {
    const deletedAt = new Date();
    const expiresAt = new Date(deletedAt);
    expiresAt.setDate(expiresAt.getDate() + RETENTION_DAYS);
    const entry: TrashEntry = { ...request, trashId: crypto.randomUUID(), deletedAt: deletedAt.toISOString(), expiresAt: expiresAt.toISOString(), financialRecord: request.financialRecord ?? false };
    this.entriesState.update((entries) => [entry, ...entries.filter((item) => !(item.entityType === request.entityType && item.entityId === request.entityId))]);
    this.persist();
  }

  restore(trashId: string): void { this.removeEntry(trashId); }
  permanentlyDelete(trashId: string): void { this.removeEntry(trashId); }
  isTrashed(entityType: TrashEntityType, entityId: string): boolean { return this.entriesState().some((item) => item.entityType === entityType && item.entityId === entityId); }

  private purgeExpired(): void {
    const now = Date.now();
    const retained = this.entriesState().filter((item) => Date.parse(item.expiresAt) > now);
    if (retained.length !== this.entriesState().length) { this.entriesState.set(retained); this.persist(); }
  }
  private removeEntry(trashId: string): void { this.entriesState.update((entries) => entries.filter((item) => item.trashId !== trashId)); this.persist(); }
  private persist(): void { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.entriesState())); }
  private read(): readonly TrashEntry[] {
    try { const value = localStorage.getItem(STORAGE_KEY); return value ? JSON.parse(value) as readonly TrashEntry[] : []; }
    catch { return []; }
  }
}

