import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideDataAccess } from '@data-access/provide-data-access';
import { CatalogRepository } from '@data-access/repositories/catalog.repository';
import { firstValueFrom } from 'rxjs';

describe('MockCatalogRepository', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideDataAccess()],
    });
  });

  it('returns paginated products from mock data', async () => {
    const repo = TestBed.inject(CatalogRepository);
    const page = await firstValueFrom(repo.queryProducts({ page: 1, pageSize: 10 }));
    expect(page.items.length).toBe(10);
    expect(page.total).toBeGreaterThanOrEqual(30);
  });

  it('finds a product by slug', async () => {
    const repo = TestBed.inject(CatalogRepository);
    const page = await firstValueFrom(repo.queryProducts({ pageSize: 1 }));
    const product = await firstValueFrom(repo.getProductBySlug(page.items[0].slug));
    expect(product.sku).toBeTruthy();
  });

  it('returns search hits for a known product name', async () => {
    const repo = TestBed.inject(CatalogRepository);
    const page = await firstValueFrom(repo.queryProducts({ pageSize: 1 }));
    const results = await firstValueFrom(repo.search({ q: page.items[0].nameAr }));
    expect(results.total).toBeGreaterThan(0);
    expect(results.products.some((p) => p.id === page.items[0].id)).toBe(true);
  });
});
