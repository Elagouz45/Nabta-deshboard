import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Crop } from '@core/models';
import { AppImageComponent } from './app-image.component';

@Component({
  selector: 'app-crop-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, AppImageComponent],
  template: `
    <a class="card crop" [routerLink]="['/crops', crop.slug]">
      <app-image [src]="crop.image" [alt]="crop.imageAltAr" [width]="800" [height]="600" objectFit="cover" fallbackKind="crop" />
      <div class="pad">
        <strong>{{ crop.nameAr }}</strong>
        <p class="muted">{{ crop.seasonAr }}</p>
      </div>
    </a>
  `,
  styles: `
    .crop { display: block; overflow: hidden; color: inherit; }
    .crop:hover { border-color: var(--color-fresh); color: inherit; }
    .pad { padding: 12px 14px; }
    p { margin: 4px 0 0; }
  `,
})
export class CropCardComponent {
  @Input({ required: true }) crop!: Crop;
}
