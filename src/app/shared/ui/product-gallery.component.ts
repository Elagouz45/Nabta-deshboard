import { Component, HostListener, Input, computed, inject, signal } from '@angular/core';
import { DIALOG_DATA, Dialog, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { ProductImage } from '@core/models';
import { AppImageComponent } from './app-image.component';

interface GalleryDialogData {
  images: ProductImage[];
  index: number;
}

@Component({
  selector: 'app-gallery-lightbox',
  imports: [AppImageComponent],
  template: `
    <div class="box" role="dialog" aria-modal="true" [attr.aria-label]="'معاينة الصورة ' + (index() + 1)">
      <button type="button" class="icon-btn close" (click)="close()" aria-label="إغلاق">×</button>
      <app-image [src]="current.url" [alt]="current.altAr" [width]="current.width" [height]="current.height" objectFit="contain" fallbackKind="product" surface="#111" />
      <p class="count">{{ index() + 1 }} / {{ images.length }}</p>
      <button type="button" class="nav prev" (click)="prev()" aria-label="السابق">›</button>
      <button type="button" class="nav next" (click)="next()" aria-label="التالي">‹</button>
    </div>
  `,
  styles: `
    .box { position: relative; width: min(92vw, 860px); background: #111; color: #fff; padding: 16px; border-radius: 16px; }
    .close { position: absolute; inset-block-start: 8px; inset-inline-end: 8px; z-index: 2; color: #fff; }
    .count { text-align: center; margin: 8px 0 0; }
    .nav { position: absolute; top: 50%; transform: translateY(-50%); background: rgb(0 0 0 / .45); color: #fff; border: 0; min-width: 44px; min-height: 44px; border-radius: 999px; cursor: pointer; font-size: 1.6rem; }
    .prev { inset-inline-start: 8px; }
    .next { inset-inline-end: 8px; }
  `,
})
export class GalleryLightboxComponent {
  private readonly data = inject<GalleryDialogData>(DIALOG_DATA);
  private readonly ref = inject(DialogRef);
  readonly images = this.data.images;
  readonly index = signal(this.data.index);

  get current(): ProductImage {
    return this.images[this.index()] ?? this.images[0];
  }

  close(): void {
    this.ref.close();
  }

  next(): void {
    this.index.update((i) => (i + 1) % this.images.length);
  }
  prev(): void {
    this.index.update((i) => (i - 1 + this.images.length) % this.images.length);
  }

  @HostListener('document:keydown', ['$event'])
  onKey(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      this.next();
    }
    if (event.key === 'ArrowRight') {
      this.prev();
    }
  }
}

@Component({
  selector: 'app-product-gallery',
  imports: [AppImageComponent, DialogModule],
  template: `
    <div class="gallery">
      <button type="button" class="stage" (pointerdown)="onPointerDown($event)" (pointerup)="onStageUp($event)" [attr.aria-label]="'تكبير الصورة ' + (index() + 1)">
        <app-image
          [src]="current.url"
          [alt]="current.altAr"
          [width]="current.width"
          [height]="current.height"
          objectFit="contain"
          fallbackKind="product"
          surface="var(--color-warm, #faf8f3)"
        />
      </button>
      <p class="count">{{ index() + 1 }} / {{ images.length }}</p>
      <div class="thumbs" role="list">
        @for (img of images; track img.id; let i = $index) {
          <button
            type="button"
            class="thumb"
            [class.active]="i === index()"
            (click)="index.set(i)"
            [attr.aria-label]="img.altAr"
            [attr.aria-current]="i === index()"
          >
            <app-image [src]="img.url" [alt]="img.altAr" [width]="80" [height]="80" objectFit="contain" fallbackKind="product" />
          </button>
        }
      </div>
      <div class="controls">
        <button type="button" class="btn secondary" (click)="prev()" aria-label="الصورة السابقة">السابق</button>
        <button type="button" class="btn secondary" (click)="next()" aria-label="الصورة التالية">التالي</button>
        <button type="button" class="btn ghost" (click)="open()">معاينة</button>
      </div>
    </div>
  `,
  styles: `
    .stage { width: 100%; border: 0; background: var(--color-warm, #faf8f3); border-radius: 16px; padding: 16px; cursor: zoom-in; }
    .count { text-align: center; color: var(--color-muted); }
    .thumbs { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
    .thumb { width: 72px; border: 2px solid transparent; border-radius: 12px; padding: 4px; background: var(--color-warm); cursor: pointer; }
    .thumb.active { border-color: var(--color-leaf); }
    .controls { display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
  `,
})
export class ProductGalleryComponent {
  private readonly dialog = inject(Dialog);
  @Input({ required: true }) images: ProductImage[] = [];
  readonly index = signal(0);
  private startX = 0;

  readonly currentImage = computed(() => this.images[this.index()] ?? this.images[0]);

  get current(): ProductImage {
    return this.currentImage();
  }

  next(): void {
    if (!this.images.length) {
      return;
    }
    this.index.update((i) => (i + 1) % this.images.length);
  }
  prev(): void {
    if (!this.images.length) {
      return;
    }
    this.index.update((i) => (i - 1 + this.images.length) % this.images.length);
  }

  open(): void {
    this.dialog.open(GalleryLightboxComponent, {
      autoFocus: 'first-tabbable',
      hasBackdrop: true,
      data: { images: this.images, index: this.index() } satisfies GalleryDialogData,
    });
  }

  onPointerDown(event: PointerEvent): void {
    this.startX = event.clientX;
  }
  onStageUp(event: PointerEvent): void {
    const dx = event.clientX - this.startX;
    if (Math.abs(dx) >= 40) {
      if (dx > 0) {
        this.next();
      } else {
        this.prev();
      }
      return;
    }
    this.open();
  }
}
