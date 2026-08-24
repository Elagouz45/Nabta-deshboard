import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CatalogRepository } from '@data-access/repositories/catalog.repository';
import { Product, Review } from '@core/models';
import { CartStore } from '@state/cart/cart.store';
import { WishlistStore } from '@state/wishlist/wishlist.store';
import { ComparisonStore } from '@state/comparison/comparison.store';
import { RecentlyViewedStore } from '@state/ui/recently-viewed.store';
import { AuthStore } from '@state/auth/auth.store';
import { ProductCardComponent } from '@shared/ui/product-card.component';
import { ProductGalleryComponent } from '@shared/ui/product-gallery.component';
import { BreadcrumbsComponent, ErrorStateComponent, LoadingSkeletonComponent } from '@shared/ui/feedback.component';
import { QuantitySelectorComponent } from '@shared/ui/quantity-selector.component';
import { ProductPriceComponent } from '@shared/ui/product-price.component';
import { RatingStarsComponent } from '@shared/ui/rating-stars.component';
import { StatusBadgeComponent } from '@shared/ui/status-badge.component';
import { WhatsAppButtonComponent } from '@shared/ui/whatsapp-button.component';
import { LocPipe, TranslatePipe } from '@shared/pipes/namaa.pipes';
import { SeoService } from '@core/services/seo.service';
import { BRAND } from '@core/tokens/brand.token';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-product-details-page',
  imports: [FormsModule, RouterLink, ProductCardComponent, ProductGalleryComponent, BreadcrumbsComponent, ErrorStateComponent, LoadingSkeletonComponent, LocPipe, TranslatePipe, ProductPriceComponent, QuantitySelectorComponent, RatingStarsComponent, StatusBadgeComponent, WhatsAppButtonComponent],
  template: `
    <div class="app-container section">
      @if (loading()) { <app-loading-skeleton height="400px" /> }
      @else if (!product()) { <app-error-state title="المنتج غير موجود" message="تحقق من الرابط أو عد إلى المتجر." /> }
      @else {
        <app-breadcrumbs [items]="crumbs()" />
        <div class="grid">
          <div>
            <app-product-gallery [images]="product()!.images" />
          </div>
          <div class="buy">
            <p class="muted">{{ product()!.sku }}</p>
            <h1>{{ product()!.nameAr | loc: product()!.nameEn }}</h1>
            <app-rating-stars [rating]="product()!.rating" [count]="product()!.reviewsCount" />
            <app-status-badge [label]="product()!.stockStatus === 'out_of_stock' ? 'غير متوفر' : 'متوفر'" [tone]="product()!.stockStatus === 'out_of_stock' ? 'oos' : 'success'" />
            <app-product-price [regular]="product()!.regularPrice" [sale]="product()!.salePrice" />
            <p>{{ product()!.shortDescriptionAr | loc: product()!.shortDescriptionEn }}</p>
            <p class="muted">{{ product()!.formulation }} · {{ product()!.size }}</p>
            <app-quantity-selector [value]="qty" (valueChange)="qty = $event" />
            <div class="row">
              <button class="btn" type="button" (click)="add()" [disabled]="product()!.stockStatus === 'out_of_stock'">{{ 'cta.addToCart' | t }}</button>
              <button class="btn secondary" type="button" (click)="buy()">{{ 'cta.buyNow' | t }}</button>
              <button
                class="btn ghost"
                type="button"
                (click)="wishlist.toggle(product()!)"
                [attr.aria-pressed]="wishlist.has(product()!.id)"
              >
                {{ wishlist.has(product()!.id) ? 'في المفضلة' : 'مفضلة' }}
              </button>
              @if (wishlist.count()) {
                <a class="btn secondary" routerLink="/wishlist">عرض المفضلة</a>
              }
              <button
                class="btn ghost"
                type="button"
                (click)="compare.toggle(product()!)"
                [attr.aria-pressed]="compare.has(product()!.id)"
              >
                {{ compare.has(product()!.id) ? 'في المقارنة' : 'قارن' }}
              </button>
              @if (compare.count()) {
                <a class="btn secondary" routerLink="/compare">عرض المقارنة</a>
              }
            </div>
            <app-whatsapp-button [href]="'https://wa.me/' + brand.whatsappNumber + '?text=' + product()!.nameAr" />
            <p class="note sky">تقدير التوصيل 3–6 أيام عمل داخل مصر. الإرجاع وفق السياسة المعلنة للمنتجات المغلقة.</p>
            <p class="note mint">{{ 'disclaimer.agri' | t }}</p>
          </div>
        </div>
        <section class="note mint">
          <h2>الوصف</h2>
          <p>{{ product()!.descriptionAr }}</p>
        </section>
        <section class="note mint">
          <h2>المكونات والمادة الفعالة</h2>
          <ul>@for (i of product()!.activeIngredients; track i.nameEn) { <li>{{ i.nameAr }} — {{ i.concentration }}</li> }</ul>
          <p>التركيب: {{ product()!.composition }} · الصياغة: {{ product()!.formulation }} · المنشأ: {{ product()!.countryOfOrigin }} · الحجم: {{ product()!.size }}</p>
        </section>
        <section class="note mint">
          <h2>المميزات والجرعة والاستخدام</h2>
          <ul>@for (b of product()!.benefits; track b.ar) { <li>{{ b.ar }}</li> }</ul>
          <p>{{ product()!.dosage.ar }}</p>
          <p>{{ product()!.usageInstructions.ar }}</p>
        </section>
        <section class="note sky">
          <h2>احتياطات الأمان</h2>
          <p>{{ product()!.safetyInstructions.ar }}</p>
          <p>{{ product()!.preHarvestInterval.ar }}</p>
        </section>
        <section>
          <h2>المراجعات</h2>
          @for (r of reviews(); track r.id) {
            <article class="card pad"><strong>{{ r.userName }}</strong> — {{ r.rating }}/5<p>{{ r.bodyAr }}</p></article>
          }
          @if (auth.isLoggedIn()) {
            <form class="card pad" (submit)="$event.preventDefault(); sendReview()">
              <label>التقييم <input class="input" type="number" min="1" max="5" [(ngModel)]="reviewRating" name="rating" /></label>
              <label>تعليقك <textarea class="input" [(ngModel)]="reviewBody" name="body"></textarea></label>
              <button class="btn" type="submit">إرسال مراجعة</button>
            </form>
          }
        </section>
        <section>
          <h2>منتجات ذات صلة</h2>
          <div class="grid-products">@for (p of related(); track p.id) { <app-product-card [product]="p" /> }</div>
        </section>
      }
    </div>
  `,
  styles: [`
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
    .buy { display: grid; gap: 10px; align-content: start; }
    .row { display: flex; gap: 8px; flex-wrap: wrap; }
    .note { padding: 16px; border-radius: 16px; margin: 16px 0; }
    .sky { background: var(--color-sky-pale); }
    .mint { background: var(--color-mint); }
    .pad { padding: 16px; margin: 16px 0; }
    @media (max-width: 800px) { .grid { grid-template-columns: 1fr; } }
    @media (max-width: 560px) {
      .buy .btn, .row .btn { width: 100%; }
      .row { align-items: stretch; }
    }
  `],
})
export class ProductDetailsPage {
  private readonly catalog = inject(CatalogRepository);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  readonly cart = inject(CartStore);
  readonly wishlist = inject(WishlistStore);
  readonly compare = inject(ComparisonStore);
  readonly recent = inject(RecentlyViewedStore);
  readonly auth = inject(AuthStore);
  readonly brand = inject(BRAND);

  readonly product = signal<Product | null>(null);
  readonly related = signal<Product[]>([]);
  readonly reviews = signal<Review[]>([]);
  readonly loading = signal(true);
  readonly crumbs = signal([{ labelAr: 'الرئيسية', labelEn: 'Home', url: '/' }, { labelAr: 'المتجر', labelEn: 'Shop', url: '/shop' }, { labelAr: 'منتج', labelEn: 'Product' }]);
  qty = 1;
  reviewRating = 5;
  reviewBody = '';

  constructor() {
    this.route.paramMap.pipe(switchMap((p) => this.catalog.getProductBySlug(p.get('slug') || ''))).subscribe({
      next: (product) => {
        this.product.set(product);
        this.recent.add(product.id);
        this.seo.set({
          title: product.nameAr,
          description: product.shortDescriptionAr,
          path: `/products/${product.slug}`,
          image: product.thumbnail,
          type: 'product',
        });
        this.seo.productJsonLd(product, `/products/${product.slug}`);
        this.crumbs.set([
          { labelAr: 'الرئيسية', labelEn: 'Home', url: '/' },
          { labelAr: 'المتجر', labelEn: 'Shop', url: '/shop' },
          { labelAr: product.nameAr, labelEn: product.nameEn },
        ]);
        this.loading.set(false);
        this.catalog.relatedProducts(product.id).subscribe((rows) => this.related.set(rows));
        this.catalog.listReviews(product.id).subscribe((rows) => this.reviews.set(rows));
      },
      error: () => this.loading.set(false),
    });
  }

  add(): void {
    const p = this.product();
    if (p) {
      this.cart.add(p, this.qty);
    }
  }

  buy(): void {
    const p = this.product();
    if (p && this.cart.add(p, this.qty)) {
      void this.router.navigateByUrl('/checkout');
    }
  }

  sendReview(): void {
    const p = this.product();
    const user = this.auth.user();
    if (!p || !user) {
      return;
    }
    this.catalog
      .addReview({
        productId: p.id,
        userId: user.id,
        userName: user.fullName,
        rating: this.reviewRating,
        titleAr: 'مراجعة',
        titleEn: 'Review',
        bodyAr: this.reviewBody,
        bodyEn: this.reviewBody,
      })
      .subscribe((r) => this.reviews.update((rows) => [r, ...rows]));
  }
}
