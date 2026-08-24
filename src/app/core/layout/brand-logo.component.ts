import { Component, inject, input } from '@angular/core';
import { BRAND } from '@core/tokens/brand.token';

@Component({
  selector: 'app-brand-logo',
  host: {
    '[class.compact]': 'compact()',
  },
  template: `
    <img
      [src]="compact() ? brand.logoMarkPath : brand.logoPath"
      [width]="compact() ? 40 : 168"
      [height]="compact() ? 40 : 48"
      [alt]="brand.shortNameAr"
    />
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      line-height: 0;
    }
    img {
      display: block;
      height: 48px;
      width: auto;
      max-width: none;
      object-fit: contain;
    }
    :host.compact img {
      width: 40px;
      height: 40px;
    }
    @media (max-width: 1024px) {
      :host-context(.site-header) img,
      :host-context(.main-head) img {
        height: 40px;
      }
    }
  `,
})
export class BrandLogoComponent {
  readonly brand = inject(BRAND);
  readonly compact = input(false);
}
