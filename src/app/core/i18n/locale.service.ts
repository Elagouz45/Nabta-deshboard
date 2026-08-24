import { Injectable, computed, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { STORAGE_KEYS } from '@core/constants/storage-keys';
import { AppLocale, BRAND_CONFIG } from '@core/config/brand.config';
import { StorageService } from '@core/services/storage.service';
import { UI_STRINGS } from '@core/i18n/ui-strings';

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly storage = inject(StorageService);
  private readonly document = inject(DOCUMENT);

  readonly locale = signal<AppLocale>(this.storage.get<AppLocale>(STORAGE_KEYS.language) ?? BRAND_CONFIG.defaultLocale);
  readonly dir = computed(() => (this.locale() === 'ar' ? 'rtl' : 'ltr'));
  readonly localeTag = computed(() => (this.locale() === 'ar' ? 'ar-EG' : 'en-EG'));

  constructor() {
    this.apply();
  }

  t(key: string): string {
    const table = UI_STRINGS[this.locale()];
    return table[key] ?? UI_STRINGS.ar[key] ?? key;
  }

  text(ar: string, en: string): string {
    return this.locale() === 'en' ? en : ar;
  }

  setLocale(locale: AppLocale): void {
    this.locale.set(locale);
    this.storage.set(STORAGE_KEYS.language, locale);
    this.apply();
  }

  toggle(): void {
    this.setLocale(this.locale() === 'ar' ? 'en' : 'ar');
  }

  private apply(): void {
    const html = this.document.documentElement;
    html.lang = this.localeTag();
    html.dir = this.dir();
  }
}
