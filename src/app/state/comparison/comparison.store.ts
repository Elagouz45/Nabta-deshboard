import { Injectable, computed, inject, signal } from '@angular/core';
import { COMPARE_LIMIT } from '@core/constants/app.constants';
import { STORAGE_KEYS } from '@core/constants/storage-keys';
import { ComparisonItem, Product } from '@core/models';
import { StorageService } from '@core/services/storage.service';
import { UiStore } from '@state/ui/ui.store';

@Injectable({ providedIn: 'root' })
export class ComparisonStore {
  private readonly storage = inject(StorageService);
  private readonly ui = inject(UiStore);
  private readonly itemsSignal = signal<ComparisonItem[]>(
    this.storage.get<ComparisonItem[]>(STORAGE_KEYS.comparison) ?? [],
  );

  readonly items = this.itemsSignal.asReadonly();
  readonly ids = computed(() => this.itemsSignal().map((i) => i.productId));
  readonly count = computed(() => this.itemsSignal().length);

  has(productId: string): boolean {
    return this.itemsSignal().some((i) => i.productId === productId);
  }

  toggle(product: Product): void {
    if (this.has(product.id)) {
      this.remove(product.id);
      return;
    }
    if (this.itemsSignal().length >= COMPARE_LIMIT) {
      this.ui.toast(`يمكن مقارنة ${COMPARE_LIMIT} منتجات كحد أقصى.`, 'info');
      return;
    }
    this.itemsSignal.update((rows) => [{ productId: product.id, addedAt: new Date().toISOString() }, ...rows]);
    this.persist();
    this.ui.toast('أُضيف إلى المقارنة.');
  }

  remove(productId: string): void {
    this.itemsSignal.update((rows) => rows.filter((i) => i.productId !== productId));
    this.persist();
    this.ui.toast('أُزيل من المقارنة.');
  }

  clear(): void {
    this.itemsSignal.set([]);
    this.persist();
    this.ui.toast('تم مسح المقارنة.');
  }

  private persist(): void {
    this.storage.set(STORAGE_KEYS.comparison, this.itemsSignal());
  }
}
