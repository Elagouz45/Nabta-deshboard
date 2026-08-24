import { Injectable, inject, signal } from '@angular/core';
import { RECENTLY_VIEWED_LIMIT } from '@core/constants/app.constants';
import { STORAGE_KEYS } from '@core/constants/storage-keys';
import { StorageService } from '@core/services/storage.service';

@Injectable({ providedIn: 'root' })
export class RecentlyViewedStore {
  private readonly storage = inject(StorageService);
  readonly ids = signal<string[]>(this.storage.get<string[]>(STORAGE_KEYS.recentlyViewed) ?? []);

  add(productId: string): void {
    const next = [productId, ...this.ids().filter((id) => id !== productId)].slice(0, RECENTLY_VIEWED_LIMIT);
    this.ids.set(next);
    this.storage.set(STORAGE_KEYS.recentlyViewed, next);
  }
}
