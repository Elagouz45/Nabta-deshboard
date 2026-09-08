import { Injectable, computed, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { DEFAULT_SETTINGS } from '../config/settings-sections.config';
import { ConfigurableMethod, SettingsSectionId, SettingsValues } from '../models/settings.model';

const STORAGE_KEY = 'nabtah.admin.demo-settings';

@Injectable({ providedIn: 'root' })
export class SettingsStore {
  private readonly valuesState = signal(this.readValues());
  private readonly savingSectionState = signal<SettingsSectionId | null>(null);
  private readonly feedbackState = signal<string | null>(null);
  private readonly paymentMethodsState = signal<readonly ConfigurableMethod[]>([
    { id: 'cash', name: 'الدفع عند الاستلام', description: 'تحصيل قيمة الطلب عند التسليم.', enabled: true },
    { id: 'card', name: 'البطاقات البنكية', description: 'Visa وMastercard عبر بوابة الدفع.', enabled: true },
  ]);
  private readonly shippingMethodsState = signal<readonly ConfigurableMethod[]>([
    { id: 'branch', name: 'توصيل الفروع', description: 'توصيل الطلب من أقرب فرع متاح.', enabled: true },
    { id: 'pickup', name: 'الاستلام من الفرع', description: 'يستلم العميل طلبه دون رسوم شحن.', enabled: true },
  ]);
  readonly savingSection = this.savingSectionState.asReadonly();
  readonly feedback = this.feedbackState.asReadonly();
  readonly paymentMethods = this.paymentMethodsState.asReadonly();
  readonly shippingMethods = this.shippingMethodsState.asReadonly();
  readonly isDemo = computed(() => !environment.production);

  values(section: SettingsSectionId): SettingsValues { return this.valuesState()[section] ?? {}; }
  save(section: SettingsSectionId, values: SettingsValues): void {
    if (environment.production) { this.feedbackState.set('الحفظ غير متاح حتى اعتماد عقد Laravel الخاص بالإعدادات.'); return; }
    this.savingSectionState.set(section);
    this.valuesState.update((current) => ({ ...current, [section]: { ...values } }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.valuesState()));
    this.savingSectionState.set(null);
    this.feedbackState.set('تم حفظ التغييرات في بيئة العرض بنجاح.');
  }
  reset(section: SettingsSectionId): SettingsValues {
    const values = DEFAULT_SETTINGS[section] ?? {};
    this.save(section, values);
    this.feedbackState.set('تمت استعادة الإعدادات الافتراضية.');
    return values;
  }
  addMethod(section: 'payments' | 'shipping', name: string, description: string): void {
    const method = { id: `${section}-${Date.now()}`, name, description, enabled: true };
    if (section === 'payments') this.paymentMethodsState.update((items) => [...items, method]);
    else this.shippingMethodsState.update((items) => [...items, method]);
    this.feedbackState.set('تمت إضافة الطريقة في بيئة العرض.');
  }
  toggleMethod(section: 'payments' | 'shipping', id: string): void {
    const toggle = (items: readonly ConfigurableMethod[]) => items.map((item) => item.id === id ? { ...item, enabled: !item.enabled } : item);
    if (section === 'payments') this.paymentMethodsState.update(toggle); else this.shippingMethodsState.update(toggle);
  }
  clearFeedback(): void { this.feedbackState.set(null); }
  private readValues(): Readonly<Record<string, SettingsValues>> {
    if (environment.production || typeof localStorage === 'undefined') return DEFAULT_SETTINGS;
    try { const stored = localStorage.getItem(STORAGE_KEY); return stored ? { ...DEFAULT_SETTINGS, ...(JSON.parse(stored) as Record<string, SettingsValues>) } : DEFAULT_SETTINGS; }
    catch { return DEFAULT_SETTINGS; }
  }
}
