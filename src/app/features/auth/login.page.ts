import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AccountRepository } from '@data-access/repositories/account.repository';
import { AuthStore } from '@state/auth/auth.store';
import { egyptianMobileValidator, passwordStrengthValidator } from '@shared/validators/namaa.validators';
import { SeoService } from '@core/services/seo.service';

export { LoginPage } from './auth-session.page';
export { VALIDATION_MESSAGES } from '@shared/validators/namaa.validators';

@Component({
  selector: 'app-forgot-password-page',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="card auth-card">
      <h1>استعادة كلمة المرور</h1>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>الهاتف <input class="input" formControlName="mobile" /></label>
        <button class="btn" type="submit" [disabled]="form.invalid || busy()">إرسال الرمز</button>
      </form>
      @if (done()) {
        <p>تم. الرمز التجريبي 123456. <a routerLink="/auth/reset-password">تعيين كلمة مرور جديدة</a></p>
      }
    </div>
  `,
})
export class ForgotPasswordPage {
  private readonly fb = inject(FormBuilder);
  private readonly accounts = inject(AccountRepository);
  private readonly seo = inject(SeoService);
  busy = signal(false);
  done = signal(false);
  readonly form = this.fb.nonNullable.group({ mobile: ['', [Validators.required, egyptianMobileValidator()]] });
  constructor() {
    this.seo.set({ title: 'استعادة كلمة المرور', description: 'إعادة التعيين', path: '/auth/forgot-password', noindex: true });
  }
  submit(): void {
    this.busy.set(true);
    this.accounts.forgotPassword(this.form.controls.mobile.value).subscribe({
      next: () => this.done.set(true),
      error: () => this.busy.set(false),
    });
  }
}

@Component({
  selector: 'app-reset-password-page',
  imports: [ReactiveFormsModule],
  template: `
    <div class="card auth-card">
      <h1>كلمة مرور جديدة</h1>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>الهاتف <input class="input" formControlName="mobile" /></label>
        <label>رمز التحقق <input class="input" formControlName="code" /></label>
        <label>كلمة المرور الجديدة <input class="input" type="password" formControlName="password" /></label>
        <button class="btn" type="submit" [disabled]="form.invalid">حفظ</button>
      </form>
      @if (ok()) {
        <p>تم التحديث. يمكنك تسجيل الدخول.</p>
      }
    </div>
  `,
})
export class ResetPasswordPage {
  private readonly fb = inject(FormBuilder);
  private readonly accounts = inject(AccountRepository);
  ok = signal(false);
  readonly form = this.fb.nonNullable.group({
    mobile: ['', [Validators.required, egyptianMobileValidator()]],
    code: ['', Validators.required],
    password: ['', [Validators.required, passwordStrengthValidator()]],
  });
  submit(): void {
    const v = this.form.getRawValue();
    this.accounts.resetPassword(v.mobile, v.code, v.password).subscribe({ next: () => this.ok.set(true) });
  }
}

@Component({
  selector: 'app-verify-phone-page',
  imports: [ReactiveFormsModule],
  template: `
    <div class="card auth-card">
      <h1>تأكيد الهاتف</h1>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>الهاتف <input class="input" formControlName="mobile" /></label>
        <label>الرمز التجريبي 123456 <input class="input" formControlName="code" /></label>
        <button class="btn" type="submit">تأكيد</button>
      </form>
    </div>
  `,
})
export class VerifyPhonePage {
  private readonly fb = inject(FormBuilder);
  private readonly accounts = inject(AccountRepository);
  private readonly auth = inject(AuthStore);
  readonly form = this.fb.nonNullable.group({
    mobile: [this.auth.user()?.mobile ?? '', Validators.required],
    code: ['', Validators.required],
  });
  submit(): void {
    const v = this.form.getRawValue();
    this.accounts.verifyPhone(v.mobile, v.code).subscribe((s) => this.auth.setSession(s, true));
  }
}
