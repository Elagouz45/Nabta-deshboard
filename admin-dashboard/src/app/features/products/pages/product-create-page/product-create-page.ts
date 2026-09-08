import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideCheck, LucideImagePlus, LucideSave, LucideUpload } from '@lucide/angular';
import { startWith } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ProductCreateStore } from '../../data-access/product-create.store';

type ProductForm = { nameAr: FormControl<string>; nameEn: FormControl<string>; slug: FormControl<string>; type: FormControl<'simple' | 'variant'>; shortDescription: FormControl<string>; description: FormControl<string>; category: FormControl<string>; subcategory: FormControl<string>; brand: FormControl<string>; unit: FormControl<string>; packageSize: FormControl<string>; tags: FormControl<string>; status: FormControl<'draft' | 'published'>; featured: FormControl<boolean>; visible: FormControl<boolean>; price: FormControl<number | null>; stock: FormControl<number | null> };

@Component({ selector: 'app-product-create-page', imports: [ReactiveFormsModule, RouterLink, LucideCheck, LucideImagePlus, LucideSave, LucideUpload], providers: [ProductCreateStore], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './product-create-page.html', styleUrl: './product-create-page.scss' })
export class ProductCreatePage {
  readonly store = inject(ProductCreateStore);
  readonly form = new FormGroup<ProductForm>({
    nameAr: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(120)] }), nameEn: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(120)] }), slug: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)] }), type: new FormControl('simple', { nonNullable: true }), shortDescription: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(160)] }), description: new FormControl('', { nonNullable: true }), category: new FormControl('', { nonNullable: true, validators: [Validators.required] }), subcategory: new FormControl('', { nonNullable: true }), brand: new FormControl('', { nonNullable: true }), unit: new FormControl('كجم', { nonNullable: true }), packageSize: new FormControl('عبوة', { nonNullable: true }), tags: new FormControl('', { nonNullable: true }), status: new FormControl('draft', { nonNullable: true }), featured: new FormControl(false, { nonNullable: true }), visible: new FormControl(true, { nonNullable: true }), price: new FormControl<number | null>(null, [Validators.min(0)]), stock: new FormControl<number | null>(null, [Validators.min(0), Validators.pattern(/^\d+$/)])
  });
  private readonly destroyRef = inject(DestroyRef);
  private readonly formValue = toSignal(this.form.valueChanges.pipe(startWith(this.form.getRawValue())), { initialValue: this.form.getRawValue() });
  readonly completion = computed(() => { const value = this.formValue(); const fields = [value.nameAr, value.slug, value.category, this.store.imageUrls().length > 0, value.price !== null, value.stock !== null]; return Math.round((fields.filter(Boolean).length / fields.length) * 100); });

  constructor() { this.destroyRef.onDestroy(() => this.store.revokeImages()); this.form.controls.nameEn.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => { if (!this.form.controls.slug.dirty) this.form.controls.slug.setValue(this.toSlug(value), { emitEvent: false }); }); }
  chooseImages(input: HTMLInputElement): void { input.click(); }
  imagesSelected(event: Event): void { const input = event.target as HTMLInputElement; const files = Array.from(input.files ?? []).filter((file) => file.type.startsWith('image/')).slice(0, 5); this.store.setImages(files.map((file) => URL.createObjectURL(file))); input.value = ''; }
  saveDraft(): void { sessionStorage.setItem('nabtah.product.draft', JSON.stringify(this.form.getRawValue())); this.store.setFeedback('تم حفظ المسودة على هذا الجهاز.'); }
  publish(): void { this.form.markAllAsTouched(); if (this.form.invalid) { this.store.setFeedback('راجع الحقول المطلوبة قبل نشر المنتج.'); return; } this.store.setFeedback(environment.demoAdmin ? 'البيانات جاهزة. النشر الفعلي ينتظر ربط Laravel.' : 'النشر غير متاح حتى يتم توفير عقد Laravel المعتمد.'); }
  private toSlug(value: string): string { return value.trim().toLowerCase().replace(/[\s_]+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, ''); }
}
