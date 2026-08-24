import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-section-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="head">
      <div>
        <h2>{{ title }}</h2>
        @if (subtitle) {
          <p class="muted">{{ subtitle }}</p>
        }
      </div>
      @if (link) {
        <a class="more" [routerLink]="link" [queryParams]="queryParams">{{ linkLabel }}</a>
      }
    </div>
  `,
  styles: `
    .head {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: var(--space-4);
      margin-bottom: var(--space-5);
    }
    h2 { margin: 0; }
    p { margin: 6px 0 0; }
    .more { min-height: 44px; display: inline-flex; align-items: center; }
  `,
})
export class SectionHeaderComponent {
  @Input({ required: true }) title = '';
  @Input() subtitle = '';
  @Input() link?: string | unknown[];
  @Input() linkLabel = 'عرض الكل';
  @Input() queryParams?: Record<string, string | number | boolean>;
}
