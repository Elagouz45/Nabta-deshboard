import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AccountRepository } from '@data-access/repositories/account.repository';
import { AuthStore } from '@state/auth/auth.store';
import { Order } from '@core/models';
import { MoneyPipe } from '@shared/pipes/namaa.pipes';
import { SeoService } from '@core/services/seo.service';

@Component({
  selector: 'app-checkout-success-page',
  imports: [RouterLink, MoneyPipe],
  template: `
    <div class="app-container section">
      <h1>تم استلام طلبك</h1>
      @if (order(); as o) {
        <p>رقم الطلب: <strong>{{ o.orderNumber }}</strong></p>
        <p>الإجمالي {{ o.total | money }} · الدفع عند الاستلام ما لم يُختر غير ذلك.</p>
        <p>مدة التوصيل تقديرية حسب طريقة الشحن المختارة.</p>
        <a class="btn" [routerLink]="['/account/orders', o.id]">تتبع الطلب</a>
        <a class="btn secondary" routerLink="/shop">متابعة التسوق</a>
        @if (!auth.isLoggedIn()) {
          <p>أنشئ حسابًا لحفظ الطلبات القادمة. <a routerLink="/auth/register">تسجيل</a></p>
        }
      }
    </div>
  `,
})
export class CheckoutSuccessPage {
  private readonly route = inject(ActivatedRoute);
  private readonly accounts = inject(AccountRepository);
  readonly auth = inject(AuthStore);
  private readonly seo = inject(SeoService);
  readonly order = signal<Order | null>(null);
  constructor() {
    this.seo.set({ title: 'نجاح الطلب', description: 'تأكيد الطلب', path: '/checkout/success', noindex: true });
    const num = this.route.snapshot.paramMap.get('orderNumber') || '';
    this.accounts.getOrder(num).subscribe((o) => this.order.set(o));
  }
}

@Component({
  selector: 'app-checkout-failure-page',
  imports: [RouterLink],
  template: `
    <div class="app-container section">
      <h1>تعذر إتمام الطلب</h1>
      <p>لم يُخصم أي مبلغ. راجع السلة وحاول مرة أخرى.</p>
      <a class="btn" routerLink="/cart">العودة للسلة</a>
    </div>
  `,
})
export class CheckoutFailurePage {
  private readonly seo = inject(SeoService);
  constructor() {
    this.seo.set({ title: 'فشل الطلب', description: 'لم يكتمل الطلب', path: '/checkout/failure', noindex: true });
  }
}
