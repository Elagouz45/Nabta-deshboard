import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SETTINGS_SECTIONS } from '../config/settings-sections.config';
import { SettingsNavigationComponent } from '../components/settings-navigation.component';
import { SettingsField, SettingsSection, SettingsSectionId, SettingsValue } from '../models/settings.model';
import { SettingsStore } from '../stores/settings.store';

type SettingsForm = FormGroup<Record<string, FormControl<SettingsValue>>>;

@Component({ imports: [ReactiveFormsModule, SettingsNavigationComponent], changeDetection: ChangeDetectionStrategy.OnPush, host: { class: 'settings-page' },
  templateUrl: './settings-section.page.html', styleUrl: './settings-section.page.scss' })
export class SettingsSectionPage {
  readonly store = inject(SettingsStore);
  private readonly route = inject(ActivatedRoute);
  readonly section = this.resolveSection();
  readonly form = this.createForm(this.section);
  readonly adding = signal(false);
  readonly isMethodsSection = computed(() => this.section.id === 'payments' || this.section.id === 'shipping');
  readonly methods = computed(() => this.section.id === 'payments' ? this.store.paymentMethods() : this.store.shippingMethods());
  save(): void { if (this.form.invalid) { this.form.markAllAsTouched(); return; } this.store.save(this.section.id, this.form.getRawValue()); this.form.markAsPristine(); }
  reset(): void { this.form.reset(this.store.reset(this.section.id)); this.form.markAsPristine(); }
  resetForm(): void { this.form.reset(this.store.values(this.section.id)); this.form.markAsPristine(); }
  methodSection(): 'payments' | 'shipping' { return this.section.id === 'payments' ? 'payments' : 'shipping'; }
  addMethod(name: string, description: string): void { if (!name.trim()) return; this.store.addMethod(this.methodSection(), name.trim(), description.trim()); this.adding.set(false); }
  private resolveSection(): SettingsSection { const id = this.route.snapshot.data['section'] as SettingsSectionId; return SETTINGS_SECTIONS.find((item) => item.id === id) ?? SETTINGS_SECTIONS[0]; }
  private createForm(section: SettingsSection): SettingsForm {
    const saved = this.store.values(section.id); const controls: Record<string, FormControl<SettingsValue>> = {};
    for (const card of section.cards) for (const field of card.fields) controls[field.key] = this.createControl(field, saved[field.key]);
    return new FormGroup(controls);
  }
  private createControl(field: SettingsField, value: SettingsValue | undefined): FormControl<SettingsValue> {
    const validators = [field.required ? Validators.required : null, field.min !== undefined ? Validators.min(field.min) : null, field.max !== undefined ? Validators.max(field.max) : null].filter((validator) => validator !== null);
    return new FormControl(value ?? (field.type === 'toggle' ? false : ''), { nonNullable: true, validators });
  }
}
