import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Company } from '@core/models';
import { AppImageComponent } from './app-image.component';

@Component({
  selector: 'app-company-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, AppImageComponent],
  template: `
    <a
      [class]="variant === 'circle' ? 'circle' : 'card co'"
      [routerLink]="['/companies', company.slug]"
    >
      <span class="media">
        <app-image
          [src]="company.logo"
          [alt]="company.nameAr"
          [width]="variant === 'circle' ? 400 : 1200"
          [height]="variant === 'circle' ? 400 : 800"
          objectFit="cover"
          fallbackKind="company"
        />
        @if (variant !== 'circle') {
          <span class="place">{{ company.country }}</span>
        }
      </span>
      <div class="pad">
        <h3>{{ company.nameAr }}</h3>
        @if (showDescription) {
          <p class="muted desc">{{ company.descriptionAr }}</p>
        }
        @if (variant !== 'circle') {
          <span class="cta">عرض الشركة ‹</span>
        }
      </div>
    </a>
  `,
  styles: `
    .co {
      display: grid;
      overflow: hidden;
      color: inherit;
      padding: 0;
      transition: border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease), transform var(--dur) var(--ease);
    }
    .co:hover {
      color: inherit;
      border-color: var(--color-fresh);
      box-shadow: var(--shadow-soft);
    }
    .media {
      display: block;
      position: relative;
      aspect-ratio: 3 / 2;
      overflow: hidden;
      background: var(--color-pale);
    }
    .media app-image,
    .media .frame { height: 100%; }
    .place {
      position: absolute;
      inset-inline-start: 10px;
      bottom: 10px;
      z-index: 1;
      background: rgb(252 253 251 / .92);
      color: var(--color-forest);
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: var(--radius-pill);
    }
    .pad { padding: 14px 16px 16px; display: grid; gap: 6px; }
    h3 { margin: 0; font-size: 1.05rem; line-height: 1.4; }
    .desc {
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      font-size: 0.88rem;
    }
    .cta {
      margin-top: 4px;
      color: var(--color-brand);
      font-size: 0.85rem;
      font-weight: 700;
    }
    .circle {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      width: 100%;
      color: inherit;
      text-align: center;
    }
    .circle:hover { color: var(--color-brand); }
    .circle .media {
      width: 78%;
      aspect-ratio: 1;
      border-radius: 50%;
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-soft);
    }
    .circle .place { display: none; }
    .circle .pad { padding: 0; }
    .circle h3 { font-size: 0.85rem; line-height: 1.35; }
  `,
})
export class CompanyCardComponent {
  @Input({ required: true }) company!: Company;
  @Input() showDescription = false;
  @Input() variant: 'card' | 'circle' = 'card';
}
