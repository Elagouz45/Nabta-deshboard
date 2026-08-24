import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '@state/auth/auth.store';
import { AccountRepository } from '@data-access/repositories/account.repository';
import { CatalogRepository } from '@data-access/repositories/catalog.repository';
import { RecentlyViewedStore } from '@state/ui/recently-viewed.store';
import { Address, Order, OrderStatus, PaymentMethodCode, Product } from '@core/models';
import { MoneyPipe } from '@shared/pipes/namaa.pipes';
import { egyptianMobileValidator, passwordStrengthValidator } from '@shared/validators/namaa.validators';
import { EGYPT_GOVERNORATES } from '@core/constants/app.constants';
import { SeoService } from '@core/services/seo.service';
import { UiStore } from '@state/ui/ui.store';
import { forkJoin, of } from 'rxjs';
import { ProductCardComponent } from '@shared/ui/product-card.component';
import { StatusBadgeComponent } from '@shared/ui/status-badge.component';
import { EmptyStateComponent } from '@shared/ui/feedback.component';

const ORDER_STATUS_AR: Record<OrderStatus, string> = {
  pending: 'قيد المراجعة',
  confirmed: 'تم التأكيد',
  processing: 'جاري التجهيز',
  shipped: 'خرج للتوصيل',
  delivered: 'تم التسليم',
  cancelled: 'تم الإلغاء',
  returned: 'مرتجع',
};

const ORDER_STATUS_TONE: Record<OrderStatus, string> = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
  returned: 'error',
};

const PAYMENT_AR: Record<PaymentMethodCode, string> = {
  cod: 'الدفع عند الاستلام',
  card: 'بطاقة بنكية',
  wallet: 'محفظة إلكترونية',
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat('ar-EG', { dateStyle: 'medium' }).format(date);
}

@Component({
  selector: 'app-account-subnav',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="account-subnav" aria-label="صفحات الحساب">
      <a routerLink="/account" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">حسابي</a>
      <a routerLink="/account/orders" routerLinkActive="active">طلباتي</a>
      <a routerLink="/account/addresses" routerLinkActive="active">العناوين</a>
      <a routerLink="/wishlist">المفضلة</a>
      <a routerLink="/account/recently-viewed" routerLinkActive="active">شوهد مؤخرًا</a>
      <a routerLink="/account/notifications" routerLinkActive="active">الإشعارات</a>
      <a routerLink="/account/security" routerLinkActive="active">الأمان</a>
    </nav>
  `,
})
export class AccountSubnavComponent {}

@Component({
  selector: 'app-account-dashboard-page',
  imports: [RouterLink, ReactiveFormsModule, MoneyPipe, StatusBadgeComponent, AccountSubnavComponent],
  template: `
    <article class="account-page app-container">
      <p class="kicker">حسابك في المتجر</p>
      <h1>حسابي</h1>
      <p class="muted">إدارة بياناتك وطلباتك من داخل نبته، مثل السلة والمفضلة.</p>
      <app-account-subnav />
      <div class="account-grid">
        <section class="card pad profile">
          <div class="identity">
            <span class="avatar">{{ initial() }}</span>
            <div>
              <h2>{{ auth.user()?.fullName }}</h2>
              <p class="muted">{{ auth.user()?.mobile }}</p>
              @if (auth.user()?.email) {
                <p class="muted">{{ auth.user()?.email }}</p>
              }
            </div>
          </div>
          <form [formGroup]="form" (ngSubmit)="save()">
            <label>الاسم بالكامل <input class="input" formControlName="fullName" /></label>
            <label>البريد الإلكتروني <input class="input" formControlName="email" /></label>
            <button class="btn" type="submit">حفظ التعديلات</button>
          </form>
        </section>
        <section class="card pad">
          <h2>تغيير كلمة المرور</h2>
          <p class="muted">تجزئة كلمة المرور هنا للعرض المحلي فقط، وليست مصادقة إنتاج.</p>
          <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
            <label>كلمة المرور الحالية <input class="input" type="password" formControlName="current" autocomplete="current-password" /></label>
            <label>كلمة المرور الجديدة <input class="input" type="password" formControlName="next" autocomplete="new-password" /></label>
            <button class="btn secondary" type="submit" [disabled]="passwordForm.invalid">تحديث كلمة المرور</button>
          </form>
        </section>
        <section>
          <div class="section-head">
            <h2>آخر الطلبات</h2>
            <a routerLink="/account/orders">كل الطلبات</a>
          </div>
          @if (!orders().length) {
            <p class="muted">لا توجد طلبات حتى الآن.</p>
            <a class="btn secondary" routerLink="/shop">تسوق الآن</a>
          } @else {
            <div class="stack">
              @for (o of orders(); track o.id) {
                <a class="card pad order-link" [routerLink]="['/account/orders', o.id]">
                  <strong>{{ o.orderNumber }}</strong>
                  <app-status-badge [label]="statusLabel(o.status)" [tone]="statusTone(o.status)" />
                  <p>{{ formatDate(o.createdAt) }} · {{ o.total | money }}</p>
                </a>
              }
            </div>
          }
        </section>
      </div>
    </article>
  `,
})
export class AccountDashboardPage {
  readonly auth = inject(AuthStore);
  private readonly accounts = inject(AccountRepository);
  private readonly seo = inject(SeoService);
  private readonly ui = inject(UiStore);
  private readonly fb = inject(FormBuilder);
  readonly orders = signal<Order[]>([]);
  readonly form = this.fb.nonNullable.group({
    fullName: [this.auth.user()?.fullName ?? '', Validators.required],
    email: [this.auth.user()?.email ?? ''],
  });
  readonly passwordForm = this.fb.nonNullable.group({
    current: ['', Validators.required],
    next: ['', [Validators.required, passwordStrengthValidator()]],
  });

  constructor() {
    this.seo.set({ title: 'حسابي', description: 'حساب عميل نبته', path: '/account', noindex: true });
    this.accounts.listOrders(this.auth.user()?.id ?? null).subscribe((rows) => this.orders.set(rows.slice(0, 4)));
  }

  initial(): string {
    return this.auth.user()?.fullName?.trim().charAt(0) || '؟';
  }

  statusLabel(status: OrderStatus): string {
    return ORDER_STATUS_AR[status];
  }

  statusTone(status: OrderStatus): string {
    return ORDER_STATUS_TONE[status];
  }

  formatDate(value: string): string {
    return formatDate(value);
  }

  save(): void {
    const value = this.form.getRawValue();
    const user = this.auth.user();
    if (!user || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.auth.updateUser({ ...user, ...value });
    this.accounts.updateProfile(value).subscribe(() => this.ui.toast('تم حفظ البيانات.'));
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    const value = this.passwordForm.getRawValue();
    this.accounts.changePassword(value.current, value.next).subscribe({
      next: () => {
        this.passwordForm.reset();
        this.ui.toast('تم تحديث كلمة المرور التجريبية.');
      },
      error: () => this.ui.toast('تعذر تحديث كلمة المرور.', 'error'),
    });
  }
}

@Component({
  selector: 'app-account-profile-page',
  imports: [AccountSubnavComponent],
  template: `
    <article class="account-page app-container">
      <h1>الملف الشخصي</h1>
      <app-account-subnav />
      <p class="muted">تم نقل تعديل البيانات إلى صفحة حسابي.</p>
      <a class="btn" routerLink="/account">حسابي</a>
    </article>
  `,
})
export class AccountProfilePage {}

@Component({
  selector: 'app-account-orders-page',
  imports: [RouterLink, MoneyPipe, StatusBadgeComponent, EmptyStateComponent, AccountSubnavComponent],
  template: `
    <article class="account-page app-container">
      <p class="kicker">طلباتك</p>
      <h1>طلباتي</h1>
      <app-account-subnav />
      @if (!orders().length) {
        <app-empty-state title="لا توجد طلبات حتى الآن." message="أتمم طلبًا من السلة ليظهر هنا مرتبطًا بحسابك.">
          <a class="btn" routerLink="/shop">متابعة التسوق</a>
        </app-empty-state>
      } @else {
        <div class="stack">
          @for (o of orders(); track o.id) {
            <article class="card pad order-row">
              <div>
                <p class="muted">رقم الطلب</p>
                <strong>{{ o.orderNumber }}</strong>
              </div>
              <div>
                <p class="muted">التاريخ</p>
                <p>{{ formatDate(o.createdAt) }}</p>
              </div>
              <div>
                <p class="muted">الإجمالي</p>
                <p>{{ o.total | money }}</p>
              </div>
              <app-status-badge [label]="statusLabel(o.status)" [tone]="statusTone(o.status)" />
              <a class="btn secondary" [routerLink]="['/account/orders', o.id]">عرض التفاصيل</a>
            </article>
          }
        </div>
      }
    </article>
  `,
})
export class AccountOrdersPage {
  private readonly accounts = inject(AccountRepository);
  private readonly auth = inject(AuthStore);
  private readonly seo = inject(SeoService);
  readonly orders = signal<Order[]>([]);

  constructor() {
    this.seo.set({ title: 'طلباتي', description: 'طلبات حساب نبته', path: '/account/orders', noindex: true });
    this.accounts.listOrders(this.auth.user()?.id ?? null).subscribe((rows) => this.orders.set(rows));
  }

  statusLabel(status: OrderStatus): string {
    return ORDER_STATUS_AR[status];
  }

  statusTone(status: OrderStatus): string {
    return ORDER_STATUS_TONE[status];
  }

  formatDate(value: string): string {
    return formatDate(value);
  }
}

@Component({
  selector: 'app-account-order-details-page',
  imports: [RouterLink, MoneyPipe, StatusBadgeComponent, EmptyStateComponent, AccountSubnavComponent],
  template: `
    <article class="account-page app-container">
      <app-account-subnav />
      @if (order(); as o) {
        <p class="kicker">تفاصيل الطلب</p>
        <h1>{{ o.orderNumber }}</h1>
        <app-status-badge [label]="statusLabel(o.status)" [tone]="statusTone(o.status)" />
        <p class="muted">{{ formatDate(o.createdAt) }}</p>
        <ol class="timeline">
          @for (event of o.statusHistory; track event.at) {
            <li>
              <strong>{{ statusLabel(event.status) }}</strong>
              <span class="muted">{{ formatDate(event.at) }}</span>
            </li>
          }
        </ol>
        <section class="card pad">
          <h2>المنتجات</h2>
          @for (item of o.items; track item.sku) {
            <p>{{ item.nameAr }} × {{ item.quantity }} = {{ item.lineTotal | money }}</p>
          }
          <p>المجموع {{ o.subtotal | money }}</p>
          @if (o.discount) {
            <p>خصم {{ o.discount | money }}</p>
          }
          <p>الشحن {{ o.shipping | money }}</p>
          <p><strong>الإجمالي {{ o.total | money }}</strong></p>
        </section>
        <section class="card pad">
          <h2>التوصيل والدفع</h2>
          <p>{{ o.address.governorate }} / {{ o.address.city }} / {{ o.address.area }}</p>
          <p>{{ o.address.street }} {{ o.address.building }}</p>
          <p>{{ paymentLabel(o.paymentMethod) }}</p>
        </section>
        @if (o.status === 'pending' || o.status === 'confirmed') {
          <button class="btn secondary" type="button" (click)="cancel(o.id)">طلب إلغاء</button>
        }
        <a class="btn ghost" routerLink="/account/orders">كل الطلبات</a>
      } @else {
        <app-empty-state title="الطلب غير متاح" message="قد يكون الطلب غير موجود أو لا يتبع هذا الحساب.">
          <a class="btn" routerLink="/account/orders">طلباتي</a>
        </app-empty-state>
      }
    </article>
  `,
})
export class AccountOrderDetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly accounts = inject(AccountRepository);
  private readonly auth = inject(AuthStore);
  private readonly ui = inject(UiStore);
  readonly order = signal<Order | null>(null);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.accounts.getOrder(id).subscribe({
      next: (order) => {
        const userId = this.auth.user()?.id;
        this.order.set(order.userId && userId && order.userId !== userId ? null : order);
      },
      error: () => this.order.set(null),
    });
  }

  statusLabel(status: OrderStatus): string {
    return ORDER_STATUS_AR[status];
  }

  statusTone(status: OrderStatus): string {
    return ORDER_STATUS_TONE[status];
  }

  paymentLabel(method: PaymentMethodCode): string {
    return PAYMENT_AR[method];
  }

  formatDate(value: string): string {
    return formatDate(value);
  }

  cancel(id: string): void {
    this.accounts.requestCancel(id, 'طلب العميل').subscribe((order) => {
      this.order.set(order);
      this.ui.toast('تم إرسال طلب الإلغاء.');
    });
  }
}

@Component({
  selector: 'app-account-addresses-page',
  imports: [ReactiveFormsModule, AccountSubnavComponent],
  template: `
    <article class="account-page app-container">
      <h1>العناوين</h1>
      <app-account-subnav />
      @for (a of addresses(); track a.id) {
        <article class="card pad">
          <p>{{ a.label }} — {{ a.governorate }} / {{ a.city }} / {{ a.street }}</p>
          <button class="btn ghost" type="button" (click)="remove(a.id)">حذف</button>
        </article>
      }
      <form class="card pad" [formGroup]="form" (ngSubmit)="save()">
        <h2>عنوان جديد</h2>
        <label>الاسم <input class="input" formControlName="fullName" /></label>
        <label>الهاتف <input class="input" formControlName="mobile" /></label>
        <label>المحافظة
          <select class="input" formControlName="governorate">
            @for (g of governorates; track g) {
              <option [value]="g">{{ g }}</option>
            }
          </select>
        </label>
        <label>المدينة <input class="input" formControlName="city" /></label>
        <label>المنطقة <input class="input" formControlName="area" /></label>
        <label>الشارع <input class="input" formControlName="street" /></label>
        <label>المبنى <input class="input" formControlName="building" /></label>
        <button class="btn" type="submit">حفظ العنوان</button>
      </form>
    </article>
  `,
})
export class AccountAddressesPage {
  private readonly accounts = inject(AccountRepository);
  private readonly auth = inject(AuthStore);
  private readonly fb = inject(FormBuilder);
  readonly governorates = EGYPT_GOVERNORATES;
  readonly addresses = signal<Address[]>([]);
  readonly form = this.fb.nonNullable.group({
    fullName: [this.auth.user()?.fullName ?? '', Validators.required],
    mobile: [this.auth.user()?.mobile ?? '', [Validators.required, egyptianMobileValidator()]],
    governorate: ['القاهرة', Validators.required],
    city: ['', Validators.required],
    area: ['', Validators.required],
    street: ['', Validators.required],
    building: ['', Validators.required],
  });

  constructor() {
    this.refresh();
  }

  save(): void {
    const user = this.auth.user();
    if (!user || this.form.invalid) {
      return;
    }
    const value = this.form.getRawValue();
    this.accounts
      .saveAddress({
        id: '',
        userId: user.id,
        label: 'عنوان',
        landmark: '',
        notes: '',
        isDefault: this.addresses().length === 0,
        ...value,
      })
      .subscribe(() => this.refresh());
  }

  remove(id: string): void {
    this.accounts.deleteAddress(id).subscribe(() => this.refresh());
  }

  private refresh(): void {
    const id = this.auth.user()?.id;
    if (id) {
      this.accounts.listAddresses(id).subscribe((rows) => this.addresses.set(rows));
    }
  }
}

@Component({
  selector: 'app-account-recent-page',
  imports: [ProductCardComponent, AccountSubnavComponent],
  template: `
    <article class="account-page app-container">
      <h1>شوهد مؤخرًا</h1>
      <app-account-subnav />
      <div class="grid-products">
        @for (p of products(); track p.id) {
          <app-product-card [product]="p" />
        }
      </div>
    </article>
  `,
})
export class AccountRecentPage {
  private readonly recent = inject(RecentlyViewedStore);
  private readonly catalog = inject(CatalogRepository);
  readonly products = signal<Product[]>([]);

  constructor() {
    const ids = this.recent.ids();
    (ids.length ? forkJoin(ids.map((id) => this.catalog.getProductById(id))) : of([])).subscribe((rows) =>
      this.products.set(rows),
    );
  }
}

@Component({
  selector: 'app-account-notifications-page',
  imports: [ReactiveFormsModule, AccountSubnavComponent],
  template: `
    <article class="account-page app-container">
      <h1>الإشعارات</h1>
      <app-account-subnav />
      @for (n of notes(); track n.id) {
        <article class="card pad">
          <strong>{{ n.titleAr }}</strong>
          <p>{{ n.bodyAr }}</p>
        </article>
      }
      <form class="card pad" [formGroup]="form" (ngSubmit)="save()">
        <label><input type="checkbox" formControlName="orderUpdates" /> تحديثات الطلب</label>
        <label><input type="checkbox" formControlName="offers" /> العروض</label>
        <label><input type="checkbox" formControlName="academy" /> الأكاديمية</label>
        <button class="btn" type="submit">حفظ التفضيلات</button>
      </form>
    </article>
  `,
})
export class AccountNotificationsPage {
  private readonly accounts = inject(AccountRepository);
  private readonly auth = inject(AuthStore);
  private readonly fb = inject(FormBuilder);
  private readonly ui = inject(UiStore);
  readonly notes = signal<{ id: string; titleAr: string; bodyAr: string }[]>([]);
  readonly form = this.fb.nonNullable.group({
    orderUpdates: [true],
    offers: [false],
    academy: [true],
    sms: [true],
    whatsapp: [true],
  });

  constructor() {
    const id = this.auth.user()?.id;
    if (id) {
      this.accounts.notifications(id).subscribe((rows) => this.notes.set(rows));
    }
  }

  save(): void {
    const id = this.auth.user()?.id;
    if (!id) {
      return;
    }
    this.accounts.saveNotificationPrefs(id, this.form.getRawValue()).subscribe(() => this.ui.toast('تم حفظ التفضيلات.'));
  }
}

@Component({
  selector: 'app-account-security-page',
  imports: [ReactiveFormsModule, AccountSubnavComponent],
  template: `
    <article class="account-page app-container">
      <h1>الأمان</h1>
      <app-account-subnav />
      <form class="card pad" [formGroup]="form" (ngSubmit)="save()">
        <label>كلمة المرور الحالية <input class="input" type="password" formControlName="current" /></label>
        <label>كلمة المرور الجديدة <input class="input" type="password" formControlName="next" /></label>
        <button class="btn" type="submit" [disabled]="form.invalid">تغيير</button>
      </form>
      <p class="muted">تجزئة كلمة المرور هنا للعرض المحلي فقط، وليست مصادقة إنتاج.</p>
    </article>
  `,
})
export class AccountSecurityPage {
  private readonly fb = inject(FormBuilder);
  private readonly accounts = inject(AccountRepository);
  private readonly ui = inject(UiStore);
  readonly form = this.fb.nonNullable.group({
    current: ['', Validators.required],
    next: ['', [Validators.required, passwordStrengthValidator()]],
  });

  save(): void {
    const value = this.form.getRawValue();
    this.accounts.changePassword(value.current, value.next).subscribe(() => this.ui.toast('تم تحديث كلمة المرور التجريبية.'));
  }
}
