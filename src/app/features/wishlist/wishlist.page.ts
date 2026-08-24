import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { CatalogRepository } from '@data-access/repositories/catalog.repository';
import { Product } from '@core/models';
import { WishlistStore } from '@state/wishlist/wishlist.store';
import { CartStore } from '@state/cart/cart.store';
import { ProductCardComponent } from '@shared/ui/product-card.component';
import { EmptyStateComponent, LoadingSkeletonComponent } from '@shared/ui/feedback.component';
import { SeoService } from '@core/services/seo.service';
import { LucideShoppingCart, LucideTrash2 } from '@lucide/angular';

@Component({
  selector: 'app-wishlist-page',
  imports: [
    RouterLink,
    ProductCardComponent,
    EmptyStateComponent,
    LoadingSkeletonComponent,
    LucideShoppingCart,
    LucideTrash2,
  ],
  template: `
    <article class="wish">
      <header class="hero">
        <div class="app-container">
          <p class="kicker">محفوظاتك</p>
          <h1>المفضلة</h1>
          <p class="muted">{{ heroCopy() }}</p>
        </div>
      </header>

      <div class="app-container body">
        @if (wishlist.lastRemoved()) {
          <div class="undo" role="status">
            <p>تمت إزالة المنتج من المفضلة.</p>
            <button class="btn secondary" type="button" (click)="wishlist.undoRemove()">تراجع</button>
          </div>
        }

        @if (!wishlist.count()) {
          <app-empty-state title="المفضلة فارغة" message="اضغط أيقونة القلب على بطاقة المنتج في المتجر لحفظه هنا ومراجعته لاحقًا.">
            <div class="empty-actions">
              <a class="btn" routerLink="/shop">تسوق الآن</a>
              <a class="btn secondary" routerLink="/shop" [queryParams]="{ offersOnly: true }">تصفح العروض</a>
            </div>
          </app-empty-state>
        } @else if (!ready()) {
          <app-loading-skeleton height="320px" />
        } @else if (!products().length) {
          <app-empty-state title="تعذر تحميل المنتجات" message="قد تكون المنتجات غير متاحة. امسح القائمة وابدأ من المتجر.">
            <button class="btn" type="button" (click)="clear()">مسح المفضلة</button>
          </app-empty-state>
        } @else {
          <div class="toolbar">
            <p class="count">{{ toolbarLabel() }}</p>
            <div class="toolbar-actions">
              <a class="btn secondary" routerLink="/shop">أضف منتجات</a>
              <button class="btn ghost" type="button" (click)="clear()">مسح القائمة</button>
            </div>
          </div>
          <div class="wish-grid" [style.--n]="products().length" [attr.data-density]="density()">
            @for (p of products(); track p.id) {
              <article class="tile">
                <app-product-card [product]="p" [showActions]="false" />
                <div class="tile-actions">
                  <button class="btn" type="button" (click)="move(p)" [disabled]="p.stockStatus === 'out_of_stock'">
                    <svg lucideShoppingCart [size]="16"></svg>
                    نقل إلى السلة
                  </button>
                  <button class="btn ghost remove" type="button" (click)="remove(p)" [attr.aria-label]="'إزالة ' + p.nameAr">
                    <svg lucideTrash2 [size]="16"></svg>
                    إزالة
                  </button>
                </div>
              </article>
            }
          </div>
        }
      </div>
    </article>
  `,
  styles: `
    .wish { padding-bottom: calc(var(--space-8) + 16px); }
    .kicker {
      margin: 0 0 8px;
      color: var(--color-brand);
      font-weight: 700;
      font-size: 0.82rem;
    }
    .hero {
      padding: var(--space-6) 0 var(--space-5);
      background: linear-gradient(180deg, var(--color-pale), rgb(247 250 247 / 0.35));
    }
    .hero h1 { margin: 0 0 8px; color: var(--color-forest); }
    .hero p { margin: 0; max-width: 36rem; }
    .body { padding-top: var(--space-5); }
    .empty-actions { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-top: 8px; }
    .undo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      padding: 12px 16px;
      margin-bottom: 16px;
      border-radius: 16px;
      background: var(--color-sky-pale);
      border: 1px solid var(--color-sky-border);
    }
    .undo p { margin: 0; }
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }
    .toolbar-actions { display: flex; flex-wrap: wrap; gap: 8px; }
    .count { margin: 0; font-weight: 700; color: var(--color-forest); }
    .wish-grid {
      --n: 1;
      --max: 6;
      display: grid;
      grid-template-columns: repeat(min(var(--n), var(--max)), minmax(0, 1fr));
      gap: clamp(8px, 1.2vw, 16px);
      width: 100%;
      align-items: stretch;
    }
    .tile {
      display: grid;
      gap: 8px;
      align-content: stretch;
      min-width: 0;
    }
    .tile app-product-card {
      display: block;
      width: 100%;
      min-width: 0;
      height: 100%;
    }
    .tile-actions { display: grid; grid-template-columns: 1fr auto; gap: 8px; }
    .remove { color: var(--color-muted); }
    .wish-grid[data-density='mid'] { gap: 10px; }
    .wish-grid[data-density='tight'] { gap: 8px; }
    .wish-grid[data-density='tight'] .tile-actions .btn {
      min-height: 40px;
      padding-inline: 10px;
      font-size: 0.82rem;
    }
    .wish-grid[data-density='tight'] ::ng-deep .product-card .body { padding: 10px; gap: 4px; }
    .wish-grid[data-density='tight'] ::ng-deep .product-card h3 { font-size: 0.88rem; }
    .wish-grid[data-density='tight'] ::ng-deep .product-card .thumb { padding: 8px; }
    .wish-grid[data-density='mid'] ::ng-deep .product-card .thumb { padding: 10px; }
    @media (max-width: 639px) {
      .wish-grid { --max: 2; }
    }
    @media (max-width: 400px) {
      .wish-grid { --max: 1; }
    }
    @media (min-width: 640px) and (max-width: 1023px) {
      .wish-grid { --max: 3; }
    }
    @media (min-width: 1024px) and (max-width: 1279px) {
      .wish-grid { --max: 4; }
    }
    @media (min-width: 1280px) {
      .wish-grid { --max: 6; }
    }
    @media (max-width: 560px) {
      .wish { padding-bottom: calc(96px + env(safe-area-inset-bottom, 0px)); }
      .tile-actions { grid-template-columns: 1fr; }
      .tile-actions .btn { width: 100%; }
    }
  `,
})
export class WishlistPage {
  readonly wishlist = inject(WishlistStore);
  readonly cart = inject(CartStore);
  private readonly catalog = inject(CatalogRepository);
  private readonly seo = inject(SeoService);
  readonly products = signal<Product[]>([]);
  readonly ready = signal(false);
  readonly heroCopy = computed(() => {
    const n = this.wishlist.count();
    if (n === 0) {
      return 'احفظ المنتجات من المتجر لمراجعتها والشراء لاحقًا.';
    }
    if (n === 1) {
      return 'منتج واحد محفوظ للمراجعة قبل الشراء.';
    }
    if (n === 2) {
      return 'منتجان محفوظان للمراجعة قبل الشراء.';
    }
    if (n >= 3 && n <= 10) {
      return `${n} منتجات محفوظة للمراجعة قبل الشراء.`;
    }
    return `${n} منتجًا محفوظًا للمراجعة قبل الشراء.`;
  });
  readonly toolbarLabel = computed(() => {
    const n = this.products().length;
    if (n === 1) {
      return 'منتج واحد';
    }
    if (n === 2) {
      return 'منتجان';
    }
    if (n >= 3 && n <= 10) {
      return `${n} منتجات`;
    }
    return `${n} منتجًا`;
  });
  readonly density = computed(() => {
    const n = this.products().length;
    if (n <= 2) {
      return 'roomy';
    }
    if (n <= 4) {
      return 'mid';
    }
    return 'tight';
  });

  constructor() {
    this.seo.set({ title: 'المفضلة', description: 'المنتجات المحفوظة', path: '/wishlist' });
    effect(() => {
      const ids = this.wishlist.ids();
      untracked(() => this.loadProducts(ids));
    });
  }

  move(product: Product): void {
    if (!this.cart.add(product)) {
      return;
    }
    this.wishlist.remove(product.id, { silent: true });
  }

  remove(product: Product): void {
    this.wishlist.remove(product.id);
  }

  clear(): void {
    if (confirm('مسح كل المفضلة؟')) {
      this.wishlist.clear();
    }
  }

  private loadProducts(ids: string[]): void {
    if (!ids.length) {
      this.products.set([]);
      this.ready.set(true);
      return;
    }
    if (!this.products().length) {
      this.ready.set(false);
    } else {
      this.products.update((rows) => rows.filter((p) => ids.includes(p.id)));
    }
    forkJoin(ids.map((id) => this.catalog.getProductById(id).pipe(catchError(() => of(null))))).subscribe((rows) => {
      const order = new Map(ids.map((id, i) => [id, i]));
      this.products.set(
        rows.filter((p): p is Product => !!p).sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0)),
      );
      this.ready.set(true);
    });
  }
}
