import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-whatsapp-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="btn wa-btn" [href]="href" target="_blank" rel="noopener noreferrer">{{ label }}</a>
  `,
  styles: `
    .wa-btn { background: var(--color-success); }
    .wa-btn:hover { background: var(--color-forest); }
  `,
})
export class WhatsAppButtonComponent {
  @Input({ required: true }) href = '';
  @Input() label = 'استفسار واتساب';
}
