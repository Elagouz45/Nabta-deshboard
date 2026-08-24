import { Observable } from 'rxjs';
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

export abstract class CatalogRepository {
  abstract listCategories(): Observable<Category[]>;
  abstract listSubcategories(): Observable<Subcategory[]>;
  abstract listCompanies(): Observable<Company[]>;
  abstract getCompany(slug: string): Observable<Company>;
  abstract listBrands(): Observable<Brand[]>;
  abstract getBrand(slug: string): Observable<Brand>;
  abstract queryProducts(filters: ProductFilters): Observable<PaginatedResponse<Product>>;
  abstract getProductBySlug(slug: string): Observable<Product>;
  abstract getProductById(id: string): Observable<Product>;
  abstract relatedProducts(productId: string): Observable<Product[]>;
  abstract frequentlyBought(productId: string): Observable<Product[]>;
  abstract search(filters: SearchFilters): Observable<SearchResults>;
  abstract suggestions(q: string): Observable<SearchSuggestion[]>;
  abstract listReviews(productId: string): Observable<Review[]>;
  abstract addReview(input: Omit<Review, 'id' | 'createdAt' | 'approved'>): Observable<Review>;
  abstract saveProduct(product: Product): Observable<Product>;
  abstract setProductActive(id: string, isActive: boolean): Observable<Product>;
}
