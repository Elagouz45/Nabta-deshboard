export type SettingsSectionId = 'store' | 'orders' | 'inventory' | 'payments' | 'shipping' | 'taxes' | 'notifications' | 'locale';
export type SettingsFieldType = 'text' | 'email' | 'tel' | 'number' | 'select' | 'textarea' | 'toggle';
export interface SettingsOption { readonly label: string; readonly value: string; }
export interface SettingsField { readonly key: string; readonly label: string; readonly hint?: string; readonly type: SettingsFieldType; readonly required?: boolean; readonly min?: number; readonly max?: number; readonly options?: readonly SettingsOption[]; }
export interface SettingsCard { readonly title: string; readonly description: string; readonly fields: readonly SettingsField[]; }
export interface SettingsSection { readonly id: SettingsSectionId; readonly label: string; readonly title: string; readonly subtitle: string; readonly eyebrow: string; readonly cards: readonly SettingsCard[]; }
export type SettingsValue = string | number | boolean;
export type SettingsValues = Readonly<Record<string, SettingsValue>>;
export interface ConfigurableMethod { readonly id: string; readonly name: string; readonly description: string; readonly enabled: boolean; }
