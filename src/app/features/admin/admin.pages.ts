import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CatalogRepository } from '@data-access/repositories/catalog.repository';
import { KnowledgeRepository } from '@data-access/repositories/knowledge.repository';
import { AccountRepository } from '@data-access/repositories/account.repository';
import { Article, ContactMessage, Coupon, Order, OrderStatus, Product, Review, User } from '@core/models';
import { MoneyPipe } from '@shared/pipes/namaa.pipes';
import { SeoService } from '@core/services/seo.service';
import { UiStore } from '@state/ui/ui.store';
import { forkJoin } from 'rxjs';
import { CATEGORIES, COMPANIES, BRANDS } from '@data-access/mock/catalog.mock';
import { CROPS, PROBLEMS } from '@data-access/mock/crops.mock';

@Component({
  selector: 'app-admin-dashboard-page',
  imports: [RouterLink, MoneyPipe],
  template: `
    <h1>لوحة التحكم</h1>
    <div class="kpis">
      <article class="card pad"><p>المبيعات</p><strong>{{ sales() | money }}</strong></article>
      <article class="card pad"><p>الطلبات</p><strong>{{ orders().length }}</strong></article>
      <article class="card pad"><p>العملاء</p><strong>{{ customers() }}</strong></article>
      <article class="card pad"><p>المنتجات</p><strong>{{ products() }}</strong></article>
      <article class="card pad"><p>منخفض المخزون</p><strong>{{ lowStock() }}</strong></article>
      <article class="card pad"><p>قيد الانتظار</p><strong>{{ pending() }}</strong></article>
    </div>
    <svg viewBox="0 0 320 120" width="320" height="120" role="img" aria-label="اتجاه المبيعات">
      <polyline fill="none" stroke="#1F6A43" stroke-width="3" [attr.points]="points" />
    </svg>
    <h2>أحدث الطلبات</h2>
    @for (o of orders().slice(0,5); track o.id) {
      <p><a [routerLink]="['/admin/orders', o.id]">{{ o.orderNumber }}</a> — {{ o.status }}</p>
    }
  `,
  styles: [`.kpis{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px}.pad{padding:16px}`],
})
export class AdminDashboardPage {
  private readonly accounts = inject(AccountRepository);
  private readonly catalog = inject(CatalogRepository);
  private readonly seo = inject(SeoService);
  readonly orders = signal<Order[]>([]);
  readonly sales = signal(0);
  readonly customers = signal(0);
  readonly products = signal(0);
  readonly lowStock = signal(0);
  readonly pending = signal(0);
  points = '0,80 40,70 80,60 120,40 160,50 200,30 240,35 280,20 320,25';
  constructor() {
    this.seo.set({ title: 'إدارة', description: 'لوحة الإدارة', path: '/admin', noindex: true });
    forkJoin({
      orders: this.accounts.listOrders(null),
      customers: this.accounts.listCustomers(),
      products: this.catalog.queryProducts({ pageSize: 50 }),
    }).subscribe((res) => {
      this.orders.set(res.orders);
      this.sales.set(res.orders.reduce((s, o) => s + (o.status === 'cancelled' ? 0 : o.total), 0));
      this.customers.set(res.customers.length);
      this.products.set(res.products.total);
      this.lowStock.set(res.products.items.filter((p) => p.stockStatus !== 'in_stock').length);
      this.pending.set(res.orders.filter((o) => o.status === 'pending').length);
    });
  }
}

@Component({
  selector: 'app-admin-products-page',
  imports: [RouterLink, FormsModule],
  template: `
    <div class="list-row"><h1>المنتجات</h1><a class="btn" routerLink="/admin/products/new">منتج جديد</a></div>
    <input class="input" placeholder="بحث" [(ngModel)]="q" (change)="load()" />
    @for (p of items(); track p.id) {
      <article class="card list-row">
        <span>{{ p.nameAr }} · {{ p.stockQuantity }}</span>
        <span>
          <a [routerLink]="['/admin/products', p.id, 'edit']">تعديل</a>
          <button class="btn ghost" type="button" (click)="toggle(p)">{{ p.isActive ? 'إيقاف' : 'تفعيل' }}</button>
        </span>
      </article>
    }
  `,
})
export class AdminProductsPage {
  private readonly catalog = inject(CatalogRepository);
  q = '';
  readonly items = signal<Product[]>([]);
  constructor() { this.load(); }
  load(): void {
    this.catalog.queryProducts({ q: this.q, pageSize: 50 }).subscribe((r) => this.items.set(r.items));
  }
  toggle(p: Product): void {
    this.catalog.setProductActive(p.id, !p.isActive).subscribe(() => this.load());
  }
}

@Component({
  selector: 'app-admin-orders-page',
  imports: [RouterLink, FormsModule, MoneyPipe],
  template: `
    <h1>الطلبات</h1>
    <select class="input" [(ngModel)]="status" (change)="filter()">
      <option value="">الكل</option>
      @for (s of statuses; track s) { <option [value]="s">{{ s }}</option> }
    </select>
    @for (o of filtered(); track o.id) {
      <p><a [routerLink]="['/admin/orders', o.id]">{{ o.orderNumber }}</a> — {{ o.status }} — {{ o.total | money }}</p>
    }
  `,
})
export class AdminOrdersPage {
  private readonly accounts = inject(AccountRepository);
  readonly all = signal<Order[]>([]);
  readonly filtered = signal<Order[]>([]);
  status = '';
  statuses: OrderStatus[] = ['pending','confirmed','processing','shipped','delivered','cancelled','returned'];
  constructor() {
    this.accounts.listOrders(null).subscribe((r) => { this.all.set(r); this.filtered.set(r); });
  }
  filter(): void {
    this.filtered.set(this.status ? this.all().filter((o) => o.status === this.status) : this.all());
  }
}

@Component({
  selector: 'app-admin-order-details-page',
  imports: [FormsModule, MoneyPipe],
  template: `
    @if (order(); as o) {
      <h1>{{ o.orderNumber }}</h1>
      <p>{{ o.customerName }} · {{ o.customerMobile }}</p>
      <p>{{ o.address.governorate }} / {{ o.address.city }} / {{ o.address.street }}</p>
      <p>الدفع: {{ o.paymentMethod }} · {{ o.total | money }}</p>
      <label>تحديث الحالة
        <select class="input" [(ngModel)]="next">
          @for (s of statuses; track s) { <option [value]="s">{{ s }}</option> }
        </select>
      </label>
      <button class="btn" type="button" (click)="update()">حفظ الحالة</button>
    }
  `,
})
export class AdminOrderDetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly accounts = inject(AccountRepository);
  private readonly ui = inject(UiStore);
  readonly order = signal<Order | null>(null);
  next: OrderStatus = 'pending';
  statuses: OrderStatus[] = ['pending','confirmed','processing','shipped','delivered','cancelled','returned'];
  constructor() {
    this.accounts.getOrder(this.route.snapshot.paramMap.get('id') || '').subscribe((o) => {
      this.order.set(o);
      this.next = o.status;
    });
  }
  update(): void {
    const o = this.order();
    if (!o) return;
    this.accounts.updateOrderStatus(o.id, this.next).subscribe((row) => {
      this.order.set(row);
      this.ui.toast('تم تحديث الحالة.');
    });
  }
}

@Component({
  selector: 'app-admin-list-page',
  standalone: true,
  template: `<h1>{{ title }}</h1><ul>@for (x of items; track x) { <li>{{ x }}</li> }</ul>`,
})
export class AdminSimpleList {
  title = '';
  items: string[] = [];
}

@Component({ selector: 'app-admin-categories-page', template: `<h1>التصنيفات</h1><ul>@for (c of items; track c.id) { <li>{{ c.nameAr }}</li> }</ul>` })
export class AdminCategoriesPage { items = CATEGORIES; }

@Component({ selector: 'app-admin-companies-page', template: `<h1>الشركات</h1><ul>@for (c of items; track c.id) { <li>{{ c.nameAr }}</li> }</ul>` })
export class AdminCompaniesPage { items = COMPANIES; }

@Component({ selector: 'app-admin-brands-page', template: `<h1>العلامات</h1><ul>@for (c of items; track c.id) { <li>{{ c.nameAr }}</li> }</ul>` })
export class AdminBrandsPage { items = BRANDS; }

@Component({ selector: 'app-admin-crops-page', template: `<h1>المحاصيل</h1><ul>@for (c of items; track c.id) { <li>{{ c.nameAr }}</li> }</ul>` })
export class AdminCropsPage { items = CROPS; }

@Component({ selector: 'app-admin-problems-page', template: `<h1>المشكلات</h1><ul>@for (c of items; track c.id) { <li>{{ c.nameAr }}</li> }</ul>` })
export class AdminProblemsPage { items = PROBLEMS; }

@Component({
  selector: 'app-admin-customers-page',
  template: `<h1>العملاء</h1>@for (u of users(); track u.id) { <p>{{ u.fullName }} · {{ u.mobile }}</p> }`,
})
export class AdminCustomersPage {
  private readonly accounts = inject(AccountRepository);
  readonly users = signal<User[]>([]);
  constructor() { this.accounts.listCustomers().subscribe((r) => this.users.set(r)); }
}

@Component({
  selector: 'app-admin-articles-page',
  imports: [RouterLink],
  template: `<div class="list-row"><h1>المقالات</h1><a class="btn" routerLink="/admin/articles/new">مقال جديد</a></div>
    @for (a of items(); track a.id) { <p><a [routerLink]="['/admin/articles', a.id, 'edit']">{{ a.titleAr }}</a> — {{ a.status }}</p> }`,
})
export class AdminArticlesPage {
  private readonly knowledge = inject(KnowledgeRepository);
  readonly items = signal<Article[]>([]);
  constructor() { this.knowledge.listArticles({ pageSize: 50 }).subscribe((r) => this.items.set(r.items)); }
}

@Component({
  selector: 'app-admin-reviews-page',
  template: `<h1>المراجعات</h1>@for (r of items(); track r.id) { <p>{{ r.userName }} — {{ r.rating }} — {{ r.bodyAr }}</p> }`,
})
export class AdminReviewsPage {
  private readonly catalog = inject(CatalogRepository);
  readonly items = signal<Review[]>([]);
  constructor() {
    this.catalog.queryProducts({ pageSize: 30 }).subscribe((res) => {
      res.items.forEach((p) => this.catalog.listReviews(p.id).subscribe((r) => this.items.update((x) => [...x, ...r])));
    });
  }
}

@Component({
  selector: 'app-admin-coupons-page',
  template: `<h1>الكوبونات</h1>@for (c of items(); track c.id) { <p>{{ c.code }} — {{ c.descriptionAr }} — {{ c.active ? 'نشط' : 'متوقف' }}</p> }`,
})
export class AdminCouponsPage {
  private readonly accounts = inject(AccountRepository);
  readonly items = signal<Coupon[]>([]);
  constructor() { this.accounts.listCoupons().subscribe((r) => this.items.set(r)); }
}

@Component({
  selector: 'app-admin-inventory-page',
  template: `<h1>المخزون</h1>@for (p of items(); track p.id) { <p>{{ p.nameAr }} — {{ p.stockQuantity }} ({{ p.stockStatus }})</p> }`,
})
export class AdminInventoryPage {
  private readonly catalog = inject(CatalogRepository);
  readonly items = signal<Product[]>([]);
  constructor() { this.catalog.queryProducts({ pageSize: 50 }).subscribe((r) => this.items.set(r.items)); }
}

@Component({
  selector: 'app-admin-messages-page',
  template: `<h1>الرسائل</h1>@for (m of items(); track m.id) { <p>{{ m.name }} — {{ m.type }} — {{ m.message }}</p> }`,
})
export class AdminMessagesPage {
  private readonly accounts = inject(AccountRepository);
  readonly items = signal<ContactMessage[]>([]);
  constructor() { this.accounts.listMessages().subscribe((r) => this.items.set(r)); }
}

@Component({
  selector: 'app-admin-settings-page',
  template: `<h1>الإعدادات</h1><p>هوية العلامة تُدار من ملف brand.config.ts. Laravel سيملك الإعدادات لاحقًا.</p>`,
})
export class AdminSettingsPage {}
