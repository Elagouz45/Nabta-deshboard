import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { CatalogRepository } from '@data-access/repositories/catalog.repository';
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

@Injectable()
export class HttpCatalogRepository extends CatalogRepository {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  listCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.base}/categories`);
  }
  listSubcategories(): Observable<Subcategory[]> {
    return this.http.get<Subcategory[]>(`${this.base}/subcategories`);
  }
  listCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.base}/companies`);
  }
  getCompany(slug: string): Observable<Company> {
    return this.http.get<Company>(`${this.base}/companies/${slug}`);
  }
  listBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.base}/brands`);
  }
  getBrand(slug: string): Observable<Brand> {
    return this.http.get<Brand>(`${this.base}/brands/${slug}`);
  }
  queryProducts(filters: ProductFilters): Observable<PaginatedResponse<Product>> {
    return this.http.get<PaginatedResponse<Product>>(`${this.base}/products`, {
      params: toParams(filters),
    });
  }
  getProductBySlug(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.base}/products/${slug}`);
  }
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.base}/admin/products/${id}`);
  }
  relatedProducts(productId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base}/products/${productId}/related`);
  }
  frequentlyBought(productId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base}/products/${productId}/frequently-bought`);
  }
  search(filters: SearchFilters): Observable<SearchResults> {
    return this.http.get<SearchResults>(`${this.base}/search`, { params: toParams(filters) });
  }
  suggestions(q: string): Observable<SearchSuggestion[]> {
    return this.http.get<SearchSuggestion[]>(`${this.base}/search/suggestions`, {
      params: { q },
    });
  }
  listReviews(productId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.base}/products/${productId}/reviews`);
  }
  addReview(input: Omit<Review, 'id' | 'createdAt' | 'approved'>): Observable<Review> {
    return this.http.post<Review>(`${this.base}/products/${input.productId}/reviews`, input);
  }
  saveProduct(product: Product): Observable<Product> {
    return product.id.startsWith('p-new') || !product.createdAt
      ? this.http.post<Product>(`${this.base}/admin/products`, product)
      : this.http.put<Product>(`${this.base}/admin/products/${product.id}`, product);
  }
  setProductActive(id: string, isActive: boolean): Observable<Product> {
    return this.http.patch<Product>(`${this.base}/admin/products/${id}`, { isActive });
  }
}

function toParams(obj: object): HttpParams {
  let params = new HttpParams();
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params = params.set(key, String(value));
    }
  });
  return params;
}
