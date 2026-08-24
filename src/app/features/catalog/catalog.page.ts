import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { CatalogRepository } from '@data-access/repositories/catalog.repository';
import { KnowledgeRepository } from '@data-access/repositories/knowledge.repository';
import {
  Brand,
  Category,
  Company,
  Crop,
  PaginatedResponse,
  PlantProblem,
  Product,
  ProductFilters,
  ProductSortOption,
} from '@core/models';
import { ProductCardComponent } from '@shared/ui/product-card.component';
import { EmptyStateComponent, ErrorStateComponent, LoadingSkeletonComponent } from '@shared/ui/feedback.component';
import { FilterPanelComponent } from '@shared/ui/filter-panel.component';
import { ActiveFilterChipsComponent, FilterChip } from '@shared/ui/active-filter-chips.component';
import { SortControlComponent } from '@shared/ui/sort-control.component';
import { MobileFilterSheetComponent, FilterSheetResult, FilterSheetData } from '@shared/ui/mobile-filter-sheet.component';
import { AppImageComponent } from '@shared/ui/app-image.component';
import { SeoService } from '@core/services/seo.service';
import { discountPercent } from '@core/utils/pricing.util';
import { forkJoin } from 'rxjs';
import { LucideSearch, LucideSlidersHorizontal } from '@lucide/angular';

@Component({
  selector: 'app-catalog-page',
  imports: [
    DialogModule,
    FormsModule,
    ProductCardComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    LoadingSkeletonComponent,
    FilterPanelComponent,
    ActiveFilterChipsComponent,
    SortControlComponent,
    AppImageComponent,
    LucideSearch,
    LucideSlidersHorizontal,
  ],
  template: `
    <div class="app-container section shop" [class.offers-view]="isOffersView">
      @if (isOffersView) {
        <header class="offers-hero">
          <div class="hero-copy">
            <p class="kicker">عروض نبته</p>
            <h1>وفّر لموسمك من أول اختيار</h1>
            <p class="deal">خصومات حقيقية حتى {{ maxDiscount }}٪</p>
            <p class="support">اختيارات مدروسة لاحتياجات أرضك</p>
            <button type="button" class="btn hero-cta" (click)="scrollToOffers()">استكشف العروض</button>
          </div>
          <div class="hero-scene" aria-hidden="true">
            <span class="frond one"></span>
            <span class="frond two"></span>
            <span class="stage"></span>
            <div class="prod bag">
              <app-image
                src="/assets/images/products/photo-bag-npk.webp"
                alt=""
                [width]="640"
                [height]="800"
                objectFit="contain"
                fallbackKind="product"
                surface="transparent"
              />
            </div>
            <div class="prod urea">
              <app-image
                src="/assets/images/products/photo-bag-urea.webp"
                alt=""
                [width]="640"
                [height]="800"
                objectFit="contain"
                fallbackKind="product"
                surface="transparent"
              />
            </div>
            <div class="prod bottle">
              <app-image
                src="/assets/images/products/photo-bottle.webp"
                alt=""
                [width]="480"
                [height]="640"
                objectFit="contain"
                fallbackKind="product"
                surface="transparent"
              />
            </div>
          </div>
        </header>
        <div class="offers-toolbar" id="offers-results">
          <p class="count">{{ offersCountLabel }}</p>
          <form class="offers-search" (submit)="$event.preventDefault(); onSearch()">
            <label class="sr-only" for="offers-q">ابحث في العروض</label>
            <svg lucideSearch [size]="18" aria-hidden="true"></svg>
            <input
              id="offers-q"
              class="input"
              name="q"
              type="search"
              placeholder="ابحث في العروض"
              [(ngModel)]="searchDraft"
            />
          </form>
          <app-sort-control
            [offersMode]="true"
            [value]="draft.sort || 'best_saving'"
            (valueChange)="onSort($event)"
          />
          <button type="button" class="btn secondary filter-trigger" (click)="openSheet()">
            <svg lucideSlidersHorizontal [size]="18"></svg>
            تصفية العروض
            @if (chipCount) {
              <span class="filter-count">{{ chipCount }}</span>
            }
          </button>
        </div>
      }
      <aside class="filters card desktop-filters">
        <header class="filters-head">
          <div>
            <h2>{{ isOffersView ? 'تصفية العروض' : 'تصفية النتائج' }}</h2>
            @if (!isOffersView) {
              <p class="muted">{{ result().total }} منتج</p>
            }
          </div>
          @if (isOffersView || chipCount) {
            <button type="button" class="btn ghost compact" (click)="clear()">مسح الكل</button>
          }
        </header>
        <app-filter-panel
          [filters]="draft"
          [categories]="categories()"
          [companies]="companies()"
          [crops]="crops()"
          [problems]="problems()"
          [hideOffersToggle]="isOffersView"
          [compactOffers]="isOffersView"
          (filtersChange)="onFilters($event)"
        />
      </aside>
      <div class="results">
        @if (!isOffersView) {
          <div class="toolbar">
            <div class="toolbar-copy">
              <h1 class="mobile-title">المتجر</h1>
              <p class="muted">{{ result().total }} نتيجة</p>
            </div>
            <div class="toolbar-actions">
              <button type="button" class="btn secondary filter-trigger" (click)="openSheet()">
                <svg lucideSlidersHorizontal [size]="18"></svg>
                فلاتر
                @if (chipCount) {
                  <span class="filter-count">{{ chipCount }}</span>
                }
              </button>
              <app-sort-control [value]="draft.sort || 'recommended'" (valueChange)="onSort($event)" />
            </div>
          </div>
          <app-active-filter-chips [chips]="chips" (remove)="removeChip($event)" (clear)="clear()" />
        }
        @if (loading()) { <app-loading-skeleton height="320px" /> }
        @else if (error()) { <app-error-state [retry]="reload" /> }
        @else if (!result().items.length) {
          <app-empty-state
            [title]="isOffersView ? 'لا توجد عروض حاليًا' : 'لا توجد منتجات'"
            [message]="isOffersView ? 'عدّل الفلاتر أو تصفح كل المتجر.' : 'عدّل الفلاتر أو امسحها.'"
          />
        }
        @else {
          <div class="grid-products" [class.offers-grid]="isOffersView">
            @for (p of result().items; track p.id) {
              <app-product-card [product]="p" [variant]="isOffersView ? 'offer' : 'default'" />
            }
          </div>
          <div class="pager">
            <button class="btn secondary" type="button" [disabled]="result().page <= 1" (click)="page(result().page - 1)">السابق</button>
            <span>صفحة {{ result().page }} من {{ result().totalPages }}</span>
            <button class="btn secondary" type="button" [disabled]="result().page >= result().totalPages" (click)="page(result().page + 1)">التالي</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .shop { display: grid; grid-template-columns: var(--filter-w) minmax(0, 1fr); gap: 24px; align-items: start; min-width: 0; }
    .offers-view { --filter-w: 280px; }
    .offers-hero,
    .offers-toolbar { grid-column: 1 / -1; }
    .offers-hero {
      position: relative;
      isolation: isolate;
      overflow: hidden;
      min-height: 280px;
      display: grid;
      grid-template-columns: minmax(240px, 0.92fr) minmax(0, 1.08fr);
      align-items: center;
      gap: 12px;
      padding: 18px 26px;
      border-radius: 22px;
      background:
        linear-gradient(to left, rgb(247 250 247 / 0.9) 0%, rgb(247 250 247 / 0.55) 34%, rgb(247 250 247 / 0.08) 52%, transparent 68%),
        url('/assets/images/crops/wheat-crop.webp') 28% center / cover no-repeat,
        #d7e4c8;
    }
    .hero-copy {
      position: relative;
      z-index: 2;
      display: grid;
      gap: 8px;
      max-width: 28rem;
    }
    .kicker {
      margin: 0;
      color: var(--color-brand);
      font-weight: 700;
      font-size: 0.82rem;
    }
    .offers-hero h1 {
      margin: 0;
      color: var(--color-forest);
      font-size: clamp(1.45rem, 2.5vw, 2rem);
      line-height: 1.25;
    }
    .deal {
      margin: 0;
      color: #d97706;
      font-weight: 800;
      font-size: clamp(1rem, 1.7vw, 1.2rem);
    }
    .support { margin: 0; color: var(--color-muted); font-size: 0.95rem; }
    .hero-cta {
      justify-self: start;
      margin-top: 6px;
      background: var(--color-forest);
      border-color: var(--color-forest);
    }
    .hero-cta:hover { background: var(--color-brand); }
    .hero-scene {
      position: relative;
      min-height: 250px;
      z-index: 1;
    }
    .frond {
      position: absolute;
      width: 90px;
      height: 140px;
      background: radial-gradient(ellipse at 50% 100%, rgb(18 58 40 / .22), transparent 70%);
      filter: blur(0.2px);
      pointer-events: none;
    }
    .frond.one { inset-inline-end: 6%; top: 4%; transform: rotate(-18deg); }
    .frond.two { inset-inline-start: 10%; top: 8%; width: 70px; height: 110px; transform: rotate(16deg); }
    .stage {
      position: absolute;
      inset-inline: 12%;
      bottom: 10%;
      height: 28px;
      border-radius: 50%;
      background: radial-gradient(ellipse, rgb(90 64 38 / .38), transparent 72%);
    }
    .prod {
      position: absolute;
      filter: drop-shadow(0 14px 18px rgb(18 58 40 / 22%));
    }
    .prod.bag { width: 46%; bottom: 14%; inset-inline-start: 4%; z-index: 2; }
    .prod.urea { width: 38%; bottom: 18%; inset-inline-start: 34%; z-index: 1; }
    .prod.bottle { width: 28%; bottom: 16%; inset-inline-end: 6%; z-index: 3; }
    .offers-toolbar {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      padding: 4px 0 2px;
    }
    .offers-toolbar .count {
      margin: 0;
      font-weight: 700;
      color: var(--color-forest);
      min-width: 9.5rem;
    }
    .offers-search {
      position: relative;
      flex: 1 1 220px;
      min-width: min(100%, 220px);
    }
    .offers-search svg {
      position: absolute;
      inset-inline-start: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-muted);
      pointer-events: none;
    }
    .offers-search .input { padding-inline-start: 38px; }
    .offers-view .filters {
      background: var(--color-warm-white);
      border-radius: 20px;
      max-height: none;
      overflow: visible;
    }
    .offers-view .offers-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .filters { padding: 16px 16px 20px; height: max-content; position: sticky; top: 96px; max-height: calc(100dvh - 112px); overflow: auto; }
    .filters-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 8px; }
    .filters-head h2 { margin: 0; font-size: 1.15rem; }
    .filters-head p { margin: 4px 0 0; }
    .compact { min-height: 36px; padding-inline: 10px; }
    .toolbar { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }
    .toolbar-copy { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
    .toolbar-copy h1 { margin: 0; }
    .toolbar-copy p { margin: 0; }
    .toolbar-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .filter-trigger { display: none; gap: 8px; }
    .filter-count {
      min-width: 22px;
      height: 22px;
      border-radius: 99px;
      background: var(--color-forest);
      color: var(--color-white);
      font-size: 0.75rem;
      display: grid;
      place-items: center;
    }
    .pager { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; gap: 12px; flex-wrap: wrap; }
    .mobile-title { display: none; }
    @media (max-width: 1180px) {
      .offers-view .offers-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 1100px) {
      .offers-view { grid-template-columns: 1fr; }
      .offers-view .desktop-filters { display: none; }
      .offers-view .filter-trigger { display: inline-flex; }
      .offers-hero { grid-template-columns: 1fr; min-height: 0; padding: 20px 18px 16px; }
      .hero-scene { min-height: 180px; }
    }
    @media (max-width: 1024px) {
      .shop { grid-template-columns: 1fr; }
      .desktop-filters { display: none; }
      .mobile-title, .filter-trigger { display: inline-flex; }
    }
    @media (max-width: 720px) {
      .hero-scene { display: none; }
      .offers-hero { background:
        linear-gradient(180deg, rgb(247 250 247 / 0.9), rgb(247 250 247 / 0.55)),
        url('/assets/images/crops/wheat-crop.webp') center / cover no-repeat,
        #e8efe4;
      }
      .offers-toolbar .count { min-width: 0; width: 100%; }
      .offers-search { flex-basis: 100%; }
    }
    @media (max-width: 560px) {
      .offers-view .offers-grid { grid-template-columns: 1fr; }
      .pager { flex-direction: column; align-items: stretch; }
      .pager .btn { width: 100%; }
      .toolbar-actions { width: 100%; }
      .toolbar-actions .btn, .filter-trigger { flex: 1; justify-content: center; }
    }
  `,
})
export class CatalogPage {
  private readonly catalog = inject(CatalogRepository);
  private readonly knowledge = inject(KnowledgeRepository);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly dialog = inject(Dialog);

  readonly categories = signal<Category[]>([]);
  readonly companies = signal<Company[]>([]);
  readonly brands = signal<Brand[]>([]);
  readonly crops = signal<Crop[]>([]);
  readonly problems = signal<PlantProblem[]>([]);
  readonly result = signal<PaginatedResponse<Product>>({ items: [], total: 0, page: 1, pageSize: 12, totalPages: 1 });
  readonly loading = signal(true);
  readonly error = signal(false);
  draft: ProductFilters = { sort: 'recommended', page: 1, pageSize: 12 };
  searchDraft = '';

  readonly reload = () => this.load();

  constructor() {
    this.seo.set({ title: 'المتجر', description: 'تصفح المنتجات الزراعية مع فلاتر المحصول والمشكلة والشركة.', path: '/shop' });
    forkJoin({
      categories: this.catalog.listCategories(),
      companies: this.catalog.listCompanies(),
      brands: this.catalog.listBrands(),
      crops: this.knowledge.listCrops(),
      problems: this.knowledge.listProblems(),
    }).subscribe((res) => {
      this.categories.set(res.categories);
      this.companies.set(res.companies);
      this.brands.set(res.brands);
      this.crops.set(res.crops);
      this.problems.set(res.problems);
    });
    this.route.queryParamMap.subscribe((params) => {
      const offersOnly = params.get('offersOnly') === 'true';
      this.draft = {
        q: params.get('q') || undefined,
        categoryId: params.get('categoryId') || undefined,
        companyId: params.get('companyId') || undefined,
        brandId: params.get('brandId') || undefined,
        cropId: params.get('cropId') || undefined,
        problemId: params.get('problemId') || undefined,
        formulation: params.get('formulation') || undefined,
        minRating: num(params.get('minRating')),
        minPrice: num(params.get('minPrice')),
        maxPrice: num(params.get('maxPrice')),
        minDiscount: num(params.get('minDiscount')),
        inStock: params.get('inStock') === 'true',
        offersOnly,
        bestSellers: params.get('bestSellers') === 'true',
        isNew: params.get('isNew') === 'true',
        sort: (params.get('sort') as ProductSortOption) || (offersOnly ? 'best_saving' : 'recommended'),
        page: Number(params.get('page') || 1),
        pageSize: 12,
      };
      this.searchDraft = this.draft.q || '';
      this.seo.set(
        this.draft.offersOnly
          ? { title: 'العروض', description: 'منتجات زراعية عليها خصم فقط.', path: '/shop' }
          : { title: 'المتجر', description: 'تصفح المنتجات الزراعية مع فلاتر المحصول والمشكلة والشركة.', path: '/shop' },
      );
      this.load();
    });
  }

  get isOffersView(): boolean {
    return !!this.draft.offersOnly;
  }

  get maxDiscount(): number {
    const percents = this.result().items
      .map((product) => discountPercent(product))
      .filter((value): value is number => value != null);
    return percents.length ? Math.max(...percents) : 30;
  }

  get offersCountLabel(): string {
    const n = this.result().total;
    if (n === 0) {
      return 'لا توجد منتجات مخفّضة';
    }
    if (n === 1) {
      return 'منتج مخفّض واحد';
    }
    if (n === 2) {
      return 'منتجان مخفّضان';
    }
    if (n >= 3 && n <= 10) {
      return `${n} منتجات مخفّضة`;
    }
    return `${n} منتجًا مخفضًا`;
  }

  get chips(): FilterChip[] {
    const rows: FilterChip[] = [];
    if (this.draft.categoryId) {
      rows.push({ key: 'categoryId', label: this.categories().find((c) => c.id === this.draft.categoryId)?.nameAr || 'تصنيف' });
    }
    if (this.draft.companyId) {
      rows.push({ key: 'companyId', label: this.companies().find((c) => c.id === this.draft.companyId)?.nameAr || 'شركة' });
    }
    if (this.draft.brandId) {
      rows.push({ key: 'brandId', label: this.brands().find((b) => b.id === this.draft.brandId)?.nameAr || 'علامة' });
    }
    if (this.draft.cropId) {
      rows.push({ key: 'cropId', label: this.crops().find((c) => c.id === this.draft.cropId)?.nameAr || 'محصول' });
    }
    if (this.draft.problemId) {
      rows.push({ key: 'problemId', label: this.problems().find((p) => p.id === this.draft.problemId)?.nameAr || 'مشكلة' });
    }
    if (this.draft.formulation) {
      rows.push({ key: 'formulation', label: String(this.draft.formulation) });
    }
    if (this.draft.minPrice != null) {
      rows.push({ key: 'minPrice', label: `من ${this.draft.minPrice} ج.م` });
    }
    if (this.draft.maxPrice != null) {
      rows.push({ key: 'maxPrice', label: `إلى ${this.draft.maxPrice} ج.م` });
    }
    if (this.draft.minDiscount != null) {
      rows.push({ key: 'minDiscount', label: `خصم ${this.draft.minDiscount}٪ فأكثر` });
    }
    if (this.draft.minRating != null) {
      rows.push({ key: 'minRating', label: `${this.draft.minRating}★ فأكثر` });
    }
    if (this.draft.inStock) {
      rows.push({ key: 'inStock', label: 'متوفر' });
    }
    if (this.draft.bestSellers) {
      rows.push({ key: 'bestSellers', label: 'الأكثر مبيعًا' });
    }
    if (this.draft.isNew) {
      rows.push({ key: 'isNew', label: 'جديد' });
    }
    return rows;
  }

  get chipCount(): number {
    return this.chips.length;
  }

  onFilters(next: ProductFilters): void {
    this.draft = next;
    this.apply();
  }

  onSort(sort: ProductSortOption): void {
    this.draft = { ...this.draft, sort, page: 1 };
    this.apply();
  }

  onSearch(): void {
    const q = this.searchDraft.trim() || undefined;
    this.draft = { ...this.draft, q, page: 1 };
    this.apply();
  }

  scrollToOffers(): void {
    document.getElementById('offers-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  removeChip(key: string): void {
    this.draft = { ...this.draft, [key]: undefined, page: 1 };
    this.apply();
  }

  openSheet(): void {
    const ref = this.dialog.open<FilterSheetResult, FilterSheetData, MobileFilterSheetComponent>(MobileFilterSheetComponent, {
      data: {
        filters: { ...this.draft },
        categories: this.categories(),
        companies: this.companies(),
        crops: this.crops(),
        problems: this.problems(),
        resultCount: this.result().total,
        compactOffers: this.isOffersView,
      },
      panelClass: 'filter-sheet-pane',
      autoFocus: 'first-tabbable',
      hasBackdrop: true,
    });
    ref.closed.subscribe((res) => {
      if (!res) {
        return;
      }
      if (res.clear) {
        this.clear();
        return;
      }
      if (res.filters) {
        this.draft = res.filters;
        this.apply();
      }
    });
  }

  apply(): void {
    void this.router.navigate([], { queryParams: compact(this.draft), queryParamsHandling: '' });
  }

  clear(): void {
    if (this.isOffersView) {
      void this.router.navigate([], { queryParams: { offersOnly: true } });
      return;
    }
    void this.router.navigate([], { queryParams: {} });
  }

  page(page: number): void {
    this.draft.page = page;
    this.apply();
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.catalog.queryProducts(this.draft).subscribe({
      next: (res) => {
        this.result.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}

function num(v: string | null): number | undefined {
  return v ? Number(v) : undefined;
}

function compact(filters: ProductFilters): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '' && v !== false) {
      out[k] = v as string | number | boolean;
    }
  });
  return out;
}
