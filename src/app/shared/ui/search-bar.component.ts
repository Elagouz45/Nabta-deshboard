import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideSearch } from '@lucide/angular';

@Component({
  selector: 'app-search-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, LucideSearch],
  template: `
    <form class="search" (submit)="$event.preventDefault(); searched.emit(value.trim())">
      <label class="sr-only" [attr.for]="inputId">{{ label }}</label>
      <input class="input" [id]="inputId" name="q" [ngModel]="value" (ngModelChange)="onType($event)" [placeholder]="placeholder" />
      <button class="btn" type="submit"><svg lucideSearch [size]="18"></svg> بحث</button>
    </form>
  `,
  styles: `
    :host { display: block; width: 100%; }
    .search { display: flex; gap: 8px; width: 100%; min-width: 0; }
    .input { border-radius: var(--radius-search); min-width: 0; flex: 1; }
    .btn { flex: 0 0 auto; }
    @media (max-width: 400px) {
      .btn { padding-inline: 10px; }
    }
  `,
})
export class SearchBarComponent {
  @Input() value = '';
  @Input() placeholder = 'ابحث باسم المنتج، المحصول، المشكلة أو المادة الفعالة';
  @Input() label = 'بحث';
  @Input() inputId = 'search-q';
  @Output() valueChange = new EventEmitter<string>();
  @Output() searched = new EventEmitter<string>();

  onType(next: string): void {
    this.value = next;
    this.valueChange.emit(next);
  }
}
