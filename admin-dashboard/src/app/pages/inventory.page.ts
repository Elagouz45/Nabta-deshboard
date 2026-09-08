import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { LucideBell, LucideBoxes, LucideCircleCheck, LucideDownload, LucidePackageX, LucideSave, LucideTriangleAlert } from '@lucide/angular';
import { DashboardStore } from '../dashboard.store';
import { Product, StockStatus } from '../models';
import { PageHeader } from '../shared/page-header';
import { StatusBadge } from '../shared/status-badge';

const wholeNumber: ValidatorFn = (control): ValidationErrors | null => Number.isInteger(control.value) ? null : { wholeNumber: true };

@Component({
  imports: [ReactiveFormsModule, LucideBell, LucideBoxes, LucideCircleCheck, LucideDownload, LucidePackageX, LucideSave, LucideTriangleAlert, PageHeader, StatusBadge],
  template: `
    <app-page-header eyebrow="مساحة الإدارة" title="إدارة المخزون" description="راجع الكميات وحدّث المنتجات التي تحتاج إلى إعادة توريد.">
      <button class="download-button" type="button" [disabled]="downloading()" (click)="downloadReport()">
        @if(downloading()){<span class="button-spinner" aria-hidden="true"></span>}@else{<svg lucideDownload></svg>}
        {{ downloading() ? 'جارٍ التنزيل...' : 'تنزيل التقرير' }}
      </button>
    </app-page-header>

    @if(store.loading()){
      <section class="summary-grid" aria-label="جارٍ تحميل ملخص المخزون">@for(item of [1,2,3,4];track item){<article class="summary-card skeleton"></article>}</section>
    }@else{
      <section class="summary-grid" aria-label="ملخص المخزون">
        <article class="summary-card total"><span class="summary-icon"><svg lucideBoxes></svg></span><div><h2>إجمالي المنتجات</h2><strong>{{ store.products().length.toLocaleString('ar-EG') }}</strong><p>كل المنتجات في المخزون</p></div></article>
        <article class="summary-card available"><span class="summary-icon"><svg lucideCircleCheck></svg></span><div><h2>متوفر</h2><strong>{{ countByStatus('in_stock').toLocaleString('ar-EG') }}</strong><p>منتجات متوفرة</p></div></article>
        <article class="summary-card low"><span class="summary-icon"><svg lucideBell></svg></span><div><h2>مخزون منخفض</h2><strong>{{ countByStatus('low_stock').toLocaleString('ar-EG') }}</strong><p>منتجات بحاجة انتباه</p></div></article>
        <article class="summary-card empty"><span class="summary-icon"><svg lucidePackageX></svg></span><div><h2>نفد المخزون</h2><strong>{{ countByStatus('out_of_stock').toLocaleString('ar-EG') }}</strong><p>منتجات بحاجة إعادة توريد</p></div></article>
      </section>
    }

    @if(attentionCount()){
      <aside class="attention-banner" role="status"><svg lucideTriangleAlert></svg><div><strong>{{ attentionCount().toLocaleString('ar-EG') }} منتجًا تحتاج إلى انتباهك</strong><p>الكميات أقل من حد الأمان أو نفدت بالكامل.</p></div></aside>
    }

    <section class="inventory-table-card" aria-labelledby="inventory-list-title">
      <h2 id="inventory-list-title" class="visually-hidden">قائمة مخزون المنتجات</h2>
      <div class="status-legend" aria-label="دليل حالات المخزون"><span class="green"><i></i>متوفر</span><span class="amber"><i></i>منخفض</span><span class="red"><i></i>نافد</span></div>

      @if(store.loading()){
        <div class="table-skeleton" role="status" aria-label="جارٍ تحميل المنتجات">@for(item of [1,2,3,4];track item){<span></span>}</div>
      }@else if(store.error()){
        <div class="page-state error" role="alert"><svg lucideTriangleAlert></svg><strong>تعذر تحميل بيانات المخزون</strong><p>{{ store.error() }}</p><button class="retry-button" type="button" (click)="store.loadProducts()">إعادة المحاولة</button></div>
      }@else if(store.products().length){
        <div class="table-wrap"><table>
          <thead><tr><th>المنتج</th><th>حالة المخزون</th><th>الكمية الحالية</th><th>تعديل الكمية</th><th>حفظ</th></tr></thead>
          <tbody>@for(product of store.products();track product.id){<tr [class]="'status-row status-row--'+product.status">
            <td data-label="المنتج"><div class="product-cell">
              @if(product.thumbnail){<img [src]="product.thumbnail" [alt]="product.name" width="44" height="44">}@else{<span class="monogram" aria-hidden="true">{{ product.name.charAt(0) }}</span>}
              <div><strong>{{ product.name }}</strong><small><bdi>{{ product.sku }}</bdi> · {{ product.category }}</small></div>
            </div></td>
            <td data-label="حالة المخزون"><app-status-badge [value]="product.status"/></td>
            <td data-label="الكمية الحالية"><strong class="current-quantity">{{ product.stock.toLocaleString('ar-EG') }}</strong></td>
            <td data-label="تعديل الكمية"><div class="edit-field"><label [for]="'stock-'+product.id">الكمية الجديدة</label><input [id]="'stock-'+product.id" type="number" min="0" step="1" inputmode="numeric" [formControl]="controlFor(product.id)" [attr.aria-describedby]="hasError(product.id) ? 'error-'+product.id : null">@if(hasError(product.id)){<small [id]="'error-'+product.id" role="alert">أدخل عددًا صحيحًا لا يقل عن صفر.</small>}@if(rowError(product.id)){<small class="server-error" role="alert">{{ rowError(product.id) }}</small>}</div></td>
            <td data-label="حفظ"><button class="save-button" type="button" [disabled]="!canSave(product)" (click)="save(product)" [attr.aria-label]="'حفظ كمية '+product.name" title="حفظ">
              @if(isSaving(product.id)){<span class="button-spinner" aria-hidden="true"></span><span>جارٍ الحفظ</span>}@else{<svg lucideSave></svg><span>حفظ</span>}
            </button></td>
          </tr>}</tbody>
        </table></div>
      }@else{
        <div class="page-state"><svg lucideBoxes></svg><strong>لا توجد منتجات في المخزون</strong><p>ستظهر المنتجات هنا عند إضافتها إلى المتجر.</p></div>
      }
    </section>
  `,
  styleUrl: './inventory.page.scss',
})
export class InventoryPage {
  readonly store = inject(DashboardStore);
  readonly controls = signal<Record<string, FormControl<number | null>>>({});
  readonly savingRows = signal<ReadonlySet<string>>(new Set());
  readonly rowErrors = signal<Record<string, string>>({});
  readonly downloading = signal(false);
  readonly attentionCount = computed(() => this.countByStatus('low_stock') + this.countByStatus('out_of_stock'));

  constructor() {
    effect(() => {
      const current = this.controls();
      const additions: Record<string, FormControl<number | null>> = {};
      for (const product of this.store.products()) {
        if (!current[product.id]) additions[product.id] = new FormControl(product.stock, [Validators.required, Validators.min(0), wholeNumber]);
      }
      if (Object.keys(additions).length) this.controls.set({ ...current, ...additions });
    });
  }

  controlFor(productId: string): FormControl<number | null> { return this.controls()[productId]; }
  countByStatus(status: StockStatus): number { return this.store.products().filter((product) => product.status === status).length; }
  isSaving(productId: string): boolean { return this.savingRows().has(productId); }
  rowError(productId: string): string { return this.rowErrors()[productId] ?? ''; }
  hasError(productId: string): boolean { const control = this.controlFor(productId); return control.invalid && (control.dirty || control.touched); }
  canSave(product: Product): boolean {
    const control = this.controlFor(product.id);
    return control.valid && control.value !== product.stock && !this.isSaving(product.id);
  }

  save(product: Product): void {
    const control = this.controlFor(product.id);
    control.markAsTouched();
    if (!this.canSave(product) || control.value === null) return;
    this.savingRows.update((rows) => new Set(rows).add(product.id));
    this.rowErrors.update((errors) => ({ ...errors, [product.id]: '' }));
    this.store.updateStock(product.id, control.value).pipe(finalize(() => this.savingRows.update((rows) => {
      const next = new Set(rows); next.delete(product.id); return next;
    }))).subscribe({
      next: (updated) => control.reset(updated.stock, { emitEvent: false }),
      error: () => this.rowErrors.update((errors) => ({ ...errors, [product.id]: 'تعذر حفظ الكمية. حاول مرة أخرى.' })),
    });
  }

  downloadReport(): void {
    if (this.downloading()) return;
    this.downloading.set(true);
    window.setTimeout(() => {
      const rows = [['رمز المنتج', 'المنتج', 'التصنيف', 'الكمية', 'حالة المخزون'], ...this.store.products().map((product) => [product.sku, product.name, product.category, String(product.stock), this.statusLabel(product.status)])];
      const csv = `\uFEFF${rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(',')).join('\n')}`;
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      const link = document.createElement('a'); link.href = url; link.download = 'تقرير-مخزون-نبته.csv'; link.click(); URL.revokeObjectURL(url);
      this.downloading.set(false); this.store.showToast('تم تنزيل تقرير المخزون');
    }, 350);
  }

  private statusLabel(status: StockStatus): string { return { in_stock: 'متوفر', low_stock: 'مخزون منخفض', out_of_stock: 'نفد المخزون' }[status]; }
}
