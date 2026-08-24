import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@core/models';
import { CartStore } from '@state/cart/cart.store';
import { WishlistStore } from '@state/wishlist/wishlist.store';
import { ComparisonStore } from '@state/comparison/comparison.store';
import { LocPipe, TranslatePipe } from '@shared/pipes/namaa.pipes';
import { discountPercent } from '@core/utils/pricing.util';
import { LucideHeart, LucideGitCompare, LucideShoppingCart } from '@lucide/angular';
import { AppImageComponent } from './app-image.component';
import { ProductPriceComponent } from './product-price.component';
import { ProductBadgeComponent } from './product-badge.component';
import { RatingStarsComponent } from './rating-stars.component';
import { StatusBadgeComponent } from './status-badge.component';

@Component({
  selector: 'app-product-card',
  imports: [
    RouterLink,
    LocPipe,
    TranslatePipe,
    LucideHeart,
    LucideGitCompare,
    LucideShoppingCart,
    AppImageComponent,
    ProductPriceComponent,
    ProductBadgeComponent,
    RatingStarsComponent,
    StatusBadgeComponent,
  ],
  template: `
    <article class="card product-card" [class.photo]="variant === 'photo'" [class.offer]="variant === 'offer'" [class.promo]="variant === 'promo'">
      <a [routerLink]="['/products', product.slug]" class="thumb">
        <app-image
          [src]="product.thumbnail"
          [alt]="product.imageAltAr | loc: product.imageAltEn"
          [width]="800"
          [height]="imageHeight"
          [objectFit]="variant === 'photo' || variant === 'promo' ? 'cover' : 'contain'"
          fallbackKind="product"
          [surface]="variant === 'offer' ? 'var(--color-pale)' : variant === 'default' ? 'var(--color-warm)' : 'var(--color-pale)'"
        />
        <span class="badges">
          @if (product.isOnSale) {
            <app-product-badge kind="sale" [label]="'خصم ' + discount + '%'" />
          }
          @if (product.isNew && variant !== 'promo' && variant !== 'offer') {
            <app-product-badge label="جديد" />
          }
        </span>
      </a>
      <div class="body">
        @if (variant === 'offer') {
          <h3><a [routerLink]="['/products', product.slug]">{{ product.nameAr | loc: product.nameEn }}</a></h3>
          <p class="muted excerpt">{{ product.shortDescriptionAr | loc: product.shortDescriptionEn }}</p>
          <app-product-price [regular]="product.regularPrice" [sale]="product.salePrice" />
          <div class="actions">
            <button type="button" class="btn cart-btn" (click)="cart.add(product)" [disabled]="product.stockStatus === 'out_of_stock'" aria-label="أضف للسلة">
              أضف للسلة
            </button>
            <button type="button" class="icon-btn" (click)="compare.toggle(product)" [attr.aria-pressed]="compare.has(product.id)" [attr.aria-label]="'nav.compare' | t">
              <svg lucideGitCompare [size]="18"></svg>
            </button>
          </div>
        } @else {
        @if (variant !== 'promo') {
          <p class="muted meta">{{ product.formulation }} · {{ product.size }}</p>
        }
        <h3><a [routerLink]="['/products', product.slug]">{{ product.nameAr | loc: product.nameEn }}</a></h3>
        @if (variant === 'promo') {
          <p class="muted excerpt">{{ product.shortDescriptionAr | loc: product.shortDescriptionEn }}</p>
        }
        @if (variant !== 'promo') {
          <app-rating-stars [rating]="product.rating" [count]="product.reviewsCount" />
        }
        @if (variant !== 'promo' && variant !== 'photo') {
          <app-status-badge [label]="stockLabel" [tone]="stockTone" />
        }
        <app-product-price [regular]="product.regularPrice" [sale]="product.salePrice" />
        @if (variant !== 'promo' && showActions) {
          <div class="actions">
            <button type="button" class="btn" (click)="cart.add(product)" [disabled]="product.stockStatus === 'out_of_stock'">
              <svg lucideShoppingCart [size]="16"></svg> {{ 'cta.addToCart' | t }}
            </button>
            <button type="button" class="icon-btn" (click)="wishlist.toggle(product)" [attr.aria-pressed]="wishlist.has(product.id)" [attr.aria-label]="'nav.wishlist' | t">
              <svg lucideHeart [size]="18"></svg>
            </button>
            <button type="button" class="icon-btn" (click)="compare.toggle(product)" [attr.aria-pressed]="compare.has(product.id)" [attr.aria-label]="'nav.compare' | t">
              <svg lucideGitCompare [size]="18"></svg>
            </button>
          </div>
        }
        }
      </div>
    </article>
  `,
  styles: `
    .product-card { overflow: hidden; height: 100%; display: flex; flex-direction: column; transition: border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease); }
    .product-card:hover { border-color: var(--color-fresh); box-shadow: var(--shadow-lift); }
    .thumb { position: relative; background: var(--color-warm); padding: 12px; display: block; }
    .photo .thumb, .promo .thumb { padding: 0; background: var(--color-pale); }
    .thumb app-image { aspect-ratio: 1; transition: transform var(--dur-slow) var(--ease); }
    .photo .thumb app-image { aspect-ratio: 16 / 9; }
    .photo .body { padding: 10px 12px 12px; gap: 4px; }
    .photo h3 {
      font-size: 0.92rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .offer { border-color: var(--color-border); border-radius: 20px; box-shadow: none; background: var(--color-warm-white); }
    .offer:hover { border-color: var(--color-fresh); box-shadow: var(--shadow-lift); }
    .offer .thumb {
      padding: 14px 16px 8px;
      background:
        radial-gradient(ellipse at 12% 88%, rgb(104 169 111 / .16), transparent 42%),
        radial-gradient(ellipse at 88% 100%, rgb(138 106 72 / .12), transparent 38%),
        var(--color-pale);
    }
    .offer .thumb app-image { aspect-ratio: 5 / 4; }
    .offer .body { gap: 8px; padding: 8px 16px 16px; }
    .offer h3 { font-size: 0.98rem; min-height: 2.6em; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .offer .excerpt { min-height: 2.6em; }
    .offer .actions { display: flex; gap: 8px; align-items: center; }
    .offer .cart-btn {
      flex: 1;
      background: var(--color-forest);
      border-color: var(--color-forest);
    }
    .offer .cart-btn:hover { background: var(--color-brand); }
    .offer app-product-price { --price-size: 1.22rem; }
    .offer .badges { inset-inline-start: auto; inset-inline-end: 12px; top: 12px; --sale-bg: #d97706; --sale-fg: #fff; }
    .promo { box-shadow: var(--shadow-soft); }
    .promo .thumb app-image { aspect-ratio: 5 / 4; }
    .excerpt { margin: 0; font-size: 0.85rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .product-card:hover .thumb app-image { transform: scale(1.03); }
    .badges { position: absolute; top: 10px; inset-inline-start: 10px; display: grid; gap: 6px; z-index: 1; }
    .body { padding: 14px; display: grid; gap: 6px; flex: 1; }
    h3 { font-size: 1rem; margin: 0; }
    .meta { font-size: .8rem; margin: 0; }
    .actions { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-top: auto; }
    .actions .btn { flex: 1; }
    .icon-btn[aria-pressed='true'] {
      color: var(--color-brand);
      background: var(--color-mint);
    }
  `,
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Input() variant: 'default' | 'photo' | 'offer' | 'promo' = 'default';
  @Input() showActions = true;
  readonly cart = inject(CartStore);
  readonly wishlist = inject(WishlistStore);
  readonly compare = inject(ComparisonStore);

  get imageHeight(): number {
    if (this.variant === 'photo') {
      return 450;
    }
    if (this.variant === 'promo') {
      return 640;
    }
    if (this.variant === 'offer') {
      return 640;
    }
    return 800;
  }

  get discount(): number | null {
    return discountPercent(this.product);
  }

  get stockLabel(): string {
    if (this.product.stockStatus === 'out_of_stock') {
      return 'غير متوفر';
    }
    if (this.product.stockStatus === 'low_stock') {
      return 'كمية محدودة';
    }
    return 'متوفر';
  }

  get stockTone(): string {
    if (this.product.stockStatus === 'out_of_stock') {
      return 'oos';
    }
    if (this.product.stockStatus === 'low_stock') {
      return 'low';
    }
    return 'success';
  }
}
