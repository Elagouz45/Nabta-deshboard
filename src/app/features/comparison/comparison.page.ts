import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { CatalogRepository } from '@data-access/repositories/catalog.repository';
import { KnowledgeRepository } from '@data-access/repositories/knowledge.repository';
import { Company, Crop, PlantProblem, Product } from '@core/models';
import { COMPARE_LIMIT } from '@core/constants/app.constants';
import { ComparisonStore } from '@state/comparison/comparison.store';
import { CartStore } from '@state/cart/cart.store';
import { EmptyStateComponent, LoadingSkeletonComponent } from '@shared/ui/feedback.component';
import { AppImageComponent } from '@shared/ui/app-image.component';
import { ProductPriceComponent } from '@shared/ui/product-price.component';
import { RatingStarsComponent } from '@shared/ui/rating-stars.component';
import { StatusBadgeComponent } from '@shared/ui/status-badge.component';
import { LocPipe } from '@shared/pipes/namaa.pipes';
import { SeoService } from '@core/services/seo.service';
import { unitPrice } from '@core/utils/pricing.util';
import { LucidePlus, LucideShoppingCart, LucideTrash2 } from '@lucide/angular';

type CompareField =
  | 'company'
  | 'ingredients'
  | 'formulation'
  | 'size'
  | 'rating'
  | 'crops'
  | 'problems'
  | 'origin'
  | 'phi';

@Component({
  selector: 'app-comparison-page',
  imports: [
    RouterLink,
    EmptyStateComponent,
    LoadingSkeletonComponent,
    LocPipe,
    AppImageComponent,
    ProductPriceComponent,
    RatingStarsComponent,
    StatusBadgeComponent,
    LucidePlus,
    LucideShoppingCart,
    LucideTrash2,
  ],
  template: `
    <article class="compare-page">
      <header class="hero">
        <div class="app-container">
          <p class="kicker">قارن بهدوء</p>
          <h1>مقارنة المنتجات</h1>
          <p class="muted">{{ heroCopy() }}</p>
        </div>
      </header>

      <div class="app-container body">
        @if (!compare.count()) {
          <app-empty-state title="المقارنة فارغة" message="اضغط أيقونة المقارنة على بطاقة المنتج في المتجر. يمكن مقارنة حتى أربعة منتجات جنبًا إلى جنب.">
            <div class="empty-actions">
              <a class="btn" routerLink="/shop">المتجر</a>
              <a class="btn secondary" routerLink="/shop" [queryParams]="{ offersOnly: true }">تصفح العروض</a>
            </div>
          </app-empty-state>
        } @else if (!ready()) {
          <app-loading-skeleton height="360px" />
        } @else if (!products().length) {
          <app-empty-state title="تعذر تحميل المنتجات" message="قد تكون المنتجات غير متاحة. امسح القائمة وابدأ من المتجر.">
            <button class="btn" type="button" (click)="clear()">مسح المقارنة</button>
          </app-empty-state>
        } @else {
          <div class="toolbar">
            <p class="muted count">{{ products().length }} من {{ limit }}</p>
            <div class="toolbar-actions">
              @if (products().length < limit) {
                <a class="btn secondary add" routerLink="/shop">
                  <svg lucidePlus [size]="16"></svg>
                  أضف منتجًا
                </a>
              }
              <button class="btn ghost" type="button" (click)="clear()">مسح الكل</button>
            </div>
          </div>
          <p class="scroll-hint">كل منتج في عمود مستقل. الصفة تبقى ظاهرة عند السحب أفقياً.</p>
          <div class="matrix-wrap" role="region" aria-label="جدول المقارنة" tabindex="0">
            <div class="matrix" role="table" [style.--n]="'' + products().length">
              <div class="row head" role="row">
                <div class="cell label corner" role="columnheader">المنتج</div>
                @for (p of products(); track p.id) {
                  <div class="cell product" role="columnheader">
                    <a class="thumb" [routerLink]="['/products', p.slug]">
                      <app-image
                        [src]="p.thumbnail"
                        [alt]="p.imageAltAr | loc: p.imageAltEn"
                        [width]="160"
                        [height]="160"
                        objectFit="contain"
                        fallbackKind="product"
                        surface="var(--color-pale)"
                      />
                    </a>
                    <h2>
                      <a [routerLink]="['/products', p.slug]">{{ p.nameAr | loc: p.nameEn }}</a>
                    </h2>
                    <p class="muted meta">{{ p.formulation }} · {{ p.size }}</p>
                  </div>
                }
              </div>
              <div class="row" role="row">
                <div class="cell label" role="rowheader">السعر</div>
                @for (p of products(); track p.id) {
                  <div class="cell" role="cell" [class.best]="isCheapest(p)">
                    <app-product-price [regular]="p.regularPrice" [sale]="p.salePrice" />
                    @if (isCheapest(p)) {
                      <p class="best-label">الأقل سعرًا</p>
                    }
                  </div>
                }
              </div>
              <div class="row" role="row">
                <div class="cell label" role="rowheader">التوفر</div>
                @for (p of products(); track p.id) {
                  <div class="cell" role="cell" [class.diff]="diffStock()">
                    <app-status-badge [label]="stockLabel(p)" [tone]="stockTone(p)" />
                  </div>
                }
              </div>
              <div class="row" role="row">
                <div class="cell label" role="rowheader">الشركة</div>
                @for (p of products(); track p.id) {
                  <div class="cell" role="cell" [class.diff]="isDiff('company', p)">
                    @if (companyOf(p.companyId); as company) {
                      <a [routerLink]="['/companies', company.slug]">{{ company.nameAr | loc: company.nameEn }}</a>
                    } @else {
                      —
                    }
                  </div>
                }
              </div>
              <div class="row" role="row">
                <div class="cell label" role="rowheader">المادة الفعالة</div>
                @for (p of products(); track p.id) {
                  <div class="cell" role="cell" [class.diff]="isDiff('ingredients', p)">{{ ingredients(p) }}</div>
                }
              </div>
              <div class="row" role="row">
                <div class="cell label" role="rowheader">الصياغة</div>
                @for (p of products(); track p.id) {
                  <div class="cell" role="cell" [class.diff]="isDiff('formulation', p)">{{ p.formulation }}</div>
                }
              </div>
              <div class="row" role="row">
                <div class="cell label" role="rowheader">الحجم</div>
                @for (p of products(); track p.id) {
                  <div class="cell" role="cell" [class.diff]="isDiff('size', p)">{{ p.size }}</div>
                }
              </div>
              <div class="row" role="row">
                <div class="cell label" role="rowheader">التقييم</div>
                @for (p of products(); track p.id) {
                  <div class="cell" role="cell" [class.diff]="isDiff('rating', p)">
                    <app-rating-stars [rating]="p.rating" [count]="p.reviewsCount" />
                  </div>
                }
              </div>
              <div class="row" role="row">
                <div class="cell label" role="rowheader">المحاصيل</div>
                @for (p of products(); track p.id) {
                  <div class="cell" role="cell" [class.diff]="isDiff('crops', p)">{{ cropNames(p) }}</div>
                }
              </div>
              <div class="row" role="row">
                <div class="cell label" role="rowheader">المشكلة المستهدفة</div>
                @for (p of products(); track p.id) {
                  <div class="cell" role="cell" [class.diff]="isDiff('problems', p)">{{ problemNames(p) }}</div>
                }
              </div>
              <div class="row" role="row">
                <div class="cell label" role="rowheader">المنشأ</div>
                @for (p of products(); track p.id) {
                  <div class="cell" role="cell" [class.diff]="isDiff('origin', p)">{{ p.countryOfOrigin }}</div>
                }
              </div>
              <div class="row" role="row">
                <div class="cell label" role="rowheader">فترة ما قبل الحصاد</div>
                @for (p of products(); track p.id) {
                  <div class="cell phi" role="cell" [class.diff]="isDiff('phi', p)">{{ p.preHarvestInterval.ar }}</div>
                }
              </div>
              <div class="row actions-row" role="row">
                <div class="cell label" role="rowheader">الإجراء</div>
                @for (p of products(); track p.id) {
                  <div class="cell" role="cell">
                    <div class="actions">
                      <button class="btn" type="button" (click)="cart.add(p)" [disabled]="p.stockStatus === 'out_of_stock'">
                        <svg lucideShoppingCart [size]="16"></svg>
                        أضف للسلة
                      </button>
                      <a class="btn secondary" [routerLink]="['/products', p.slug]">التفاصيل</a>
                      <button class="btn ghost remove" type="button" (click)="remove(p)" [attr.aria-label]="'إزالة ' + p.nameAr">
                        <svg lucideTrash2 [size]="16"></svg>
                        إزالة
                      </button>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        }
      </div>
    </article>
  `,
  styles: `
    .compare-page { padding-bottom: calc(var(--space-8) + 16px); }
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
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 8px;
    }
    .toolbar-actions { display: flex; flex-wrap: wrap; gap: 8px; }
    .count { margin: 0; font-weight: 700; color: var(--color-forest); }
    .scroll-hint {
      margin: 0 0 12px;
      font-size: 0.82rem;
      color: var(--color-muted);
    }
    .matrix-wrap {
      --label: 6.5rem;
      --col: 13rem;
      overflow: auto;
      max-height: calc(100dvh - 13.5rem);
      border-radius: 20px;
      background: var(--color-warm-white);
      box-shadow: var(--shadow-soft);
      overscroll-behavior-x: contain;
      scroll-snap-type: x proximity;
      -webkit-overflow-scrolling: touch;
    }
    .matrix {
      display: grid;
      grid-template-columns: var(--label) repeat(var(--n, 1), minmax(var(--col), 1fr));
      min-width: 100%;
      width: max-content;
    }
    .row { display: contents; }
    .cell {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 4px;
      padding: 14px 12px;
      border-bottom: 1px solid var(--color-border);
      background: var(--color-warm-white);
      min-width: 0;
      overflow-wrap: anywhere;
    }
    .cell:not(.label) {
      border-inline-start: 1px solid var(--color-border);
      scroll-snap-align: start;
    }
    .row:nth-child(even) .cell:not(.label):not(.best):not(.diff) {
      background: rgb(247 250 247 / 0.65);
    }
    .cell.label {
      position: sticky;
      inset-inline-start: 0;
      z-index: 2;
      width: var(--label);
      padding-inline: 10px;
      font-size: 0.75rem;
      font-weight: 800;
      color: var(--color-muted);
      background: var(--color-pale);
      border-inline-end: 1px solid var(--color-border);
      box-shadow: 6px 0 10px -8px rgb(18 58 40 / 0.18);
    }
    :host-context([dir='rtl']) .cell.label {
      box-shadow: -6px 0 10px -8px rgb(18 58 40 / 0.18);
    }
    .row.head .cell {
      position: sticky;
      top: 0;
      z-index: 3;
      background: var(--color-pale);
      border-bottom: 1px solid var(--color-border);
    }
    .row.head .cell.label {
      z-index: 4;
      inset-inline-start: 0;
      top: 0;
    }
    .cell.product {
      min-width: var(--col);
      padding: 16px 12px 14px;
    }
    .cell.product h2 {
      margin: 10px 0 4px;
      font-size: 0.98rem;
      color: var(--color-forest);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .meta { margin: 0; font-size: 0.8rem; }
    .thumb {
      display: block;
      background: var(--color-pale);
      border-radius: 14px;
      overflow: hidden;
    }
    .diff { background: #f7f0e4; }
    .best { background: rgb(31 106 67 / 0.08); }
    .best-label { margin: 6px 0 0; font-size: 0.75rem; font-weight: 700; color: var(--color-brand); }
    .phi { font-size: 0.85rem; line-height: 1.55; }
    .actions { display: grid; gap: 8px; }
    .actions .btn { width: 100%; }
    .remove { color: var(--color-muted); }
    .actions-row .cell { border-bottom: 0; }
    @media (min-width: 768px) {
      .matrix-wrap { --label: 8rem; --col: 14.5rem; max-height: calc(100dvh - 12rem); }
      .cell { padding: 16px 14px; }
      .cell.label { font-size: 0.82rem; padding-inline: 14px; }
    }
    @media (min-width: 1024px) {
      .matrix-wrap { --label: 9rem; --col: 16rem; max-height: none; }
      .matrix { width: 100%; }
      .scroll-hint { display: none; }
    }
    @media (min-width: 1280px) {
      .matrix-wrap { --col: 18rem; }
    }
    @media (max-width: 720px) {
      .matrix-wrap {
        margin-inline: -8px;
        border-radius: 16px;
        max-height: calc(100dvh - 15.5rem);
      }
      .cell.product h2 { font-size: 0.92rem; }
    }
    @media (max-width: 560px) {
      .compare-page { padding-bottom: calc(96px + env(safe-area-inset-bottom, 0px)); }
      .toolbar-actions .btn { min-height: 40px; }
      .matrix-wrap { --label: 5.6rem; --col: 12.25rem; }
      .cell { padding: 12px 10px; }
      .cell.label { font-size: 0.7rem; }
    }
  `,
})
export class ComparisonPage {
  readonly compare = inject(ComparisonStore);
  readonly cart = inject(CartStore);
  private readonly catalog = inject(CatalogRepository);
  private readonly knowledge = inject(KnowledgeRepository);
  private readonly seo = inject(SeoService);
  readonly products = signal<Product[]>([]);
  readonly companies = signal<Company[]>([]);
  readonly crops = signal<Crop[]>([]);
  readonly problems = signal<PlantProblem[]>([]);
  readonly ready = signal(false);
  readonly limit = COMPARE_LIMIT;
  readonly heroCopy = computed(() => {
    const n = this.compare.count();
    if (n === 0) {
      return 'حتى أربعة منتجات من المتجر، للمقارنة قبل الشراء.';
    }
    if (n === 1) {
      return 'منتج واحد في القائمة. أضف منتجًا آخر لترى الفروقات.';
    }
    if (n === 2) {
      return 'منتجان جاهزان للمقارنة.';
    }
    if (n >= 3 && n < COMPARE_LIMIT) {
      return `${n} منتجات في المقارنة. يتبقى مكان واحد.`;
    }
    return 'وصلت إلى الحد الأقصى: أربعة منتجات.';
  });

  constructor() {
    this.seo.set({ title: 'المقارنة', description: 'قارن حتى أربعة منتجات جنبًا إلى جنب', path: '/compare' });
    forkJoin({
      companies: this.catalog.listCompanies(),
      crops: this.knowledge.listCrops(),
      problems: this.knowledge.listProblems(),
    }).subscribe((res) => {
      this.companies.set(res.companies);
      this.crops.set(res.crops);
      this.problems.set(res.problems);
    });
    effect(() => {
      const ids = this.compare.ids();
      untracked(() => this.loadProducts(ids));
    });
  }

  companyOf(id: string): Company | undefined {
    return this.companies().find((c) => c.id === id);
  }

  companyName(id: string): string {
    return this.companyOf(id)?.nameAr ?? '';
  }

  ingredients(product: Product): string {
    if (!product.activeIngredients.length) {
      return '—';
    }
    return product.activeIngredients.map((i) => `${i.nameAr} ${i.concentration}`.trim()).join('، ');
  }

  cropNames(product: Product): string {
    const names = product.targetCropIds
      .map((id) => this.crops().find((c) => c.id === id)?.nameAr)
      .filter((n): n is string => !!n);
    return names.length ? names.join('، ') : '—';
  }

  problemNames(product: Product): string {
    const names = product.targetProblemIds
      .map((id) => this.problems().find((p) => p.id === id)?.nameAr)
      .filter((n): n is string => !!n);
    return names.length ? names.join('، ') : '—';
  }

  stockLabel(product: Product): string {
    if (product.stockStatus === 'out_of_stock') {
      return 'غير متوفر';
    }
    if (product.stockStatus === 'low_stock') {
      return 'كمية محدودة';
    }
    return 'متوفر';
  }

  stockTone(product: Product): string {
    if (product.stockStatus === 'out_of_stock') {
      return 'oos';
    }
    if (product.stockStatus === 'low_stock') {
      return 'low';
    }
    return 'success';
  }

  isDiff(field: CompareField, product: Product): boolean {
    const value = this.cell(field, product);
    if (!value || value === '—') {
      return false;
    }
    return new Set(this.products().map((p) => this.cell(field, p))).size > 1;
  }

  diffStock(): boolean {
    return new Set(this.products().map((p) => p.stockStatus)).size > 1;
  }

  private cell(field: CompareField, product: Product): string {
    switch (field) {
      case 'company':
        return this.companyName(product.companyId);
      case 'ingredients':
        return this.ingredients(product);
      case 'formulation':
        return product.formulation;
      case 'size':
        return product.size;
      case 'rating':
        return String(product.rating);
      case 'crops':
        return this.cropNames(product);
      case 'problems':
        return this.problemNames(product);
      case 'origin':
        return product.countryOfOrigin;
      case 'phi':
        return product.preHarvestInterval.ar;
    }
  }

  isCheapest(product: Product): boolean {
    const prices = this.products().map((p) => unitPrice(p));
    const min = Math.min(...prices);
    return unitPrice(product) === min && new Set(prices).size > 1;
  }

  remove(product: Product): void {
    this.compare.remove(product.id);
  }

  clear(): void {
    this.compare.clear();
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
