import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogRepository } from '@data-access/repositories/catalog.repository';
import { SearchResults } from '@core/models';
import { ProductCardComponent } from '@shared/ui/product-card.component';
import { EmptyStateComponent } from '@shared/ui/feedback.component';
import { SeoService } from '@core/services/seo.service';
import { STORAGE_KEYS } from '@core/constants/storage-keys';
import { StorageService } from '@core/services/storage.service';

@Component({
  selector: 'app-search-page',
  imports: [RouterLink, ProductCardComponent, EmptyStateComponent],
  template: `
    <div class="app-container section">
      <h1>نتائج البحث: {{ q }}</h1>
      @if (!q) { <app-empty-state title="أدخل كلمة بحث" message="ابحث باسم المنتج أو المحصول أو المادة الفعالة." /> }
      @else if (!results()?.total) {
        <app-empty-state title="لا توجد نتائج" message="جرّب كلمة أعم أو تصفح المتجر.">
          <a class="btn" routerLink="/shop">المتجر</a>
        </app-empty-state>
      } @else {
        <div class="grid-products">@for (p of results()!.products; track p.id) { <app-product-card [product]="p" /> }</div>
        @if (results()!.crops.length) {
          <h2>محاصيل</h2>
          @for (c of results()!.crops; track c.id) { <a [routerLink]="['/crops', c.slug]">{{ c.nameAr }}</a> }
        }
      }
    </div>
  `,
})
export class SearchPage {
  private readonly catalog = inject(CatalogRepository);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly storage = inject(StorageService);
  q = '';
  readonly results = signal<SearchResults | null>(null);

  constructor() {
    this.route.queryParamMap.subscribe((p) => {
      this.q = p.get('q') ?? '';
      this.seo.set({ title: `بحث: ${this.q}`, description: 'نتائج البحث في نبته', path: '/search' });
      if (this.q) {
        const recent = this.storage.get<string[]>(STORAGE_KEYS.recentSearches) ?? [];
        this.storage.set(STORAGE_KEYS.recentSearches, [this.q, ...recent.filter((x) => x !== this.q)].slice(0, 8));
        this.catalog.search({ q: this.q }).subscribe((res) => this.results.set(res));
      }
    });
  }
}
