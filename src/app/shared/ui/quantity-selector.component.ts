import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quantity-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <div class="qty" role="group" [attr.aria-label]="label">
      <button type="button" class="icon-btn" (click)="change(-1)" [disabled]="value <= min" aria-label="إنقاص">−</button>
      <input class="input" type="number" [min]="min" [max]="max" [ngModel]="value" (ngModelChange)="set($event)" />
      <button type="button" class="icon-btn" (click)="change(1)" [disabled]="value >= max" aria-label="زيادة">+</button>
    </div>
  `,
  styles: `
    .qty { display: flex; align-items: center; gap: 4px; max-width: 160px; }
    input { text-align: center; }
  `,
})
export class QuantitySelectorComponent {
  @Input() value = 1;
  @Input() min = 1;
  @Input() max = 99;
  @Input() label = 'الكمية';
  @Output() valueChange = new EventEmitter<number>();

  change(delta: number): void {
    this.set(this.value + delta);
  }

  set(raw: number): void {
    const next = Math.min(this.max, Math.max(this.min, Number(raw) || this.min));
    this.valueChange.emit(next);
  }
}
