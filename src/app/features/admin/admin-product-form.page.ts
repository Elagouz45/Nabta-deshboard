import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogRepository } from '@data-access/repositories/catalog.repository';
import { Product } from '@core/models';
import { arabicNameValidator, salePriceValidator, slugValidator, stockValidator } from '@shared/validators/namaa.validators';
import { CATEGORIES, COMPANIES, BRANDS, SUBCATEGORIES } from '@data-access/mock/catalog.mock';
import { CROPS, PROBLEMS } from '@data-access/mock/crops.mock';
import { DirtyComponent } from '@core/guards/unsaved-changes.guard';
import { UiStore } from '@state/ui/ui.store';

@Component({
  selector: 'app-admin-product-form-page',
  imports: [ReactiveFormsModule],
  template: `
    <h1>{{ isNew ? 'منتج جديد' : 'تعديل منتج' }}</h1>
    <form [formGroup]="form" (ngSubmit)="save()">
      <fieldset><legend>بيانات أساسية</legend>
        <label>الاسم العربي <input class="input" formControlName="nameAr" /></label>
        <label>الاسم الإنجليزي <input class="input" formControlName="nameEn" /></label>
        <label>المسار <input class="input" formControlName="slug" /></label>
        <label>SKU <input class="input" formControlName="sku" /></label>
      </fieldset>
      <fieldset><legend>السعر والمخزون</legend>
        <label>السعر <input class="input" type="number" formControlName="regularPrice" /></label>
        <label>سعر العرض <input class="input" type="number" formControlName="salePrice" /></label>
        <label>المخزون <input class="input" type="number" formControlName="stockQuantity" /></label>
      </fieldset>
      <fieldset><legend>التصنيف</legend>
        <label>الفئة <select class="input" formControlName="categoryId">@for (c of categories; track c.id) { <option [value]="c.id">{{ c.nameAr }}</option> }</select></label>
        <label>الشركة <select class="input" formControlName="companyId">@for (c of companies; track c.id) { <option [value]="c.id">{{ c.nameAr }}</option> }</select></label>
        <label>العلامة <select class="input" formControlName="brandId">@for (c of brands; track c.id) { <option [value]="c.id">{{ c.nameAr }}</option> }</select></label>
      </fieldset>
      <fieldset><legend>الاستعمال</legend>
        <label>وصف قصير <textarea class="input" formControlName="shortDescriptionAr"></textarea></label>
        <label>تعليمات الاستعمال <textarea class="input" formControlName="usageAr"></textarea></label>
      </fieldset>
      <label><input type="checkbox" formControlName="isActive" /> منشور</label>
      <button class="btn" type="submit" [disabled]="form.invalid">حفظ</button>
    </form>
  `,
})
export class AdminProductFormPage implements DirtyComponent {
  private readonly fb = inject(FormBuilder);
  private readonly catalog = inject(CatalogRepository);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly ui = inject(UiStore);
  readonly categories = CATEGORIES;
  readonly companies = COMPANIES;
  readonly brands = BRANDS;
  readonly subs = SUBCATEGORIES;
  readonly crops = CROPS;
  readonly problems = PROBLEMS;
  isNew = true;
  private saved = false;
  readonly form = this.fb.nonNullable.group({
    nameAr: ['', [Validators.required, arabicNameValidator()]],
    nameEn: ['', Validators.required],
    slug: ['', [Validators.required, slugValidator()]],
    sku: ['', Validators.required],
    regularPrice: [100, Validators.required],
    salePrice: [null as number | null, salePriceValidator()],
    stockQuantity: [10, stockValidator()],
    categoryId: ['cat-insecticides', Validators.required],
    companyId: ['co-greenfield', Validators.required],
    brandId: ['br-haris', Validators.required],
    shortDescriptionAr: ['', Validators.required],
    usageAr: ['اتبع الملصق.'],
    isActive: [true],
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isNew = false;
      this.catalog.getProductById(id).subscribe((p) => this.patch(p));
    }
  }

  isDirty(): boolean {
    return this.form.dirty && !this.saved;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const id = this.route.snapshot.paramMap.get('id') || `p-${Date.now()}`;
    this.catalog.getProductById(this.isNew ? 'p01' : id).subscribe((base) => {
      const product: Product = {
        ...base,
        id,
        slug: v.slug,
        sku: v.sku,
        nameAr: v.nameAr,
        nameEn: v.nameEn,
        shortDescriptionAr: v.shortDescriptionAr,
        shortDescriptionEn: v.shortDescriptionAr,
        categoryId: v.categoryId,
        companyId: v.companyId,
        brandId: v.brandId,
        regularPrice: Number(v.regularPrice),
        salePrice: v.salePrice == null ? null : Number(v.salePrice),
        stockQuantity: Number(v.stockQuantity),
        isActive: v.isActive,
        usageInstructions: { ar: v.usageAr, en: v.usageAr },
      };
      this.catalog.saveProduct(product).subscribe(() => {
        this.saved = true;
        this.ui.toast('تم حفظ المنتج.');
        void this.router.navigateByUrl('/admin/products');
      });
    });
  }

  private patch(p: Product): void {
    this.form.patchValue({
      nameAr: p.nameAr,
      nameEn: p.nameEn,
      slug: p.slug,
      sku: p.sku,
      regularPrice: p.regularPrice,
      salePrice: p.salePrice,
      stockQuantity: p.stockQuantity,
      categoryId: p.categoryId,
      companyId: p.companyId,
      brandId: p.brandId,
      shortDescriptionAr: p.shortDescriptionAr,
      usageAr: p.usageInstructions.ar,
      isActive: p.isActive,
    });
  }
}
