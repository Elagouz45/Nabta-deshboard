import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStore } from '@state/auth/auth.store';
import { UiStore } from '@state/ui/ui.store';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin">
      <aside class="side">
        <a routerLink="/">المتجر</a>
        <a routerLink="/admin/dashboard" routerLinkActive="active">لوحة التحكم</a>
        <a routerLink="/admin/products" routerLinkActive="active">المنتجات</a>
        <a routerLink="/admin/orders" routerLinkActive="active">الطلبات</a>
        <a routerLink="/admin/customers" routerLinkActive="active">العملاء</a>
        <a routerLink="/admin/articles" routerLinkActive="active">المقالات</a>
        <a routerLink="/admin/categories" routerLinkActive="active">التصنيفات</a>
        <a routerLink="/admin/companies" routerLinkActive="active">الشركات</a>
        <a routerLink="/admin/brands" routerLinkActive="active">العلامات</a>
        <a routerLink="/admin/crops" routerLinkActive="active">المحاصيل</a>
        <a routerLink="/admin/problems" routerLinkActive="active">المشكلات</a>
        <a routerLink="/admin/reviews" routerLinkActive="active">المراجعات</a>
        <a routerLink="/admin/coupons" routerLinkActive="active">الكوبونات</a>
        <a routerLink="/admin/inventory" routerLinkActive="active">المخزون</a>
        <a routerLink="/admin/messages" routerLinkActive="active">الرسائل</a>
        <a routerLink="/admin/settings" routerLinkActive="active">الإعدادات</a>
        <button type="button" class="btn secondary" (click)="auth.logout('/')">خروج</button>
      </aside>
      <main id="main" class="content"><router-outlet /></main>
    </div>
  `,
  styles: [`
    .admin { display:grid; grid-template-columns: 240px 1fr; min-height: 100dvh; }
    .side { background: var(--color-pale); color: var(--color-forest); padding: 16px; display: flex; flex-direction: column; gap: 8px; border-inline-end: 1px solid var(--color-border); }
    .side a { color: var(--color-forest); min-height: 40px; display: flex; align-items: center; }
    .content { padding: 24px; background: var(--color-bg); }
    @media (max-width: 900px) { .admin { grid-template-columns: 1fr; } .side { flex-direction: row; flex-wrap: nowrap; overflow: auto; } .side a, .side .btn { flex: 0 0 auto; white-space: nowrap; } .content { padding: 16px; min-width: 0; } }
  `],
})
export class AdminLayoutComponent {
  readonly auth = inject(AuthStore);
  readonly ui = inject(UiStore);
}
