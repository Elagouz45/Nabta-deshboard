import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge" [class.sale]="kind === 'sale'" [class.stock]="kind === 'stock'">{{ label }}</span>`,
  styles: `
    .badge { position: static; }
    .sale { background: var(--sale-bg, var(--color-sun)); color: var(--sale-fg, var(--color-text)); }
    .stock { background: var(--color-sky-pale); color: var(--color-info); }
  `,
})
export class ProductBadgeComponent {
  @Input({ required: true }) label = '';
  @Input() kind: 'default' | 'sale' | 'stock' = 'default';
}
