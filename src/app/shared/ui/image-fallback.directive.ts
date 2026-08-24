import { Directive, HostListener, Input } from '@angular/core';
import { IMAGE_FALLBACKS, ImageKind } from '@core/constants/image.constants';

@Directive({
  selector: 'img[appImageFallback]',
})
export class ImageFallbackDirective {
  @Input() fallbackSrc?: string;
  @Input() fallbackKind: ImageKind = 'crop';

  private failed = false;

  @HostListener('error', ['$event'])
  onError(event: Event): void {
    if (this.failed) {
      return;
    }
    this.failed = true;
    const img = event.target as HTMLImageElement;
    img.src = this.fallbackSrc || IMAGE_FALLBACKS[this.fallbackKind];
  }
}
