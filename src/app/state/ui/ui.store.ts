import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ToastTone = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  text: string;
  tone: ToastTone;
}

@Injectable({ providedIn: 'root' })
export class UiStore {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly toasts = signal<ToastMessage[]>([]);
  readonly mobileNavOpen = signal(false);
  readonly filterOpen = signal(false);
  readonly searchOpen = signal(false);
  readonly headerScrolled = signal(false);
  private seq = 0;

  toast(text: string, tone: ToastTone = 'success'): void {
    const id = ++this.seq;
    this.toasts.update((rows) => [...rows, { id, text, tone }]);
    if (this.isBrowser) {
      setTimeout(() => this.dismiss(id), 4200);
    }
  }

  dismiss(id: number): void {
    this.toasts.update((rows) => rows.filter((t) => t.id !== id));
  }

  closeOverlays(): void {
    this.mobileNavOpen.set(false);
    this.filterOpen.set(false);
    this.searchOpen.set(false);
  }
}
