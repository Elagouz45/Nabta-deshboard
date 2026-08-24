import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export interface FilterChip {
  key: string;
  label: string;
}

@Component({
  selector: 'app-active-filter-chips',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (chips.length) {
      <div class="chips">
        @for (chip of chips; track chip.key) {
          <button type="button" class="chip" (click)="remove.emit(chip.key)">{{ chip.label }} ×</button>
        }
        <button type="button" class="btn ghost" (click)="clear.emit()">مسح الكل</button>
      </div>
    }
  `,
  styles: `
    .chips { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 12px; }
    .chip {
      min-height: 36px;
      border: 1px solid var(--color-border);
      background: var(--color-mint);
      color: var(--color-forest);
      border-radius: var(--radius-pill);
      padding: 0 12px;
      cursor: pointer;
      font: inherit;
      font-size: 0.875rem;
    }
    .chip:hover { border-color: var(--color-brand); }
  `,
})
export class ActiveFilterChipsComponent {
  @Input() chips: FilterChip[] = [];
  @Output() remove = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();
}
