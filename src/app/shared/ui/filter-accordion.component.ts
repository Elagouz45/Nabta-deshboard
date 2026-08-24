import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-filter-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <details class="acc" [open]="open">
      <summary>
        <span class="title">{{ title }}</span>
        @if (active) {
          <span class="mark" aria-label="محدد"></span>
        }
      </summary>
      <div class="body">
        <ng-content />
      </div>
    </details>
  `,
  styles: `
    .acc { border-bottom: 1px solid var(--color-border); }
    summary {
      list-style: none;
      min-height: 48px;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-weight: 700;
      color: var(--color-forest);
      user-select: none;
    }
    summary::-webkit-details-marker { display: none; }
    .title { flex: 1; }
    .mark {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-brand);
    }
    summary::after {
      content: '';
      width: 7px;
      height: 7px;
      border-inline-end: 2px solid var(--color-muted);
      border-bottom: 2px solid var(--color-muted);
      transform: rotate(45deg);
      transition: transform var(--dur) var(--ease);
    }
    details[open] summary::after { transform: rotate(-135deg); }
    .body { padding: 0 0 14px; display: grid; gap: 10px; }
  `,
})
export class FilterAccordionComponent {
  @Input({ required: true }) title = '';
  @Input() open = true;
  @Input() active = false;
}
