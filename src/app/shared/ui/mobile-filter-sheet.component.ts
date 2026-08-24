import { Component, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ProductFilters, Category, Company, Crop, PlantProblem } from '@core/models';
import { FilterPanelComponent } from './filter-panel.component';
import { LucideX } from '@lucide/angular';

export interface FilterSheetResult {
  filters?: ProductFilters;
  clear?: boolean;
}

export interface FilterSheetData {
  filters: ProductFilters;
  categories: Category[];
  companies: Company[];
  crops: Crop[];
  problems: PlantProblem[];
  resultCount: number;
  compactOffers?: boolean;
}

@Component({
  selector: 'app-mobile-filter-sheet',
  imports: [FilterPanelComponent, LucideX],
  template: `
    <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
      <div class="handle" aria-hidden="true"></div>
      <header class="head">
        <div>
          <h2 id="sheet-title">{{ data.compactOffers ? 'تصفية العروض' : 'الفلاتر' }}</h2>
          <p class="sub">{{ data.compactOffers ? 'ضيّق العروض حسب التصنيف والخصم والسعر' : 'ضيّق النتائج حسب محصولك واحتياجك' }}</p>
        </div>
        <button type="button" class="icon-btn" (click)="ref.close()" aria-label="إغلاق">
          <svg lucideX [size]="20"></svg>
        </button>
      </header>
      <div class="body">
        <app-filter-panel
          [filters]="draft"
          [categories]="data.categories"
          [companies]="data.companies"
          [crops]="data.crops"
          [problems]="data.problems"
          [hideOffersToggle]="!!draft.offersOnly"
          [compactOffers]="!!data.compactOffers"
          (filtersChange)="draft = $event"
        />
      </div>
      <footer class="foot">
        <button type="button" class="btn" (click)="ref.close({ filters: draft })">عرض النتائج</button>
        <button type="button" class="btn ghost" (click)="ref.close({ clear: true })">مسح الكل</button>
      </footer>
    </div>
  `,
  styles: `
    .sheet {
      background: var(--color-white);
      border-radius: 24px 24px 0 0;
      width: min(100vw, 520px);
      max-height: 90dvh;
      display: flex;
      flex-direction: column;
      padding-bottom: max(12px, env(safe-area-inset-bottom));
      box-shadow: 0 -12px 40px rgb(18 58 40 / 12%);
    }
    .handle {
      width: 40px;
      height: 4px;
      background: var(--color-border-strong);
      border-radius: 99px;
      margin: 10px auto 0;
    }
    .head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      padding: 10px 16px 12px;
      border-bottom: 1px solid var(--color-border);
    }
    h2 { margin: 0; font-size: 1.15rem; }
    .sub { margin: 4px 0 0; color: var(--color-muted); font-size: 0.85rem; }
    .body { overflow: auto; padding: 4px 16px 8px; flex: 1; }
    .foot {
      display: flex;
      gap: 10px;
      padding: 12px 16px;
      border-top: 1px solid var(--color-border);
      background: var(--color-white);
    }
    .foot .btn { flex: 1.4; min-height: 48px; }
    .foot .ghost { flex: 1; }
  `,
})
export class MobileFilterSheetComponent {
  readonly data = inject<FilterSheetData>(DIALOG_DATA);
  readonly ref = inject(DialogRef<FilterSheetResult | undefined>);
  draft: ProductFilters = { ...this.data.filters };
}
