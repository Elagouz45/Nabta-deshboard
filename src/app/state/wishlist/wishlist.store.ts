import { Injectable, computed, inject, signal } from '@angular/core';
import { STORAGE_KEYS } from '@core/constants/storage-keys';
import { Product, WishlistItem } from '@core/models';
import { StorageService } from '@core/services/storage.service';
import { UiStore } from '@state/ui/ui.store';

@Injectable({ providedIn: 'root' })
export class WishlistStore {
  private readonly storage = inject(StorageService);
  private readonly ui = inject(UiStore);
  private readonly itemsSignal = signal<WishlistItem[]>(this.storage.get<WishlistItem[]>(STORAGE_KEYS.wishlist) ?? []);

  readonly items = this.itemsSignal.asReadonly();
  readonly ids = computed(() => this.itemsSignal().map((i) => i.productId));
  readonly count = computed(() => this.itemsSignal().length);
  readonly lastRemoved = signal<WishlistItem | null>(null);

  has(productId: string): boolean {
    return this.itemsSignal().some((i) => i.productId === productId);
  }

  toggle(product: Product): void {
    if (this.has(product.id)) {
      this.remove(product.id);
      return;
    }
    this.itemsSignal.update((rows) => [{ productId: product.id, addedAt: new Date().toISOString() }, ...rows]);
    this.persist();
    this.ui.toast('أُضيف إلى المفضلة.');
  }

  remove(productId: string, options?: { silent?: boolean }): void {
    const item = this.itemsSignal().find((i) => i.productId === productId);
    if (!item) {
      return;
    }
    if (!options?.silent) {
      this.lastRemoved.set(item);
      this.ui.toast('أُزيل من المفضلة.');
    }
    this.itemsSignal.update((rows) => rows.filter((i) => i.productId !== productId));
    this.persist();
  }

  undoRemove(): void {
    const item = this.lastRemoved();
    if (!item) {
      return;
    }
    if (!this.has(item.productId)) {
      this.itemsSignal.update((rows) => [item, ...rows]);
      this.persist();
    }
    this.lastRemoved.set(null);
  }

  clear(): void {
    this.itemsSignal.set([]);
    this.lastRemoved.set(null);
    this.persist();
    this.ui.toast('تم مسح المفضلة.');
  }

  private persist(): void {
    this.storage.set(STORAGE_KEYS.wishlist, this.itemsSignal());
  }
}
