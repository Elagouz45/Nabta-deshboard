import { computed, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, delay, finalize, forkJoin, map, of, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { Customer, Order, OrderStatus, PaginatedResponse, Product } from './models';
import { AuthStore } from './core/auth.store';
import { DEMO_CUSTOMERS, DEMO_ORDERS, DEMO_PRODUCTS, stockStatusForQuantity } from './demo-data';
import { normalizeApiError } from './core/api-error-normalizer';

interface ApiOrder {
  id: string; orderNumber: string; customerName: string; customerMobile: string;
  address: { governorate: string }; items: unknown[]; total: number; status: OrderStatus;
  paymentMethod: 'cod' | 'card' | 'wallet'; createdAt: string;
}
interface ApiProduct {
  id: string; sku: string; nameAr: string; categoryId: string; regularPrice: number;
  salePrice: number | null; stockQuantity: number; stockStatus: Product['status']; isActive: boolean; thumbnail?: string;
}
interface ApiCustomer {
  id: string; fullName: string; mobile: string; createdAt: string;
  ordersCount?: number; totalSpent?: number; city?: string;
}

export class DashboardStore {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthStore);
  private readonly baseUrl = `${environment.apiBaseUrl}/admin`;
  readonly orders = signal<Order[]>([]);
  readonly products = signal<Product[]>([]);
  readonly customers = signal<Customer[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly search = signal('');
  readonly orderStatus = signal<OrderStatus | 'all'>('all');
  readonly toast = signal('');
  readonly revenue = computed(() => this.orders().filter((item) => item.status !== 'cancelled').reduce((sum, item) => sum + item.total, 0));
  readonly pendingOrders = computed(() => this.orders().filter((item) => item.status === 'pending').length);
  readonly lowStock = computed(() => this.products().filter((item) => item.status !== 'in_stock').length);
  readonly activeProducts = computed(() => this.products().filter((item) => item.active).length);
  readonly filteredOrders = computed(() => this.orders());
  readonly filteredProducts = computed(() => this.products());
  readonly filteredCustomers = computed(() => this.customers());

  constructor() { this.loadOverview(); }

  loadOverview(): void {
    if (this.loadDemoData()) return;
    this.loading.set(true); this.error.set('');
    forkJoin({
      orders: this.http.get<ApiOrder[]>(`${this.baseUrl}/orders`),
      products: this.http.get<PaginatedResponse<ApiProduct>>(`${this.baseUrl}/products`, { params: { pageSize: 50 } }),
      customers: this.http.get<ApiCustomer[]>(`${this.baseUrl}/customers`),
    }).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: ({ orders, products, customers }) => {
        this.orders.set(orders.map((item) => this.mapOrder(item)));
        this.products.set(products.items.map((item) => this.mapProduct(item)));
        this.customers.set(customers.map((item) => this.mapCustomer(item)));
      },
      error: (error: unknown) => this.error.set(this.errorMessage(error)),
    });
  }

  loadOrders(): void {
    if (this.isDemoSession()) { this.applyDemoOrderFilters(); return; }
    this.loading.set(true); this.error.set('');
    let params = new HttpParams();
    if (this.search()) params = params.set('q', this.search());
    if (this.orderStatus() !== 'all') params = params.set('status', this.orderStatus());
    this.http.get<ApiOrder[]>(`${this.baseUrl}/orders`, { params }).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (items) => this.orders.set(items.map((item) => this.mapOrder(item))),
      error: (error: unknown) => this.error.set(this.errorMessage(error)),
    });
  }

  loadProducts(): void {
    if (this.isDemoSession()) { this.applyDemoProductFilters(); return; }
    this.loading.set(true); this.error.set('');
    const params = new HttpParams().set('pageSize', 50).set('q', this.search());
    this.http.get<PaginatedResponse<ApiProduct>>(`${this.baseUrl}/products`, { params }).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (response) => this.products.set(response.items.map((item) => this.mapProduct(item))),
      error: (error: unknown) => this.error.set(this.errorMessage(error)),
    });
  }

  setSearch(value: string): void { this.search.set(value); }
  clearFilters(): void { this.search.set(''); this.orderStatus.set('all'); this.loadOrders(); }
  updateOrderStatus(id: string, status: OrderStatus): void {
    if (this.isDemoSession()) {
      this.orders.update((items) => items.map((item) => item.id === id ? { ...item, status } : item));
      this.showToast('تم تحديث حالة الطلب التجريبي');
      return;
    }
    this.http.patch<ApiOrder>(`${this.baseUrl}/orders/${id}`, { status }).subscribe({
      next: (item) => { this.orders.update((items) => items.map((current) => current.id === id ? this.mapOrder(item) : current)); this.showToast('تم تحديث حالة الطلب بنجاح'); },
      error: (error: unknown) => this.showToast(this.errorMessage(error)),
    });
  }
  toggleProduct(id: string): void {
    const product = this.products().find((item) => item.id === id);
    if (!product) return;
    if (this.isDemoSession()) {
      this.products.update((items) => items.map((item) => item.id === id ? { ...item, active: !item.active } : item));
      this.showToast('تم تحديث حالة المنتج التجريبي');
      return;
    }
    this.http.patch<ApiProduct>(`${this.baseUrl}/products/${id}`, { isActive: !product.active }).subscribe({
      next: (item) => { this.products.update((items) => items.map((current) => current.id === id ? this.mapProduct(item) : current)); this.showToast('تم تحديث حالة المنتج'); },
      error: (error: unknown) => this.showToast(this.errorMessage(error)),
    });
  }
  updateStock(id: string, stockQuantity: number): Observable<Product> {
    if (this.isDemoSession()) {
      const current = this.products().find((item) => item.id === id);
      if (!current) throw new Error('المنتج غير موجود.');
      const updated: Product = { ...current, stock: stockQuantity, status: stockStatusForQuantity(stockQuantity) };
      return of(updated).pipe(delay(450), tap((product) => {
        this.products.update((items) => items.map((item) => item.id === id ? product : item));
        this.showToast('تم حفظ كمية المخزون');
      }));
    }
    return this.http.patch<ApiProduct>(`${this.baseUrl}/products/${id}`, { stockQuantity }).pipe(
      map((item) => this.mapProduct(item)),
      tap((product) => {
        this.products.update((items) => items.map((item) => item.id === id ? product : item));
        this.showToast('تم حفظ كمية المخزون');
      }),
    );
  }
  showToast(message: string): void { this.toast.set(message); window.setTimeout(() => this.toast.set(''), 2600); }

  private isDemoSession(): boolean { return environment.demoAdmin !== null && this.auth.session()?.token === 'development-demo-session'; }
  private loadDemoData(): boolean {
    if (!this.isDemoSession()) return false;
    this.orders.set(DEMO_ORDERS); this.products.set(DEMO_PRODUCTS); this.customers.set(DEMO_CUSTOMERS);
    this.loading.set(false); this.error.set('');
    return true;
  }
  private applyDemoOrderFilters(): void {
    const query = this.search().trim().toLocaleLowerCase('ar');
    this.orders.set(DEMO_ORDERS.filter((item) => (this.orderStatus() === 'all' || item.status === this.orderStatus()) && (!query || `${item.orderNumber} ${item.customer} ${item.mobile}`.toLocaleLowerCase('ar').includes(query))));
    this.error.set('');
  }
  private applyDemoProductFilters(): void {
    const query = this.search().trim().toLocaleLowerCase('ar');
    this.products.set(DEMO_PRODUCTS.filter((item) => !query || `${item.name} ${item.sku} ${item.category}`.toLocaleLowerCase('ar').includes(query)));
    this.error.set('');
  }

  private mapOrder(item: ApiOrder): Order {
    const payment = { cod: 'الدفع عند الاستلام', card: 'بطاقة بنكية', wallet: 'محفظة إلكترونية' } as const;
    return { id: item.id, orderNumber: item.orderNumber, customer: item.customerName, mobile: item.customerMobile, governorate: item.address.governorate, itemsCount: item.items.length, total: item.total, status: item.status, payment: payment[item.paymentMethod], createdAt: new Intl.DateTimeFormat('ar-EG', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.createdAt)) };
  }
  private mapProduct(item: ApiProduct): Product {
    return { id: item.id, sku: item.sku, name: item.nameAr, category: item.categoryId, price: item.salePrice ?? item.regularPrice, stock: item.stockQuantity, status: item.stockStatus, active: item.isActive, thumbnail: item.thumbnail };
  }
  private mapCustomer(item: ApiCustomer): Customer {
    return { id: item.id, name: item.fullName, mobile: item.mobile, orders: item.ordersCount ?? 0, spent: item.totalSpent ?? 0, city: item.city ?? '—', joinedAt: new Intl.DateTimeFormat('ar-EG', { dateStyle: 'medium' }).format(new Date(item.createdAt)) };
  }
  private errorMessage(error: unknown): string {
    return normalizeApiError(error).message;
  }
}
