import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbItem } from '@core/models';
import { LocPipe } from '@shared/pipes/namaa.pipes';

@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterLink, LocPipe],
  template: `
    <nav aria-label="مسار الصفحة" class="crumbs">
      <ol>
        @for (item of items; track item.labelAr; let last = $last) {
          <li>
            @if (item.url && !last) {
              <a [routerLink]="item.url">{{ item.labelAr | loc: item.labelEn }}</a>
            } @else {
              <span aria-current="page">{{ item.labelAr | loc: item.labelEn }}</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: [`
    ol { display: flex; flex-wrap: wrap; gap: 6px; list-style: none; padding: 0; margin: 0 0 16px; color: var(--color-muted); font-size: .9rem; }
    li:not(:last-child)::after { content: '/'; margin-inline-start: 6px; }
  `],
})
export class BreadcrumbsComponent {
  @Input({ required: true }) items: BreadcrumbItem[] = [];
}

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="card empty">
      <img src="/assets/images/ui/empty-harvest.svg" width="240" height="160" alt="" />
      <h2>{{ title }}</h2>
      <p class="muted">{{ message }}</p>
      <ng-content />
    </div>
  `,
  styles: [`.empty { padding: 32px; text-align: center; }`],
})
export class EmptyStateComponent {
  @Input() title = 'لا توجد بيانات';
  @Input() message = 'جرّب تعديل البحث أو الفلاتر.';
}

@Component({
  selector: 'app-error-state',
  standalone: true,
  template: `
    <div class="card empty" role="alert">
      <img src="/assets/images/ui/error-field.svg" width="240" height="160" alt="" />
      <h2>{{ title }}</h2>
      <p class="muted">{{ message }}</p>
      <button type="button" class="btn" (click)="retry?.()">إعادة المحاولة</button>
    </div>
  `,
  styles: [`.empty { padding: 32px; text-align: center; }`],
})
export class ErrorStateComponent {
  @Input() title = 'تعذر التحميل';
  @Input() message = 'حدث خطأ أثناء جلب البيانات.';
  @Input() retry?: () => void;
}

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  template: `<div class="skel" [style.minHeight]="height" aria-hidden="true"></div>`,
  styles: [`.skel { background: linear-gradient(90deg, var(--color-mint), var(--color-pale), var(--color-mint)); background-size: 200% 100%; animation: s 1.2s infinite; border-radius: 16px; }
    @keyframes s { to { background-position: -200% 0; } }`],
})
export class LoadingSkeletonComponent {
  @Input() height = '180px';
}
