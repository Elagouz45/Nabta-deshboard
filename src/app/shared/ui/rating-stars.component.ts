import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LucideStar } from '@lucide/angular';

@Component({
  selector: 'app-rating-stars',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideStar],
  template: `
    <p class="rating">
      <svg lucideStar [size]="14"></svg>
      <span>{{ rating }}</span>
      @if (count !== undefined && count !== null) {
        <span class="muted">({{ count }})</span>
      }
    </p>
  `,
  styles: `
    .rating { display: flex; align-items: center; gap: 4px; margin: 0; font-size: 0.875rem; }
  `,
})
export class RatingStarsComponent {
  @Input({ required: true }) rating = 0;
  @Input() count?: number;
}
