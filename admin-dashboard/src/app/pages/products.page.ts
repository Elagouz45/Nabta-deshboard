import { Component, inject, signal } from '@angular/core';
import { LucidePlus, LucideSearch, LucideSlidersHorizontal } from '@lucide/angular';
import { RouterLink } from '@angular/router';
import { DashboardStore } from '../dashboard.store';
import { PageHeader } from '../shared/page-header';
import { StatusBadge } from '../shared/status-badge';

@Component({
  imports: [RouterLink, LucidePlus, LucideSearch, LucideSlidersHorizontal, PageHeader, StatusBadge],
  template: `<app-page-header
      title="المنتجات"
      description="إدارة كتالوج المنتجات والأسعار وحالة النشر."
      ><a class="btn" routerLink="/products/new">
        <svg lucidePlus></svg>إضافة منتج
      </a></app-page-header
    >
    <section class="data-panel">
      <div class="toolbar">
        <label
          ><svg lucideSearch></svg><span class="visually-hidden">بحث في المنتجات</span
          ><input
            #query
            type="search"
            placeholder="ابحث بالاسم أو SKU أو التصنيف"
            [value]="store.search()"
            (change)="search(query.value)" /></label
        ><button class="btn secondary" type="button">
          <svg lucideSlidersHorizontal></svg>الفلاتر
        </button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>المنتج</th>
              <th>SKU</th>
              <th>التصنيف</th>
              <th>السعر</th>
              <th>المخزون</th>
              <th>النشر</th>
              <th>إجراء</th>
            </tr>
          </thead>
          <tbody>
            @for (product of store.filteredProducts(); track product.id) {
              <tr>
                <td>
                  <div class="product">
                    <span aria-hidden="true">{{ product.name.charAt(0) }}</span
                    ><strong>{{ product.name }}</strong>
                  </div>
                </td>
                <td class="sku">{{ product.sku }}</td>
                <td>{{ product.category }}</td>
                <td>
                  <strong>{{ product.price.toLocaleString('ar-EG') }} ج.م</strong>
                </td>
                <td>
                  <app-status-badge [value]="product.status" /><small
                    >{{ product.stock }} قطعة</small
                  >
                </td>
                <td>
                  <button
                    class="switch"
                    type="button"
                    role="switch"
                    [attr.aria-checked]="product.active"
                    [attr.aria-label]="(product.active ? 'إيقاف ' : 'تفعيل ') + product.name"
                    [class.on]="product.active"
                    (click)="store.toggleProduct(product.id)"
                  >
                    <span></span>
                  </button>
                </td>
                <td>
                  <button class="row-action" type="button" (click)="editorOpen.set(true)">
                    تعديل
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="7">
                  <div class="empty">
                    <strong>لم نعثر على منتجات</strong
                    ><button class="btn secondary" type="button" (click)="store.setSearch('')">
                      مسح البحث
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>
    @if (editorOpen()) {
      <div class="dialog-backdrop" role="presentation" (click)="editorOpen.set(false)" (keydown.escape)="editorOpen.set(false)">
        <section
          class="dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-dialog"
          (click)="$event.stopPropagation()"
          (keydown)="$event.stopPropagation()"
        >
          <header>
            <div>
              <h2 id="product-dialog">إضافة منتج جديد</h2>
              <p>البيانات الأساسية للمنتج</p>
            </div>
            <button type="button" aria-label="إغلاق" (click)="editorOpen.set(false)">×</button>
          </header>
          <form (submit)="saveProduct($event)">
            <label>اسم المنتج<input required placeholder="مثال: سماد ورقي متوازن" /></label>
            <div class="form-grid">
              <label
                >التصنيف<select>
                  <option>أسمدة</option>
                  <option>مبيدات حشرية</option>
                  <option>مستلزمات</option>
                </select></label
              ><label>SKU<input required placeholder="FER-000" /></label
              ><label>السعر<input required type="number" min="0" value="100" /></label
              ><label>الكمية<input required type="number" min="0" value="10" /></label>
            </div>
            <footer>
              <button class="btn secondary" type="button" (click)="editorOpen.set(false)">
                إلغاء</button
              ><button class="btn" type="submit">حفظ المنتج</button>
            </footer>
          </form>
        </section>
      </div>
    } `,
  styles: [
    `
      .data-panel {
        overflow: hidden;
        background: #fff;
        border: 1px solid var(--border);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
      }
      .toolbar {
        display: flex;
        gap: 0.7rem;
        padding: 1rem;
        border-bottom: 1px solid var(--border);
      }
      .toolbar label {
        position: relative;
        display: flex;
        align-items: center;
        flex: 1;
      }
      .toolbar label lucide-icon {
        position: absolute;
        inset-inline-start: 0.8rem;
        width: 1rem;
        color: var(--muted);
      }
      .toolbar input {
        padding-inline-start: 2.35rem;
      }
      .table-wrap {
        overflow: auto;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th,
      td {
        padding: 0.8rem 1rem;
        border-bottom: 1px solid var(--border);
        text-align: start;
        white-space: nowrap;
        font-size: 0.78rem;
      }
      th {
        background: #fafcfa;
        color: var(--muted);
        font-size: 0.7rem;
      }
      .product {
        display: flex;
        align-items: center;
        gap: 0.65rem;
      }
      .product span {
        display: grid;
        place-items: center;
        width: 2.2rem;
        height: 2.2rem;
        border-radius: 0.55rem;
        background: var(--pale);
        color: var(--brand);
        font-weight: 800;
      }
      .sku {
        direction: ltr;
        text-align: right;
        color: var(--muted);
      }
      td small {
        display: block;
        margin-top: 0.25rem;
        color: var(--muted);
        font-size: 0.66rem;
      }
      .switch {
        width: 2.5rem;
        height: 1.35rem;
        padding: 0.15rem;
        border: 0;
        border-radius: 999px;
        background: #cbd4ce;
        cursor: pointer;
      }
      .switch span {
        display: block;
        width: 1.05rem;
        height: 1.05rem;
        border-radius: 50%;
        background: #fff;
        transition: transform 0.2s;
      }
      .switch.on {
        background: var(--brand);
      }
      .switch.on span {
        transform: translateX(-1.12rem);
      }
      .row-action {
        border: 0;
        background: none;
        color: var(--brand);
        font: 700 0.76rem var(--font-body);
        cursor: pointer;
      }
      .empty {
        display: grid;
        justify-items: center;
        gap: 0.7rem;
        padding: 3rem;
      }
      .dialog-backdrop {
        position: fixed;
        inset: 0;
        z-index: 70;
        display: grid;
        place-items: center;
        padding: 1rem;
        background: rgba(15, 37, 24, 0.5);
      }
      .dialog {
        width: min(34rem, 100%);
        padding: 1.25rem;
        border-radius: 1rem;
        background: #fff;
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.2);
      }
      .dialog header {
        display: flex;
        justify-content: space-between;
      }
      .dialog h2 {
        margin: 0;
        color: var(--forest);
        font: 700 1.2rem var(--font-display);
      }
      .dialog p {
        margin: 0.2rem 0;
        color: var(--muted);
        font-size: 0.78rem;
      }
      .dialog header button {
        border: 0;
        background: none;
        font-size: 1.6rem;
        cursor: pointer;
      }
      .dialog form > label,
      .form-grid label {
        display: grid;
        gap: 0.3rem;
        margin-top: 1rem;
        font-size: 0.8rem;
      }
      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0 1rem;
      }
      .dialog footer {
        display: flex;
        justify-content: flex-end;
        gap: 0.6rem;
        margin-top: 1.25rem;
      }
      @media (max-width: 600px) {
        .form-grid {
          grid-template-columns: 1fr;
        }
        .toolbar {
          flex-wrap: wrap;
        }
        .toolbar label {
          flex-basis: 100%;
        }
      }
    `,
  ],
})
export class ProductsPage {
  readonly store = inject(DashboardStore);
  readonly editorOpen = signal(false);
  search(value: string): void {
    this.store.setSearch(value);
    this.store.loadProducts();
  }
  saveProduct(event: Event): void {
    event.preventDefault();
    this.editorOpen.set(false);
    this.store.showToast('تمت إضافة المنتج بنجاح');
  }
}
