import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category, Company, Crop, PlantProblem, ProductFilters } from '@core/models';
import { FilterAccordionComponent } from './filter-accordion.component';

@Component({
  selector: 'app-filter-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, FilterAccordionComponent],
  template: `
    <div class="panel" [class.compact]="compactOffers">
      <app-filter-accordion title="التصنيف" [active]="!!filters.categoryId">
        @if (compactOffers) {
          <div class="checks" role="group" aria-label="التصنيف">
            @for (c of categories; track c.id) {
              <label class="check">
                <input
                  type="checkbox"
                  [checked]="filters.categoryId === c.id"
                  (change)="patch('categoryId', filters.categoryId === c.id ? undefined : c.id)"
                />
                <span>{{ c.nameAr }}</span>
              </label>
            }
          </div>
        } @else {
          <div class="opts" role="listbox" aria-label="التصنيف">
            <button type="button" class="opt" [class.on]="!filters.categoryId" (click)="patch('categoryId', undefined)">الكل</button>
            @for (c of categories; track c.id) {
              <button type="button" class="opt" [class.on]="filters.categoryId === c.id" (click)="patch('categoryId', c.id)">{{ c.nameAr }}</button>
            }
          </div>
        }
      </app-filter-accordion>

      @if (compactOffers) {
        <app-filter-accordion title="نسبة الخصم" [active]="filters.minDiscount !== null && filters.minDiscount !== undefined">
          <div class="checks" role="group" aria-label="نسبة الخصم">
            <label class="check">
              <input
                type="checkbox"
                [checked]="filters.minDiscount === null || filters.minDiscount === undefined"
                (change)="patch('minDiscount', undefined)"
              />
              <span>الكل</span>
            </label>
            @for (step of discountSteps; track step) {
              <label class="check">
                <input
                  type="checkbox"
                  [checked]="filters.minDiscount === step"
                  (change)="patch('minDiscount', filters.minDiscount === step ? undefined : step)"
                />
                <span>{{ step }}٪ فأكثر</span>
              </label>
            }
          </div>
        </app-filter-accordion>
      }

      <app-filter-accordion title="السعر" [active]="filters.minPrice !== undefined || filters.maxPrice !== undefined">
        <div class="price-row">
          <label>
            من
            <input
              class="input"
              type="number"
              min="0"
              inputmode="numeric"
              placeholder="0"
              [ngModel]="filters.minPrice ?? ''"
              (ngModelChange)="patch('minPrice', num($event))"
            />
          </label>
          <span class="dash" aria-hidden="true">—</span>
          <label>
            إلى
            <input
              class="input"
              type="number"
              min="0"
              inputmode="numeric"
              placeholder="الأعلى"
              [ngModel]="filters.maxPrice ?? ''"
              (ngModelChange)="patch('maxPrice', num($event))"
            />
          </label>
        </div>
        <p class="hint">القيمة بالجنيه المصري</p>
      </app-filter-accordion>

      @if (!compactOffers) {
      <app-filter-accordion title="الشركة" [open]="false" [active]="!!filters.companyId">
        <div class="opts" role="listbox" aria-label="الشركة">
          <button type="button" class="opt" [class.on]="!filters.companyId" (click)="patch('companyId', undefined)">الكل</button>
          @for (c of companies; track c.id) {
            <button type="button" class="opt" [class.on]="filters.companyId === c.id" (click)="patch('companyId', c.id)">{{ c.nameAr }}</button>
          }
        </div>
      </app-filter-accordion>

      <app-filter-accordion title="المحصول" [open]="false" [active]="!!filters.cropId">
        <div class="opts" role="listbox" aria-label="المحصول">
          <button type="button" class="opt" [class.on]="!filters.cropId" (click)="patch('cropId', undefined)">الكل</button>
          @for (c of crops; track c.id) {
            <button type="button" class="opt" [class.on]="filters.cropId === c.id" (click)="patch('cropId', c.id)">{{ c.nameAr }}</button>
          }
        </div>
      </app-filter-accordion>

      <app-filter-accordion title="المشكلة" [open]="false" [active]="!!filters.problemId">
        <div class="opts" role="listbox" aria-label="المشكلة">
          <button type="button" class="opt" [class.on]="!filters.problemId" (click)="patch('problemId', undefined)">الكل</button>
          @for (p of problems; track p.id) {
            <button type="button" class="opt" [class.on]="filters.problemId === p.id" (click)="patch('problemId', p.id)">{{ p.nameAr }}</button>
          }
        </div>
      </app-filter-accordion>

      <app-filter-accordion title="التوفر والعروض" [active]="availabilityOn">
        <div class="opts">
          <button type="button" class="opt" [class.on]="!!filters.inStock" (click)="toggle('inStock')">متوفر فقط</button>
          @if (!hideOffersToggle) {
            <button type="button" class="opt" [class.on]="!!filters.offersOnly" (click)="toggle('offersOnly')">العروض</button>
          }
          <button type="button" class="opt" [class.on]="!!filters.bestSellers" (click)="toggle('bestSellers')">الأكثر مبيعًا</button>
          <button type="button" class="opt" [class.on]="!!filters.isNew" (click)="toggle('isNew')">جديد</button>
        </div>
      </app-filter-accordion>
      }
    </div>
  `,
  styles: `
    .panel { display: grid; }
    .opts {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      max-height: 168px;
      overflow: auto;
      padding-block: 2px;
    }
    .opt {
      min-height: 36px;
      padding: 0 12px;
      border-radius: var(--radius-pill);
      border: 1px solid var(--color-border);
      background: var(--color-white);
      color: var(--color-text);
      font: inherit;
      font-size: 0.875rem;
      cursor: pointer;
      line-height: 1.3;
    }
    .opt.on {
      background: var(--color-mint);
      border-color: var(--color-brand);
      color: var(--color-forest);
      font-weight: 700;
    }
    .opt:focus-visible {
      outline: none;
      box-shadow: var(--focus);
    }
    .price-row {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 8px;
      align-items: end;
    }
    .price-row label { display: grid; gap: 6px; font-size: 0.85rem; color: var(--color-muted); }
    .price-row .input { min-height: 44px; min-width: 0; }
    .dash { color: var(--color-muted-2); padding-bottom: 12px; }
    .hint { margin: 0; font-size: 0.78rem; color: var(--color-muted-2); }
    .compact .opts { max-height: none; overflow: visible; }
    @media (max-width: 400px) {
      .price-row { grid-template-columns: 1fr; }
      .dash { display: none; }
    }
    .checks { display: grid; gap: 2px; }
    .check {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 40px;
      font-size: 0.9rem;
      cursor: pointer;
      color: var(--color-text);
    }
    .check input {
      width: 18px;
      height: 18px;
      accent-color: var(--color-forest);
      flex-shrink: 0;
    }
  `,
})
export class FilterPanelComponent {
  @Input({ required: true }) filters!: ProductFilters;
  @Input() categories: Category[] = [];
  @Input() companies: Company[] = [];
  @Input() crops: Crop[] = [];
  @Input() problems: PlantProblem[] = [];
  @Input() hideOffersToggle = false;
  @Input() compactOffers = false;
  @Output() filtersChange = new EventEmitter<ProductFilters>();
  readonly discountSteps = [10, 20, 30];

  get availabilityOn(): boolean {
    return !!(this.filters.inStock || this.filters.offersOnly || this.filters.bestSellers || this.filters.isNew);
  }

  num(v: string | number): number | undefined {
    return v === '' || v == null ? undefined : Number(v);
  }

  toggle(key: 'inStock' | 'offersOnly' | 'bestSellers' | 'isNew'): void {
    this.patch(key, this.filters[key] ? undefined : true);
  }

  patch(key: keyof ProductFilters, value: ProductFilters[keyof ProductFilters]): void {
    this.filtersChange.emit({ ...this.filters, [key]: value, page: 1 });
  }
}
