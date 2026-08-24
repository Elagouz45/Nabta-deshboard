import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '@core/models';
import { LocPipe } from '@shared/pipes/namaa.pipes';
import { AppImageComponent } from './app-image.component';

@Component({
  selector: 'app-category-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LocPipe, AppImageComponent],
  template: `
    <a
      [class]="variant === 'circle' ? 'circle' : 'card cat'"
      [routerLink]="['/shop']"
      [queryParams]="{ categoryId: category.id }"
    >
      <app-image
        [src]="category.image"
        [alt]="category.imageAltAr || category.nameAr"
        [width]="variant === 'circle' ? 400 : 800"
        [height]="variant === 'circle' ? 400 : 600"
        objectFit="cover"
        fallbackKind="category"
      />
      <span class="label">
        <strong>{{ category.nameAr | loc: category.nameEn }}</strong>
        @if (variant !== 'circle') {
          <span class="arrow" aria-hidden="true">‹</span>
        }
      </span>
    </a>
  `,
  styles: `
    .cat { display: block; overflow: hidden; color: inherit; transition: border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease); }
    .cat:hover { border-color: var(--color-fresh); box-shadow: var(--shadow-lift); color: inherit; }
    .label { display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; min-height: 48px; }
    .arrow { color: var(--color-brand); }
    .circle {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      width: 100%;
      color: inherit;
      text-align: center;
    }
    .circle:hover { color: var(--color-brand); }
    .circle app-image {
      width: 78%;
      aspect-ratio: 1;
      height: auto;
      border-radius: 50%;
      overflow: hidden;
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-soft);
    }
    .circle .label {
      display: block;
      padding: 0;
      min-height: 0;
      font-size: 0.85rem;
      line-height: 1.35;
    }
  `,
})
export class CategoryCardComponent {
  @Input({ required: true }) category!: Category;
  @Input() variant: 'card' | 'circle' = 'card';
}
