import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="st" [attr.data-tone]="tone">{{ label }}</span>`,
  styles: `
    .st {
      display: inline-flex;
      min-height: 24px;
      padding: 0 8px;
      border-radius: var(--radius-pill);
      font-size: 0.75rem;
      background: var(--color-mint);
      color: var(--color-forest);
    }
    .st[data-tone='error'], .st[data-tone='cancelled'], .st[data-tone='oos'] { background: #fde8e6; color: var(--color-error); }
    .st[data-tone='warning'], .st[data-tone='pending'], .st[data-tone='low'] { background: var(--color-sun-soft); color: var(--color-warning); }
    .st[data-tone='info'], .st[data-tone='shipped'] { background: var(--color-sky-pale); color: var(--color-info); }
    .st[data-tone='success'], .st[data-tone='delivered'] { background: var(--color-mint); color: var(--color-success); }
  `,
})
export class StatusBadgeComponent {
  @Input({ required: true }) label = '';
  @Input() tone = 'default';
}
