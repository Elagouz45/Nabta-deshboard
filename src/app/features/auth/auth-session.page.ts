import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { AccountRepository } from '@data-access/repositories/account.repository';
import { AuthStore } from '@state/auth/auth.store';
import { ApiError } from '@core/models';
import { BRAND } from '@core/tokens/brand.token';
import { SeoService } from '@core/services/seo.service';
import { normalizeEgyptianMobile } from '@core/utils/validation.util';
import {
  egyptianMobileValidator,
  emailValidator,
  matchControlValidator,
  passwordStrengthValidator,
  VALIDATION_MESSAGES,
} from '@shared/validators/namaa.validators';
import { LucideEye, LucideEyeOff, LucidePhone } from '@lucide/angular';
import { BrandLogoComponent } from '@core/layout/brand-logo.component';
import { filter, map, startWith } from 'rxjs';
import { AuthPhoneCache } from './auth-phone.cache';

type AuthTab = 'login' | 'register';

const AUTH_MESSAGES: Record<string, string> = {
  ...VALIDATION_MESSAGES,
  required: 'هذا الحقل مطلوب.',
  egyptianMobile: 'رقم الهاتف غير صحيح.',
  email: 'البريد الإلكتروني غير صحيح.',
  mismatch: 'كلمتا المرور غير متطابقتين.',
};

const LOGIN_REQUIRED: Record<string, string> = {
  mobile: 'يرجى إدخال رقم الهاتف.',
  password: 'يرجى إدخال كلمة المرور.',
};

const REGISTER_REQUIRED: Record<string, string> = {
  fullName: 'يرجى إدخال الاسم الكامل.',
  mobile: 'يرجى إدخال رقم الهاتف.',
  password: 'يرجى إدخال كلمة المرور.',
  confirm: 'يرجى تأكيد كلمة المرور.',
  terms: 'يجب الموافقة على الشروط والأحكام وسياسة الخصوصية.',
};

@Component({
  selector: 'app-auth-session-page',
  imports: [ReactiveFormsModule, RouterLink, LucideEye, LucideEyeOff, LucidePhone, BrandLogoComponent],
  template: `
    <div class="card session-card">
      <div class="brand-lockup">
        <app-brand-logo />
      </div>
      <p class="kicker">{{ isLogin() ? 'حسابك في ' + brand.shortNameAr : 'حساب جديد في ' + brand.shortNameAr }}</p>
      <h1>{{ isLogin() ? 'تسجيل الدخول' : 'إنشاء حساب' }}</h1>
      <p class="muted lead">
        {{
          isLogin()
            ? 'ادخل برقم هاتفك المصري للوصول إلى حسابك بسهولة.'
            : 'سجّل بياناتك وأنشئ حسابك في خطوات بسيطة.'
        }}
      </p>

      <div class="tabs" role="tablist" aria-label="خيارات الحساب">
        <button
          type="button"
          role="tab"
          id="auth-tab-login"
          class="tab"
          [class.active]="isLogin()"
          [attr.aria-selected]="isLogin()"
          [attr.tabindex]="isLogin() ? 0 : -1"
          aria-controls="auth-panel-login"
          (click)="selectTab('login')"
          (keydown)="onTabKey($event, 'login')"
        >
          تسجيل الدخول
        </button>
        <button
          type="button"
          role="tab"
          id="auth-tab-register"
          class="tab"
          [class.active]="!isLogin()"
          [attr.aria-selected]="!isLogin()"
          [attr.tabindex]="isLogin() ? -1 : 0"
          aria-controls="auth-panel-register"
          (click)="selectTab('register')"
          (keydown)="onTabKey($event, 'register')"
        >
          إنشاء حساب
        </button>
      </div>

      @if (error()) {
        <p class="err banner" role="alert">{{ error() }}</p>
      }

      @if (isLogin()) {
        <form
          id="auth-panel-login"
          role="tabpanel"
          aria-labelledby="auth-tab-login"
          [formGroup]="loginForm"
          (ngSubmit)="submitLogin()"
          novalidate
        >
          <div class="field">
            <label for="login-mobile">رقم الهاتف المصري</label>
            <div class="control-wrap">
              <span class="leading-icon" aria-hidden="true">
                <svg lucidePhone [size]="18"></svg>
              </span>
              <input
                id="login-mobile"
                class="input has-icon"
                [class.invalid]="!!loginError('mobile')"
                formControlName="mobile"
                type="tel"
                inputmode="numeric"
                autocomplete="tel"
                dir="ltr"
                placeholder="01xxxxxxxxx"
                [attr.aria-invalid]="!!loginError('mobile')"
                [attr.aria-describedby]="loginError('mobile') ? 'login-mobile-err' : null"
              />
            </div>
            @if (loginError('mobile'); as msg) {
              <p class="err" id="login-mobile-err">{{ msg }}</p>
            }
          </div>
          <div class="field">
            <label for="login-password">كلمة المرور</label>
            <div class="control-wrap">
              <input
                id="login-password"
                class="input has-eye"
                [class.invalid]="!!loginError('password')"
                [type]="showLoginPassword() ? 'text' : 'password'"
                formControlName="password"
                autocomplete="current-password"
                placeholder="أدخل كلمة المرور"
                [attr.aria-invalid]="!!loginError('password')"
                [attr.aria-describedby]="loginError('password') ? 'login-password-err' : null"
              />
              <button
                class="eye"
                type="button"
                (click)="showLoginPassword.set(!showLoginPassword())"
                [attr.aria-pressed]="showLoginPassword()"
                [attr.aria-label]="showLoginPassword() ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'"
              >
                @if (showLoginPassword()) {
                  <svg lucideEyeOff [size]="18"></svg>
                } @else {
                  <svg lucideEye [size]="18"></svg>
                }
              </button>
            </div>
            @if (loginError('password'); as msg) {
              <p class="err" id="login-password-err">{{ msg }}</p>
            }
          </div>
          <div class="row-between">
            <label class="check">
              <input type="checkbox" formControlName="remember" />
              تذكرني
            </label>
            <a class="forgot" routerLink="/auth/forgot-password">نسيت كلمة المرور؟</a>
          </div>
          <button class="btn submit" type="submit" [disabled]="busy()">
            {{ busy() ? 'جارٍ تسجيل الدخول...' : 'دخول' }}
          </button>
        </form>
      } @else {
        <form
          id="auth-panel-register"
          role="tabpanel"
          aria-labelledby="auth-tab-register"
          [formGroup]="registerForm"
          (ngSubmit)="submitRegister()"
          novalidate
        >
          <div class="field">
            <label for="register-name">الاسم الكامل</label>
            <input
              id="register-name"
              class="input"
              [class.invalid]="!!registerError('fullName')"
              formControlName="fullName"
              autocomplete="name"
              placeholder="الاسم كما يظهر في الطلبات"
              [attr.aria-invalid]="!!registerError('fullName')"
              [attr.aria-describedby]="registerError('fullName') ? 'register-name-err' : null"
            />
            @if (registerError('fullName'); as msg) {
              <p class="err" id="register-name-err">{{ msg }}</p>
            }
          </div>
          <div class="field">
            <label for="register-mobile">رقم الهاتف المصري</label>
            <div class="control-wrap">
              <span class="leading-icon" aria-hidden="true">
                <svg lucidePhone [size]="18"></svg>
              </span>
              <input
                id="register-mobile"
                class="input has-icon"
                [class.invalid]="!!registerError('mobile')"
                formControlName="mobile"
                type="tel"
                inputmode="numeric"
                autocomplete="tel"
                dir="ltr"
                placeholder="01xxxxxxxxx"
                [attr.aria-invalid]="!!registerError('mobile')"
                [attr.aria-describedby]="registerError('mobile') ? 'register-mobile-err' : null"
              />
            </div>
            @if (registerError('mobile'); as msg) {
              <p class="err" id="register-mobile-err">{{ msg }}</p>
            }
          </div>
          <div class="field">
            <label for="register-email">البريد الإلكتروني (اختياري)</label>
            <input
              id="register-email"
              class="input"
              [class.invalid]="!!registerError('email')"
              formControlName="email"
              type="email"
              inputmode="email"
              autocomplete="email"
              dir="ltr"
              placeholder="name@example.com"
              [attr.aria-invalid]="!!registerError('email')"
              [attr.aria-describedby]="registerError('email') ? 'register-email-err' : null"
            />
            @if (registerError('email'); as msg) {
              <p class="err" id="register-email-err">{{ msg }}</p>
            }
          </div>
          <div class="field">
            <label for="register-password">كلمة المرور</label>
            <div class="control-wrap">
              <input
                id="register-password"
                class="input has-eye"
                [class.invalid]="!!registerError('password')"
                [type]="showRegisterPassword() ? 'text' : 'password'"
                formControlName="password"
                autocomplete="new-password"
                placeholder="8 أحرف وتتضمن حرفًا كبيرًا وصغيرًا ورقمًا"
                [attr.aria-invalid]="!!registerError('password')"
                [attr.aria-describedby]="registerError('password') ? 'register-password-err' : null"
              />
              <button
                class="eye"
                type="button"
                (click)="showRegisterPassword.set(!showRegisterPassword())"
                [attr.aria-pressed]="showRegisterPassword()"
                [attr.aria-label]="showRegisterPassword() ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'"
              >
                @if (showRegisterPassword()) {
                  <svg lucideEyeOff [size]="18"></svg>
                } @else {
                  <svg lucideEye [size]="18"></svg>
                }
              </button>
            </div>
            @if (registerError('password'); as msg) {
              <p class="err" id="register-password-err">{{ msg }}</p>
            }
          </div>
          <div class="field">
            <label for="register-confirm">تأكيد كلمة المرور</label>
            <div class="control-wrap">
              <input
                id="register-confirm"
                class="input has-eye"
                [class.invalid]="!!registerError('confirm')"
                [type]="showRegisterConfirm() ? 'text' : 'password'"
                formControlName="confirm"
                autocomplete="new-password"
                placeholder="أعد كتابة كلمة المرور"
                [attr.aria-invalid]="!!registerError('confirm')"
                [attr.aria-describedby]="registerError('confirm') ? 'register-confirm-err' : null"
              />
              <button
                class="eye"
                type="button"
                (click)="showRegisterConfirm.set(!showRegisterConfirm())"
                [attr.aria-pressed]="showRegisterConfirm()"
                [attr.aria-label]="showRegisterConfirm() ? 'إخفاء تأكيد كلمة المرور' : 'إظهار تأكيد كلمة المرور'"
              >
                @if (showRegisterConfirm()) {
                  <svg lucideEyeOff [size]="18"></svg>
                } @else {
                  <svg lucideEye [size]="18"></svg>
                }
              </button>
            </div>
            @if (registerError('confirm'); as msg) {
              <p class="err" id="register-confirm-err">{{ msg }}</p>
            }
          </div>
          <label class="check terms">
            <input type="checkbox" formControlName="terms" />
            <span>
              أوافق على
              <a routerLink="/policies/terms">الشروط والأحكام</a>
              و
              <a routerLink="/policies/privacy">سياسة الخصوصية</a>
            </span>
          </label>
          @if (registerError('terms'); as msg) {
            <p class="err">{{ msg }}</p>
          }
          <button class="btn submit" type="submit" [disabled]="busy()">
            {{ busy() ? 'جارٍ إنشاء الحساب...' : 'إنشاء حساب' }}
          </button>
        </form>
      }
    </div>
  `,
  styles: `
    :host { display: block; width: 100%; }
    .session-card {
      width: 100%;
      max-width: 440px;
      margin-inline: auto;
      padding: 28px 24px 24px;
      border-radius: 20px;
      border-color: rgb(31 106 67 / 0.16);
      box-shadow: 0 16px 40px rgb(18 58 40 / 8%);
    }
    .brand-lockup {
      display: flex;
      justify-content: center;
      margin-bottom: 16px;
    }
    .brand-lockup img { display: block; }
    .kicker {
      margin: 0 0 8px;
      color: var(--color-brand);
      font-weight: 700;
      font-size: 0.82rem;
      text-align: center;
    }
    h1 {
      margin: 0 0 8px;
      color: var(--color-forest);
      text-align: center;
    }
    .lead {
      margin: 0 0 18px;
      text-align: center;
    }
    .tabs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
      margin: 0 0 18px;
      padding: 4px;
      border: 1px solid var(--color-brand);
      border-radius: 14px;
      background: var(--color-mint);
    }
    .tab {
      min-height: 44px;
      border: 0;
      border-radius: 10px;
      background: transparent;
      color: var(--color-forest);
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }
    .tab:hover:not(.active) {
      background: rgb(255 255 255 / 0.7);
    }
    .tab:focus-visible {
      outline: none;
      box-shadow: var(--focus);
    }
    .tab.active {
      background: var(--color-forest);
      color: var(--color-white);
    }
    form { display: grid; gap: 14px; }
    .field { display: grid; gap: 6px; }
    .field label { font-weight: 600; color: var(--color-forest); }
    .input.invalid { border-color: var(--color-error); }
    .control-wrap { position: relative; }
    .leading-icon {
      position: absolute;
      inset-inline-start: 12px;
      top: 50%;
      transform: translateY(-50%);
      display: inline-flex;
      color: var(--color-brand);
      pointer-events: none;
    }
    .input.has-icon { padding-inline-start: 42px; }
    .input.has-eye { padding-inline-end: 44px; }
    .control-wrap input::-ms-reveal,
    .control-wrap input::-ms-clear { display: none; }
    .eye {
      position: absolute;
      inset-inline-end: 6px;
      top: 50%;
      transform: translateY(-50%);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      padding: 0;
      border: 0;
      border-radius: 10px;
      background: transparent;
      color: var(--color-muted);
      cursor: pointer;
    }
    .eye:hover { color: var(--color-forest); background: var(--color-mint); }
    .row-between {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }
    .check {
      display: inline-flex;
      align-items: flex-start;
      gap: 8px;
      margin: 0;
      cursor: pointer;
      color: var(--color-muted);
      font-weight: 500;
    }
    .check.terms { align-items: flex-start; }
    .check input {
      width: 18px;
      height: 18px;
      margin: 4px 0 0;
      accent-color: var(--color-brand);
      flex: 0 0 auto;
    }
    .forgot { font-weight: 700; }
    .submit { width: 100%; min-height: 48px; font-weight: 700; }
    .err { margin: 0; color: var(--color-error); font-size: 0.85rem; }
    .banner {
      padding: 10px 12px;
      margin-bottom: 4px;
      border-radius: 12px;
      background: rgb(185 28 28 / 0.08);
    }
    @media (max-width: 640px) {
      .session-card { padding: 22px 16px 18px; max-width: 100%; }
    }
  `,
})
export class AuthSessionPage {
  private readonly fb = inject(FormBuilder);
  private readonly accounts = inject(AccountRepository);
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly phoneCache = inject(AuthPhoneCache);
  readonly brand = inject(BRAND);

  readonly showLoginPassword = signal(false);
  readonly showRegisterPassword = signal(false);
  readonly showRegisterConfirm = signal(false);
  readonly busy = signal(false);
  readonly error = signal('');
  private readonly fieldServerErrors = signal<Record<string, string>>({});

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly tab = computed<AuthTab>(() => (this.url().includes('/auth/register') ? 'register' : 'login'));
  readonly isLogin = computed(() => this.tab() === 'login');

  readonly loginForm = this.fb.nonNullable.group({
    mobile: [this.phoneCache.mobile(), [Validators.required, egyptianMobileValidator()]],
    password: ['', Validators.required],
    remember: [true],
  });

  readonly registerForm = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    mobile: [this.phoneCache.mobile(), [Validators.required, egyptianMobileValidator()]],
    email: ['', [emailValidator()]],
    password: ['', [Validators.required, passwordStrengthValidator()]],
    confirm: ['', [Validators.required, matchControlValidator('password')]],
    terms: [false, Validators.requiredTrue],
  });

  constructor() {
    this.syncSeo(this.tab());
    this.loginForm.controls.mobile.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => this.cacheMobile(value));
    this.registerForm.controls.mobile.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => this.cacheMobile(value));
    this.registerForm.controls.password.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.registerForm.controls.confirm.updateValueAndValidity({ emitEvent: false });
    });
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.error.set('');
        this.fieldServerErrors.set({});
        this.syncSeo(this.tab());
        this.hydrateMobile();
      });
  }

  selectTab(tab: AuthTab): void {
    if (tab === this.tab()) {
      return;
    }
    this.cacheMobile(this.isLogin() ? this.loginForm.controls.mobile.value : this.registerForm.controls.mobile.value);
    void this.router.navigate(['/auth', tab], { queryParamsHandling: 'preserve' });
  }

  onTabKey(event: KeyboardEvent, current: AuthTab): void {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Home' && event.key !== 'End') {
      return;
    }
    event.preventDefault();
    const next: AuthTab =
      event.key === 'Home' ? 'login' : event.key === 'End' ? 'register' : current === 'login' ? 'register' : 'login';
    this.selectTab(next);
  }

  loginError(name: 'mobile' | 'password'): string {
    return this.controlError(this.loginForm.get(name), name, LOGIN_REQUIRED);
  }

  registerError(name: 'fullName' | 'mobile' | 'email' | 'password' | 'confirm' | 'terms'): string {
    return this.controlError(this.registerForm.get(name), name, REGISTER_REQUIRED);
  }

  submitLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.error.set('');
    this.fieldServerErrors.set({});
    this.busy.set(true);
    const value = this.loginForm.getRawValue();
    const mobile = normalizeEgyptianMobile(value.mobile);
    this.accounts.login(mobile, value.password).subscribe({
      next: (session) => {
        this.auth.setSession(session, value.remember);
        const ret =
          this.route.snapshot.queryParamMap.get('returnUrl') || (session.user.role === 'admin' ? '/admin' : '/');
        void this.router.navigateByUrl(ret);
      },
      error: (err: ApiError) => {
        this.busy.set(false);
        this.applyServerError(err, 'رقم الهاتف أو كلمة المرور غير صحيحة.');
      },
    });
  }

  submitRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.error.set('');
    this.fieldServerErrors.set({});
    this.busy.set(true);
    const value = this.registerForm.getRawValue();
    const email = value.email.trim();
    this.accounts
      .register({
        fullName: value.fullName.trim(),
        mobile: normalizeEgyptianMobile(value.mobile),
        email: email || undefined,
        password: value.password,
      })
      .subscribe({
        next: (session) => {
          this.auth.setSession(session, true);
          const ret =
            this.route.snapshot.queryParamMap.get('returnUrl') || (session.user.role === 'admin' ? '/admin' : '/');
          void this.router.navigateByUrl(ret);
        },
        error: (err: ApiError) => {
          this.busy.set(false);
          this.applyServerError(err, 'تعذر إنشاء الحساب. حاول مرة أخرى.');
        },
      });
  }

  private controlError(
    control: { errors: Record<string, unknown> | null; touched: boolean; dirty: boolean } | null,
    name: string,
    requiredMap: Record<string, string>,
  ): string {
    const server = this.fieldServerErrors()[name];
    if (server) {
      return server;
    }
    if (!control?.errors || !(control.touched || control.dirty)) {
      return '';
    }
    const key = Object.keys(control.errors)[0];
    if (key === 'required' || key === 'requiredTrue') {
      return requiredMap[name] ?? AUTH_MESSAGES['required'];
    }
    return AUTH_MESSAGES[key] ?? VALIDATION_MESSAGES[key] ?? '';
  }

  private applyServerError(err: ApiError, fallback: string): void {
    this.error.set(err.messageAr ?? fallback);
    if (err.fieldErrors) {
      this.fieldServerErrors.set(err.fieldErrors);
      const mobile = err.fieldErrors['mobile'];
      if (mobile) {
        this.registerForm.controls.mobile.markAsTouched();
        this.loginForm.controls.mobile.markAsTouched();
      }
    }
  }

  private cacheMobile(value: string): void {
    this.phoneCache.mobile.set(value);
  }

  private hydrateMobile(): void {
    const mobile = this.phoneCache.mobile();
    if (!mobile) {
      return;
    }
    this.loginForm.controls.mobile.setValue(mobile, { emitEvent: false });
    this.registerForm.controls.mobile.setValue(mobile, { emitEvent: false });
  }

  private syncSeo(tab: AuthTab): void {
    if (tab === 'login') {
      this.seo.set({
        title: 'تسجيل الدخول',
        description: 'دخول عملاء نبته',
        path: '/auth/login',
        noindex: true,
      });
      return;
    }
    this.seo.set({
      title: 'إنشاء حساب',
      description: 'تسجيل عميل جديد في نبته',
      path: '/auth/register',
      noindex: true,
    });
  }
}

export { AuthSessionPage as LoginPage, AuthSessionPage as RegisterPage };
