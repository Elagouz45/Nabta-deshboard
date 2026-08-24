import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { CatalogRepository } from '@data-access/repositories/catalog.repository';
import { MockDatabase } from '@data-access/mock/mock-database.service';
import { MockHttp, notFound } from '@data-access/mock/mock-http.service';
import { CROPS, PROBLEMS } from '@data-access/mock/crops.mock';
import {
  Brand,
  Category,
  Company,
  PaginatedResponse,
  Product,
  ProductFilters,
  Review,
  SearchFilters,
  SearchResults,
  SearchSuggestion,
  Subcategory,
} from '@core/models';
import { productMatchesQuery, queryProducts } from '@core/utils/product-query.util';
import { ARTICLES } from '@data-access/mock/content.mock';

@Injectable()
export class MockCatalogRepository extends CatalogRepository {
  private readonly db = inject(MockDatabase);
  private readonly http = inject(MockHttp);

  listCategories(): Observable<Category[]> {
    return this.http.ok(this.db.categories());
  }

  listSubcategories(): Observable<Subcategory[]> {
    return this.http.ok(this.db.subcategories());
  }

  listCompanies(): Observable<Company[]> {
    return this.http.ok(this.db.companies());
  }

  getCompany(slug: string): Observable<Company> {
    const row = this.db.companies().find((c) => c.slug === slug);
    return row ? this.http.ok(row) : this.http.fail(notFound('الشركة', 'Company'));
  }

  listBrands(): Observable<Brand[]> {
    return this.http.ok(this.db.brands());
  }

  getBrand(slug: string): Observable<Brand> {
    const row = this.db.brands().find((b) => b.slug === slug);
    return row ? this.http.ok(row) : this.http.fail(notFound('العلامة', 'Brand'));
  }

  queryProducts(filters: ProductFilters): Observable<PaginatedResponse<Product>> {
    return this.http.ok(queryProducts(this.db.products(), filters));
  }

  getProductBySlug(slug: string): Observable<Product> {
    const row = this.db.products().find((p) => p.slug === slug);
    return row ? this.http.ok(row) : this.http.fail(notFound('المنتج', 'Product'));
  }

  getProductById(id: string): Observable<Product> {
    const row = this.db.products().find((p) => p.id === id);
    return row ? this.http.ok(row) : this.http.fail(notFound('المنتج', 'Product'));
  }

  relatedProducts(productId: string): Observable<Product[]> {
    const product = this.db.products().find((p) => p.id === productId);
    if (!product) {
      return this.http.ok([]);
    }
    const related = this.db
      .products()
      .filter(
        (p) =>
          p.id !== productId &&
          p.isActive &&
          (p.categoryId === product.categoryId ||
            p.targetCropIds.some((id) => product.targetCropIds.includes(id))),
      )
      .slice(0, 8);
    return this.http.ok(related);
  }

  frequentlyBought(productId: string): Observable<Product[]> {
    return this.relatedProducts(productId).pipe(map((items) => items.slice(0, 3)));
  }

  search(filters: SearchFilters): Observable<SearchResults> {
    const q = filters.q.trim();
    const products = this.db.products().filter((p) => p.isActive && productMatchesQuery(p, q));
    const crops = CROPS.filter((c) => c.nameAr.includes(q) || c.nameEn.toLowerCase().includes(q.toLowerCase()));
    const problems = PROBLEMS.filter(
      (p) => p.nameAr.includes(q) || p.nameEn.toLowerCase().includes(q.toLowerCase()),
    );
    const companies = this.db
      .companies()
      .filter((c) => c.nameAr.includes(q) || c.nameEn.toLowerCase().includes(q.toLowerCase()));
    const ingredients = this.db
      .products()
      .flatMap((p) => p.activeIngredients)
      .filter((i) => i.nameAr.includes(q) || i.nameEn.toLowerCase().includes(q.toLowerCase()))
      .filter((item, index, arr) => arr.findIndex((x) => x.nameEn === item.nameEn) === index)
      .slice(0, 8);
    const articles = ARTICLES.filter(
      (a) => a.status === 'published' && (a.titleAr.includes(q) || a.titleEn.toLowerCase().includes(q.toLowerCase())),
    );
    return this.http.ok({
      products,
      crops: crops.map((c) => ({ id: c.id, slug: c.slug, nameAr: c.nameAr, nameEn: c.nameEn })),
      problems: problems.map((p) => ({ id: p.id, slug: p.slug, nameAr: p.nameAr, nameEn: p.nameEn })),
      companies: companies.map((c) => ({ id: c.id, slug: c.slug, nameAr: c.nameAr, nameEn: c.nameEn })),
      ingredients: ingredients.map((i) => ({ nameAr: i.nameAr, nameEn: i.nameEn })),
      articles: articles.map((a) => ({ id: a.id, slug: a.slug, titleAr: a.titleAr, titleEn: a.titleEn })),
      total: products.length + crops.length + problems.length + companies.length + articles.length,
    });
  }

  suggestions(q: string): Observable<SearchSuggestion[]> {
    return this.search({ q, pageSize: 5 }).pipe(
      map((res) => {
        const items: SearchSuggestion[] = [];
        res.products.slice(0, 4).forEach((p) =>
          items.push({
            id: p.id,
            type: 'product',
            labelAr: p.nameAr,
            labelEn: p.nameEn,
            url: `/products/${p.slug}`,
          }),
        );
        res.crops.slice(0, 2).forEach((c) =>
          items.push({
            id: c.id,
            type: 'crop',
            labelAr: c.nameAr,
            labelEn: c.nameEn,
            url: `/crops/${c.slug}`,
          }),
        );
        res.problems.slice(0, 2).forEach((p) =>
          items.push({
            id: p.id,
            type: 'problem',
            labelAr: p.nameAr,
            labelEn: p.nameEn,
            url: `/crop-assistant?problem=${p.slug}`,
          }),
        );
        res.companies.slice(0, 2).forEach((c) =>
          items.push({
            id: c.id,
            type: 'company',
            labelAr: c.nameAr,
            labelEn: c.nameEn,
            url: `/companies/${c.slug}`,
          }),
        );
        return items.slice(0, 8);
      }),
    );
  }

  listReviews(productId: string): Observable<Review[]> {
    return this.http.ok(this.db.reviews().filter((r) => r.productId === productId && r.approved));
  }

  addReview(input: Omit<Review, 'id' | 'createdAt' | 'approved'>): Observable<Review> {
    const review: Review = {
      ...input,
      id: this.db.nextId('rv'),
      createdAt: new Date().toISOString(),
      approved: true,
    };
    this.db.reviews.update((rows) => [review, ...rows]);
    return this.http.ok(review);
  }

  saveProduct(product: Product): Observable<Product> {
    const now = new Date().toISOString();
    const existing = this.db.products().find((p) => p.id === product.id);
    const saved: Product = {
      ...product,
      updatedAt: now,
      createdAt: existing?.createdAt ?? now,
      isOnSale: product.salePrice != null && product.salePrice < product.regularPrice,
    };
    this.db.products.update((rows) => {
      const index = rows.findIndex((p) => p.id === saved.id);
      if (index === -1) {
        return [saved, ...rows];
      }
      const next = [...rows];
      next[index] = saved;
      return next;
    });
    this.db.refreshCounts();
    return this.http.ok(saved);
  }

  setProductActive(id: string, isActive: boolean): Observable<Product> {
    return this.getProductById(id).pipe(
      switchMap((product) => this.saveProduct({ ...product, isActive })),
    );
  }
}
