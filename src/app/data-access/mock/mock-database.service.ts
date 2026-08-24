import { Injectable, inject, signal } from '@angular/core';
import { Brand, Category, Company, ContactMessage, Order, Product, Review, Subcategory, User, Article, Address } from '@core/models';
import { BRANDS, CATEGORIES, COMPANIES, SUBCATEGORIES } from './catalog.mock';
import { PRODUCTS } from './products.mock';
import { ARTICLES, REVIEWS } from './content.mock';
import { ADDRESSES, ORDERS, USERS } from './commerce.mock';
import { DemoAuthStorage } from './demo-auth.storage';

@Injectable({ providedIn: 'root' })
export class MockDatabase {
  private readonly demo = inject(DemoAuthStorage);

  readonly categories = signal<Category[]>(structuredClone(CATEGORIES));
  readonly subcategories = signal<Subcategory[]>(structuredClone(SUBCATEGORIES));
  readonly companies = signal<Company[]>(structuredClone(COMPANIES));
  readonly brands = signal<Brand[]>(structuredClone(BRANDS));
  readonly products = signal<Product[]>(structuredClone(PRODUCTS));
  readonly articles = signal<Article[]>(structuredClone(ARTICLES));
  readonly reviews = signal<Review[]>(structuredClone(REVIEWS));
  readonly users = signal<User[]>(this.mergeUsers());
  readonly addresses = signal<Address[]>(structuredClone(ADDRESSES));
  readonly orders = signal<Order[]>(this.mergeOrders());
  readonly messages = signal<ContactMessage[]>([]);
  readonly userCarts = signal<Record<string, { productId: string; quantity: number; addedAt: string }[]>>({});

  refreshCounts(): void {
    this.categories.update((cats) =>
      cats.map((c) => ({
        ...c,
        productCount: this.products().filter((p) => p.categoryId === c.id && p.isActive).length,
      })),
    );
    this.companies.update((rows) =>
      rows.map((c) => ({
        ...c,
        productCount: this.products().filter((p) => p.companyId === c.id && p.isActive).length,
      })),
    );
    this.brands.update((rows) =>
      rows.map((b) => ({
        ...b,
        productCount: this.products().filter((p) => p.brandId === b.id && p.isActive).length,
      })),
    );
  }

  constructor() {
    this.refreshCounts();
  }

  persistUsers(): void {
    this.demo.saveUsers(this.users());
  }

  persistOrders(): void {
    this.demo.saveOrders(this.orders());
  }

  nextId(prefix: string): string {
    return `${prefix}-${Date.now().toString(36)}`;
  }

  private mergeUsers(): User[] {
    const seed = structuredClone(USERS);
    const stored = this.demo.loadUsers();
    if (!stored.length) {
      return seed;
    }
    const byId = new Map(seed.map((user) => [user.id, user]));
    const mobiles = new Set(seed.map((user) => user.mobile));
    for (const user of stored) {
      if (byId.has(user.id)) {
        byId.set(user.id, user);
      } else if (!mobiles.has(user.mobile)) {
        byId.set(user.id, user);
        mobiles.add(user.mobile);
      }
    }
    return [...byId.values()];
  }

  private mergeOrders(): Order[] {
    const seed = structuredClone(ORDERS);
    const stored = this.demo.loadOrders();
    if (!stored.length) {
      return seed;
    }
    const byId = new Map(seed.map((order) => [order.id, order]));
    for (const order of stored) {
      byId.set(order.id, order);
    }
    return [...byId.values()];
  }
}
