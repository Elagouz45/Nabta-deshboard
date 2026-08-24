import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartStore } from '@state/cart/cart.store';
import { AccountRepository } from '@data-access/repositories/account.repository';
import { EmptyStateComponent } from '@shared/ui/feedback.component';
import { AppImageComponent } from '@shared/ui/app-image.component';
import { QuantitySelectorComponent } from '@shared/ui/quantity-selector.component';
import { ProductPriceComponent } from '@shared/ui/product-price.component';
import { LocPipe, MoneyPipe } from '@shared/pipes/namaa.pipes';
import { SeoService } from '@core/services/seo.service';
import { UiStore } from '@state/ui/ui.store';
import { MAX_CART_QTY } from '@core/constants/app.constants';
import { LucideTrash2 } from '@lucide/angular';

@Component({
  selector: 'app-cart-page',
  imports: [
    RouterLink,
    FormsModule,
    EmptyStateComponent,
    LocPipe,
    MoneyPipe,
    AppImageComponent,
    QuantitySelectorComponent,
    ProductPriceComponent,
    LucideTrash2,
  ],
  template: `
    <article class="cart">
      <header class="cart-hero">
        <div class="app-container">
          <p class="kicker">طلبك</p>
          <h1>سلة التسوق</h1>
          @if (cart.views().length) {
            <p class="muted">{{ reviewCopy }}</p>
          }
        </div>
      </header>

      <div class="app-container body">
        @if (cart.lastRemoved()) {
          <div class="undo" role="status">
            <p>تمت إزالة المنتج من السلة.</p>
            <button class="btn secondary" type="button" (click)="cart.undoRemove()">تراجع عن الحذف</button>
          </div>
        }
        @if (!cart.views().length) {
          <app-empty-state title="السلة فارغة" message="أضف منتجات من المتجر للبدء.">
            <div class="empty-actions">
              <a class="btn" routerLink="/shop">متابعة التسوق</a>
              <a class="btn secondary" routerLink="/shop" [queryParams]="{ offersOnly: true }">تصفح العروض</a>
            </div>
          </app-empty-state>
        } @else {
          <div class="layout">
            <div class="lines">
              @for (item of cart.views(); track item.productId) {
                <article class="card line">
                  <a class="thumb" [routerLink]="['/products', item.product.slug]">
                    <app-image
                      [src]="item.product.thumbnail"
                      [alt]="item.product.imageAltAr | loc: item.product.imageAltEn"
                      [width]="160"
                      [height]="160"
                      objectFit="contain"
                      fallbackKind="product"
                      surface="var(--color-pale)"
                    />
                  </a>
                  <div class="info">
                    <h2>
                      <a [routerLink]="['/products', item.product.slug]">{{ item.product.nameAr | loc: item.product.nameEn }}</a>
                    </h2>
                    <p class="muted meta">{{ item.product.formulation }} · {{ item.product.size }}</p>
                    <app-product-price [regular]="item.product.regularPrice" [sale]="item.product.salePrice" />
                    <app-quantity-selector
                      [value]="item.quantity"
                      [max]="qtyMax(item.product.stockQuantity)"
                      (valueChange)="cart.setQuantity(item.productId, $event)"
                    />
                  </div>
                  <div class="line-side">
                    <p class="line-total">{{ item.lineTotal | money }}</p>
                    <button class="btn ghost remove" type="button" (click)="cart.remove(item.productId)" [attr.aria-label]="'حذف ' + item.product.nameAr">
                      <svg lucideTrash2 [size]="16"></svg>
                      حذف
                    </button>
                  </div>
                </article>
              }
            </div>
            <aside class="card summary">
              <h2>ملخص الطلب</h2>
              <dl>
                <div><dt>المجموع قبل الخصم</dt><dd>{{ cart.breakdown().itemsSubtotal | money }}</dd></div>
                <div><dt>خصم العروض</dt><dd>{{ cart.breakdown().saleDiscount | money }}</dd></div>
                <div><dt>خصم الكوبون</dt><dd>{{ cart.breakdown().couponDiscount | money }}</dd></div>
                <div><dt>الشحن التقديري</dt><dd>{{ cart.breakdown().shipping | money }}</dd></div>
                <div class="total"><dt>الإجمالي</dt><dd>{{ cart.breakdown().total | money }}</dd></div>
              </dl>
              <p class="muted hint">الشحن التقديري داخل مصر. القيمة النهائية تظهر بعد اختيار طريقة الشحن في إتمام الطلب.</p>
              <form class="coupon" (submit)="$event.preventDefault(); applyCoupon()">
                <label class="sr-only" for="coupon-code">كوبون</label>
                <input id="coupon-code" class="input" name="coupon" [(ngModel)]="code" placeholder="رمز الكوبون" autocomplete="off" />
                <button class="btn secondary" type="submit">تطبيق</button>
              </form>
              @if (cart.coupon(); as coupon) {
                <p class="applied">
                  تم تطبيق <strong>{{ coupon.code }}</strong>
                  <button class="btn ghost compact" type="button" (click)="clearCoupon()">إزالة</button>
                </p>
              }
              <a class="btn checkout" routerLink="/checkout">إتمام الطلب</a>
              <a class="btn secondary" routerLink="/shop">متابعة التسوق</a>
            </aside>
          </div>
        }
      </div>
    </article>
  `,
  styles: `
    .cart { padding-bottom: calc(var(--space-8) + 16px); }
    .kicker {
      margin: 0 0 8px;
      color: var(--color-brand);
      font-weight: 700;
      font-size: 0.82rem;
    }
    .cart-hero {
      padding: var(--space-6) 0 var(--space-5);
      background: linear-gradient(180deg, var(--color-pale), rgb(247 250 247 / 0.35));
    }
    .cart-hero h1 { margin: 0 0 8px; color: var(--color-forest); }
    .cart-hero p { margin: 0; }
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
    .layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(260px, 320px); gap: 24px; align-items: start; }
    .line {
      display: grid;
      grid-template-columns: 112px minmax(0, 1fr) auto;
      gap: 16px;
      padding: 16px;
      margin-bottom: 12px;
      border-radius: 20px;
      background: var(--color-warm-white);
    }
    .thumb { display: block; background: var(--color-pale); border-radius: 14px; overflow: hidden; }
    .info { display: grid; gap: 6px; align-content: start; }
    .info h2 { margin: 0; font-size: 1.05rem; }
    .meta { margin: 0; font-size: 0.85rem; }
    .line-side { display: grid; gap: 10px; justify-items: end; align-content: space-between; }
    .line-total { margin: 0; font-weight: 800; color: var(--color-forest); font-size: 1.05rem; }
    .remove { color: var(--color-muted); }
    .summary {
      padding: 20px;
      border-radius: 20px;
      height: max-content;
      position: sticky;
      top: 96px;
      background: var(--color-warm-white);
      display: grid;
      gap: 12px;
    }
    .summary h2 { margin: 0; color: var(--color-forest); font-size: 1.15rem; }
    dl { margin: 0; display: grid; gap: 8px; }
    dl > div { display: flex; justify-content: space-between; gap: 12px; font-size: 0.92rem; }
    dt { color: var(--color-muted); }
    dd { margin: 0; font-weight: 700; }
    .total { padding-top: 8px; border-top: 1px solid var(--color-border); font-size: 1rem; }
    .total dd { color: var(--color-forest); }
    .hint { margin: 0; font-size: 0.8rem; }
    .coupon { display: flex; gap: 8px; flex-wrap: wrap; }
    .coupon .input { flex: 1; min-width: 0; }
    .applied { margin: 0; display: flex; align-items: center; gap: 8px; color: var(--color-success); }
    .compact { min-height: 36px; padding-inline: 10px; }
    .checkout { background: var(--color-forest); border-color: var(--color-forest); }
    @media (max-width: 800px) {
      .layout { grid-template-columns: 1fr; }
      .summary { position: static; }
      .line { grid-template-columns: 88px minmax(0, 1fr); }
      .line-side { grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: center; }
    }
    @media (max-width: 560px) {
      .cart { padding-bottom: calc(96px + env(safe-area-inset-bottom, 0px)); }
      .checkout, .summary .btn.secondary { width: 100%; }
      .coupon .btn { width: 100%; }
    }
  `,
})
export class CartPage {
  readonly cart = inject(CartStore);
  private readonly accounts = inject(AccountRepository);
  private readonly seo = inject(SeoService);
  private readonly ui = inject(UiStore);
  code = '';

  constructor() {
    this.seo.set({ title: 'السلة', description: 'مراجعة سلة التسوق', path: '/cart' });
  }

  get reviewCopy(): string {
    const n = this.cart.quantity();
    if (n === 1) {
      return 'منتج واحد جاهز للمراجعة قبل إتمام الطلب.';
    }
    if (n === 2) {
      return 'منتجان جاهزان للمراجعة قبل إتمام الطلب.';
    }
    if (n >= 3 && n <= 10) {
      return `${n} منتجات جاهزة للمراجعة قبل إتمام الطلب.`;
    }
    return `${n} منتجًا جاهزًا للمراجعة قبل إتمام الطلب.`;
  }

  qtyMax(stock: number): number {
    return Math.max(1, Math.min(MAX_CART_QTY, stock || MAX_CART_QTY));
  }

  applyCoupon(): void {
    this.accounts.validateCoupon(this.code, this.cart.breakdown().itemsSubtotal - this.cart.breakdown().saleDiscount).subscribe({
      next: (c) => {
        this.cart.setCoupon(c);
        this.code = c.code;
        this.ui.toast('تم تطبيق الكوبون.');
      },
      error: (err: { messageAr?: string }) => this.ui.toast(err.messageAr ?? 'كوبون غير صالح', 'error'),
    });
  }

  clearCoupon(): void {
    this.cart.setCoupon(null);
    this.code = '';
    this.ui.toast('تم إلغاء الكوبون.');
  }
}
