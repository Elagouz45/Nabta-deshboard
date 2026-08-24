import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogRepository } from '@data-access/repositories/catalog.repository';
import { Brand, Company, Product } from '@core/models';
import { ProductCardComponent } from '@shared/ui/product-card.component';
import { CompanyCardComponent } from '@shared/ui/company-card.component';
import { AppImageComponent } from '@shared/ui/app-image.component';
import { SeoService } from '@core/services/seo.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-companies-page',
  imports: [CompanyCardComponent],
  template: `
    <div class="app-container section companies">
      <header class="head">
        <h1>الشركات</h1>
        <p class="muted">شركاء التوريد الزراعي على منصة نبته</p>
      </header>
      <div class="co-grid">
        @for (c of companies(); track c.id) {
          <app-company-card [company]="c" [showDescription]="true" />
        }
      </div>
    </div>
  `,
  styles: `
    .head { margin-bottom: 20px; }
    .head h1 { margin: 0 0 6px; }
    .head p { margin: 0; }
    .co-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }
    @media (min-width: 640px) {
      .co-grid { grid-template-columns: 1fr 1fr; gap: 18px; }
    }
    @media (min-width: 1024px) {
      .co-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
    }
  `,
})
export class CompaniesPage {
  private readonly catalog = inject(CatalogRepository);
  private readonly seo = inject(SeoService);
  readonly companies = signal<Company[]>([]);
  constructor() {
    this.seo.set({ title: 'الشركات', description: 'شركات التوريد الزراعي على منصة نبته', path: '/companies' });
    this.catalog.listCompanies().subscribe((rows) => this.companies.set(rows));
  }
}

@Component({
  selector: 'app-company-details-page',
  imports: [ProductCardComponent, AppImageComponent],
  template: `
    @if (company(); as c) {
      <div class="app-container section">
        <app-image [src]="c.logo" [alt]="c.nameAr" [width]="240" [height]="160" objectFit="contain" fallbackKind="company" />
        <h1>{{ c.nameAr }}</h1>
        <p>{{ c.descriptionAr }}</p>
        <p>المنشأ: {{ c.country }} · عدد المنتجات: {{ c.productCount }}</p>
        <div class="grid-products">@for (p of products(); track p.id) { <app-product-card [product]="p" /> }</div>
      </div>
    }
  `,
})
export class CompanyDetailsPage {
  private readonly catalog = inject(CatalogRepository);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  readonly company = signal<Company | null>(null);
  readonly products = signal<Product[]>([]);
  constructor() {
    this.route.paramMap.pipe(switchMap((p) => this.catalog.getCompany(p.get('slug') || ''))).subscribe((c) => {
      this.company.set(c);
      this.seo.set({ title: c.nameAr, description: c.descriptionAr, path: `/companies/${c.slug}` });
      this.catalog.queryProducts({ companyId: c.id, pageSize: 24 }).subscribe((r) => this.products.set(r.items));
    });
  }
}

@Component({
  selector: 'app-brands-page',
  imports: [RouterLink, AppImageComponent],
  template: `
    <div class="app-container section">
      <h1>العلامات</h1>
      <div class="grid-products">
        @for (b of brands(); track b.id) {
          <a class="card pad" [routerLink]="['/brands', b.slug]">
            <app-image [src]="b.logo" [alt]="b.nameAr" [width]="240" [height]="160" objectFit="contain" fallbackKind="company" />
            <h2>{{ b.nameAr }}</h2>
          </a>
        }
      </div>
    </div>
  `,
})
export class BrandsPage {
  private readonly catalog = inject(CatalogRepository);
  private readonly seo = inject(SeoService);
  readonly brands = signal<Brand[]>([]);
  constructor() {
    this.seo.set({ title: 'العلامات', description: 'علامات المنتجات الزراعية', path: '/brands' });
    this.catalog.listBrands().subscribe((rows) => this.brands.set(rows));
  }
}

@Component({
  selector: 'app-brand-details-page',
  imports: [ProductCardComponent],
  template: `
    @if (brand(); as b) {
      <div class="app-container section">
        <h1>{{ b.nameAr }}</h1>
        <p>{{ b.descriptionAr }}</p>
        <div class="grid-products">@for (p of products(); track p.id) { <app-product-card [product]="p" /> }</div>
      </div>
    }
  `,
})
export class BrandDetailsPage {
  private readonly catalog = inject(CatalogRepository);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  readonly brand = signal<Brand | null>(null);
  readonly products = signal<Product[]>([]);
  constructor() {
    this.route.paramMap.pipe(switchMap((p) => this.catalog.getBrand(p.get('slug') || ''))).subscribe((b) => {
      this.brand.set(b);
      this.seo.set({ title: b.nameAr, description: b.descriptionAr, path: `/brands/${b.slug}` });
      this.catalog.queryProducts({ brandId: b.id, pageSize: 24 }).subscribe((r) => this.products.set(r.items));
    });
  }
}
