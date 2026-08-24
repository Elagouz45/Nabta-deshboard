import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartStore } from '@state/cart/cart.store';
import { AuthStore } from '@state/auth/auth.store';
import { AccountRepository } from '@data-access/repositories/account.repository';
import { egyptianMobileValidator, emailValidator } from '@shared/validators/namaa.validators';
import { MoneyPipe } from '@shared/pipes/namaa.pipes';
import { PaymentMethod, ShippingMethod } from '@core/models';
import { EGYPT_GOVERNORATES } from '@core/constants/app.constants';
import { SeoService } from '@core/services/seo.service';
import { UiStore } from '@state/ui/ui.store';
import { EmptyStateComponent } from '@shared/ui/feedback.component';

@Component({
  selector: 'app-checkout-page',
  imports: [ReactiveFormsModule, RouterLink, MoneyPipe, EmptyStateComponent],
  template: `
    <div class="app-container section">
      <h1>إتمام الطلب</h1>
      @if (!cart.views().length) {
        <app-empty-state title="السلة فارغة" message="أضف منتجات من المتجر قبل إتمام الطلب.">
          <a class="btn" routerLink="/shop">العودة للمتجر</a>
          <a class="btn secondary" routerLink="/cart">مراجعة السلة</a>
        </app-empty-state>
      } @else {
        <p>الخطوة {{ step() }} من 5</p>
        <form [formGroup]="form" (ngSubmit)="next()">
          @switch (step()) {
            @case (1) {
              <label>الاسم الكامل <input class="input" formControlName="fullName" /></label>
              <label>الهاتف <input class="input" formControlName="mobile" /></label>
              <label>هاتف بديل <input class="input" formControlName="mobileAlt" /></label>
              <label>البريد (اختياري) <input class="input" formControlName="email" /></label>
            }
            @case (2) {
              <label>المحافظة
                <select class="input" formControlName="governorate">
                  @for (g of governorates; track g) { <option [value]="g">{{ g }}</option> }
                </select>
              </label>
              <label>المدينة <input class="input" formControlName="city" /></label>
              <label>القرية/المنطقة <input class="input" formControlName="area" /></label>
              <label>الشارع <input class="input" formControlName="street" /></label>
              <label>المبنى <input class="input" formControlName="building" /></label>
              <label>علامة مميزة <input class="input" formControlName="landmark" /></label>
              <label>ملاحظات <textarea class="input" formControlName="notes"></textarea></label>
            }
            @case (3) {
              @for (s of shipping(); track s.id) {
                <label class="card choice">
                  <input type="radio" formControlName="shippingMethodId" [value]="s.id" />
                  {{ s.nameAr }} — {{ s.price | money }} ({{ s.estimatedDaysMin }}–{{ s.estimatedDaysMax }} أيام)
                </label>
              }
            }
            @case (4) {
              @for (p of payments(); track p.id) {
                <label class="card choice">
                  <input type="radio" formControlName="paymentMethod" [value]="p.id" />
                  {{ p.nameAr }}
                  <small>{{ p.descriptionAr }}</small>
                </label>
              }
            }
            @case (5) {
              <p>{{ form.value.fullName }} · {{ form.value.mobile }}</p>
              <p>{{ form.value.governorate }} — {{ form.value.city }} — {{ form.value.street }}</p>
              <p>الإجمالي: {{ cart.breakdown().total | money }}</p>
              <label><input type="checkbox" formControlName="acceptTerms" /> أوافق على الشروط وسياسة الإرجاع</label>
            }
          }
          <div class="form-actions">
            @if (step() > 1) { <button class="btn secondary" type="button" (click)="step.set(step() - 1)">رجوع</button> }
            <button class="btn" type="submit" [disabled]="busy()">{{ step() === 5 ? 'تأكيد الطلب' : 'التالي' }}</button>
          </div>
        </form>
        <aside class="card pad summary">
          <h2>ملخص</h2>
          <p>خصم العروض: {{ cart.breakdown().saleDiscount | money }}</p>
          <p>خصم الكوبون: {{ cart.breakdown().couponDiscount | money }}</p>
          <p>الشحن: {{ cart.breakdown().shipping | money }}</p>
          <p><strong>الإجمالي: {{ cart.breakdown().total | money }}</strong></p>
          <p class="muted">ملاحظة التوصيل تظهر بعد اختيار المحافظة وطريقة الشحن.</p>
        </aside>
      }
    </div>
  `,
  styles: `
    .section { display: block; }
    form { display: grid; gap: 12px; }
    label { display: grid; gap: 6px; }
    .summary { background: var(--color-white); margin-top: 24px; }
    app-empty-state { grid-column: 1 / -1; }
    app-empty-state .btn { margin: 6px; }
    @media (min-width: 900px) {
      .section { display: grid; grid-template-columns: 1fr 280px; gap: 24px; align-items: start; }
      h1, p:first-of-type { grid-column: 1 / -1; }
      .summary { position: sticky; top: 96px; margin-top: 0; }
    }
    @media (max-width: 560px) {
      .btn { width: 100%; }
    }
  `,
})
export class CheckoutPage {
  private readonly fb = inject(FormBuilder);
  readonly cart = inject(CartStore);
  private readonly auth = inject(AuthStore);
  private readonly accounts = inject(AccountRepository);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly ui = inject(UiStore);
  readonly step = signal(1);
  readonly busy = signal(false);
  readonly governorates = EGYPT_GOVERNORATES;
  readonly shipping = signal<ShippingMethod[]>([]);
  readonly payments = signal<PaymentMethod[]>([]);
  readonly form = this.fb.nonNullable.group({
    fullName: [this.auth.user()?.fullName ?? '', Validators.required],
    mobile: [this.auth.user()?.mobile ?? '', [Validators.required, egyptianMobileValidator()]],
    mobileAlt: [''],
    email: [this.auth.user()?.email ?? '', emailValidator()],
    governorate: ['القاهرة', Validators.required],
    city: ['', Validators.required],
    area: ['', Validators.required],
    street: ['', Validators.required],
    building: ['', Validators.required],
    landmark: [''],
    notes: [''],
    shippingMethodId: ['ship-std', Validators.required],
    paymentMethod: ['cod' as const, Validators.required],
    acceptTerms: [false, Validators.requiredTrue],
  });

  constructor() {
    this.seo.set({ title: 'إتمام الطلب', description: 'خطوات الطلب', path: '/checkout', noindex: true });
    this.accounts.listShipping().subscribe((r) => this.shipping.set(r));
    this.accounts.listPayments().subscribe((r) => this.payments.set(r));
    this.cart.shippingId.set(this.form.controls.shippingMethodId.value);
    this.form.controls.shippingMethodId.valueChanges.subscribe((id) => {
      if (id) {
        this.cart.shippingId.set(id);
      }
    });
  }

  next(): void {
    if (this.step() < 5) {
      this.step.update((s) => s + 1);
      return;
    }
    if (this.form.invalid || this.busy()) {
      this.form.markAllAsTouched();
      return;
    }
    this.busy.set(true);
    const v = this.form.getRawValue();
    this.accounts
      .placeOrder(
        {
          fullName: v.fullName,
          mobile: v.mobile,
          mobileAlt: v.mobileAlt,
          email: v.email,
          address: {
            governorate: v.governorate,
            city: v.city,
            area: v.area,
            street: v.street,
            building: v.building,
            landmark: v.landmark,
            notes: v.notes,
          },
          shippingMethodId: v.shippingMethodId,
          paymentMethod: v.paymentMethod,
          couponCode: this.cart.coupon()?.code ?? null,
          acceptTerms: v.acceptTerms,
        },
        this.cart.items().map((i) => ({ productId: i.productId, quantity: i.quantity })),
        this.auth.user()?.id ?? null,
      )
      .subscribe({
        next: (order) => {
          this.cart.clear();
          void this.router.navigate(['/checkout/success', order.orderNumber]);
        },
        error: (err: { messageAr?: string }) => {
          this.busy.set(false);
          this.ui.toast(err.messageAr ?? 'تعذر إنشاء الطلب', 'error');
          void this.router.navigateByUrl('/checkout/failure');
        },
      });
  }
}
