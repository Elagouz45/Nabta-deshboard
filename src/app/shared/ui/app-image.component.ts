import { Component, Input, computed, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { IMAGE_FALLBACKS, ImageKind, isRasterSrc } from '@core/constants/image.constants';
import { ImageFallbackDirective } from './image-fallback.directive';

@Component({
  selector: 'app-image',
  imports: [NgOptimizedImage, ImageFallbackDirective],
  host: { '[class.fill]': 'fill' },
  template: `
    <span class="frame" [class.ready]="loaded()" [class.fill]="fill" [style.aspect-ratio]="fill ? null : ratio()" [style.background]="surface">
      @if (useNgSrc()) {
        <img
          [ngSrc]="activeSrc()"
          [alt]="alt"
          [width]="width"
          [height]="height"
          [priority]="priority"
          [attr.sizes]="sizes || null"
          [style.object-fit]="objectFit"
          (error)="onError()"
          (load)="loaded.set(true)"
        />
      } @else {
        <img
          [src]="activeSrc()"
          [alt]="alt"
          [width]="width"
          [height]="height"
          [loading]="priority ? 'eager' : loading"
          [style.object-fit]="objectFit"
          appImageFallback
          [fallbackSrc]="fallback()"
          (load)="loaded.set(true)"
        />
      }
    </span>
  `,
  styles: `
    :host { display: block; }
    :host.fill { height: 100%; }
    .frame {
      display: block;
      position: relative;
      overflow: hidden;
      width: 100%;
      background: var(--color-sand, #f2ebdd);
      border-radius: inherit;
    }
    .frame.fill { height: 100%; }
    .frame::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgb(255 255 255 / .35), transparent);
      transform: translateX(-100%);
      animation: shimmer 1.2s infinite;
    }
    .frame.ready::before { display: none; }
    img {
      display: block;
      width: 100%;
      height: 100%;
      max-width: none;
      position: relative;
      z-index: 1;
    }
    @keyframes shimmer {
      to { transform: translateX(100%); }
    }
  `,
})
export class AppImageComponent {
  @Input({ required: true }) src = '';
  @Input({ required: true }) alt = '';
  @Input() width = 800;
  @Input() height = 800;
  @Input() loading: 'lazy' | 'eager' = 'lazy';
  @Input() priority = false;
  @Input() objectFit: 'cover' | 'contain' = 'cover';
  @Input() fallbackKind: ImageKind = 'crop';
  @Input() sizes?: string;
  @Input() surface = 'var(--color-sand, #f2ebdd)';
  @Input() fill = false;

  readonly loaded = signal(false);
  readonly failed = signal(false);
  readonly fallback = computed(() => IMAGE_FALLBACKS[this.fallbackKind]);
  readonly activeSrc = computed(() => (this.failed() ? this.fallback() : this.src) || this.fallback());
  readonly useNgSrc = computed(() => isRasterSrc(this.activeSrc()));
  readonly ratio = computed(() => `${this.width} / ${this.height}`);

  onError(): void {
    this.failed.set(true);
    this.loaded.set(true);
  }
}
