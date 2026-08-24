import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MoneyPipe } from '@shared/pipes/namaa.pipes';

@Component({
  selector: 'app-product-price',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MoneyPipe],
  template: `
    <p class="price" [class.lg]="size === 'lg'">
      <strong>{{ (sale ?? regular) | money }}</strong>
      @if (sale !== null && sale < regular) {
        <s>{{ regular | money }}</s>
      }
    </p>
  `,
  styles: `
    .price { display: flex; gap: 8px; align-items: baseline; margin: 0; }
    strong { color: var(--color-forest); font-size: var(--price-size, 1em); }
    s { color: var(--color-muted); font-size: 0.9em; }
    .lg { gap: 12px; --price-size: 1.75rem; }
    .lg s { font-size: 1.05rem; }
  `,
})
export class ProductPriceComponent {
  @Input({ required: true }) regular = 0;
  @Input() sale: number | null = null;
  @Input() size: 'default' | 'lg' = 'default';
}
