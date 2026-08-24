import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductSortOption } from '@core/models';

@Component({
  selector: 'app-sort-control',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <label class="sort">ترتيب
      <select class="input" [ngModel]="value" (ngModelChange)="valueChange.emit($event)" [attr.aria-label]="offersMode ? 'ترتيب العروض' : 'ترتيب المنتجات'">
        @if (offersMode) {
          <option value="best_saving">الأكثر توفيرًا</option>
        }
        <option value="recommended">موصى به</option>
        <option value="best_selling">الأكثر مبيعًا</option>
        <option value="highest_rated">الأعلى تقييمًا</option>
        <option value="newest">الأحدث</option>
        <option value="price_asc">السعر من الأقل</option>
        <option value="price_desc">السعر من الأعلى</option>
      </select>
    </label>
  `,
  styles: `
    .sort {
      display: flex;
      gap: 8px;
      align-items: center;
      font-size: 0.9rem;
      color: var(--color-muted);
    }
    select { min-width: 148px; width: auto; min-height: 44px; }
    @media (max-width: 560px) {
      .sort { width: 100%; }
      select { flex: 1; min-width: 0; }
    }
  `,
})
export class SortControlComponent {
  @Input() value: ProductSortOption = 'recommended';
  @Input() offersMode = false;
  @Output() valueChange = new EventEmitter<ProductSortOption>();
}
