import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { AccountRepository } from '@data-access/repositories/account.repository';
import { provideDataAccess } from '@data-access/provide-data-access';
import { AuthSession } from '@core/models';
import { AuthStore } from '@state/auth/auth.store';
import { AuthSessionPage } from './auth-session.page';

@Component({ standalone: true, template: '' })
class DummyPage {}

const session: AuthSession = {
  token: 'token',
  expiresAt: '2099-01-01T00:00:00.000Z',
  user: {
    id: 'u1',
    fullName: 'أحمد فوزي',
    mobile: '01000000001',
    email: null,
    role: 'customer',
    isPhoneVerified: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
};

describe('AuthSessionPage', () => {
  let loginCalls: [string, string][] = [];
  let registerCalls: Record<string, unknown>[] = [];

  beforeEach(async () => {
    loginCalls = [];
    registerCalls = [];
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [AuthSessionPage],
      providers: [
        provideRouter([
          { path: '', component: DummyPage },
          { path: 'cart', component: DummyPage },
          { path: 'auth/login', component: AuthSessionPage },
          { path: 'auth/register', component: AuthSessionPage },
          { path: 'auth/forgot-password', component: DummyPage },
          { path: 'policies/terms', component: DummyPage },
          { path: 'policies/privacy', component: DummyPage },
          { path: 'account', component: DummyPage },
        ]),
        provideHttpClient(),
        provideDataAccess(),
        {
          provide: AccountRepository,
          useValue: {
            login: (mobile: string, password: string) => {
              loginCalls.push([mobile, password]);
              return of(session);
            },
            register: (input: Record<string, unknown>) => {
              registerCalls.push(input);
              return of(session);
            },
          },
        },
      ],
    });
    await TestBed.inject(Router).navigateByUrl('/auth/login');
  });

  it('shows the login panel and hides register fields', async () => {
    const fixture = TestBed.createComponent(AuthSessionPage);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('h1')?.textContent).toContain('تسجيل الدخول');
    expect(root.querySelector('#auth-panel-login')).toBeTruthy();
    expect(root.querySelector('#auth-panel-register')).toBeNull();
    expect(root.querySelector('a.forgot')?.getAttribute('href')).toBe('/auth/forgot-password');
  });

  it('switches to the register panel from the tab', async () => {
    const fixture = TestBed.createComponent(AuthSessionPage);
    fixture.detectChanges();
    const tabs = (fixture.nativeElement as HTMLElement).querySelectorAll('[role="tab"]');
    (tabs[1] as HTMLButtonElement).click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(TestBed.inject(Router).url).toContain('/auth/register');
    const next = TestBed.createComponent(AuthSessionPage);
    next.detectChanges();
    expect((next.nativeElement as HTMLElement).querySelector('h1')?.textContent).toContain('إنشاء حساب');
    expect((next.nativeElement as HTMLElement).querySelector('#auth-panel-register')).toBeTruthy();
  });

  it('shows login validation messages and keeps submit disabled while busy', () => {
    const fixture = TestBed.createComponent(AuthSessionPage);
    const page = fixture.componentInstance;
    fixture.detectChanges();
    page.submitLogin();
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('يرجى إدخال رقم الهاتف.');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('يرجى إدخال كلمة المرور.');
    page.busy.set(true);
    fixture.detectChanges();
    const submit = (fixture.nativeElement as HTMLElement).querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(submit.disabled).toBe(true);
    expect(submit.textContent).toContain('جارٍ تسجيل الدخول...');
  });

  it('submits login with the repository payload and stores the session', () => {
    const fixture = TestBed.createComponent(AuthSessionPage);
    const page = fixture.componentInstance;
    page.loginForm.setValue({ mobile: '01000000001', password: 'Namaa@123', remember: true });
    page.submitLogin();
    expect(loginCalls).toEqual([['01000000001', 'Namaa@123']]);
    expect(TestBed.inject(AuthStore).isLoggedIn()).toBe(true);
  });

  it('sends customers home after login unless a returnUrl is present', async () => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(AuthSessionPage);
    const page = fixture.componentInstance;
    page.loginForm.setValue({ mobile: '01000000001', password: 'Namaa@123', remember: true });
    page.submitLogin();
    await fixture.whenStable();
    expect(router.url).toBe('/');

    await router.navigateByUrl('/auth/login?returnUrl=/cart');
    const next = TestBed.createComponent(AuthSessionPage);
    next.componentInstance.loginForm.setValue({ mobile: '01000000001', password: 'Namaa@123', remember: true });
    next.componentInstance.submitLogin();
    await next.whenStable();
    expect(router.url).toBe('/cart');
  });

  it('blocks register when the password is weak or confirmation does not match', async () => {
    await TestBed.inject(Router).navigateByUrl('/auth/register');
    const fixture = TestBed.createComponent(AuthSessionPage);
    const page = fixture.componentInstance;
    page.registerForm.setValue({
      fullName: 'مزارع تجريبي',
      mobile: '01512345678',
      email: '',
      password: '123456',
      confirm: '123456',
      terms: true,
    });
    page.submitRegister();
    expect(registerCalls).toEqual([]);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'كلمة المرور 8 أحرف على الأقل وتتضمن حرفًا كبيرًا وصغيرًا ورقمًا.',
    );

    page.registerForm.controls.password.setValue('Namaa@123');
    page.registerForm.controls.confirm.setValue('Different@1');
    page.submitRegister();
    expect(registerCalls).toEqual([]);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('كلمتا المرور غير متطابقتين.');
  });

  it('submits register with the repository payload', async () => {
    await TestBed.inject(Router).navigateByUrl('/auth/register');
    const fixture = TestBed.createComponent(AuthSessionPage);
    const page = fixture.componentInstance;
    page.registerForm.setValue({
      fullName: '  مزارع تجريبي  ',
      mobile: '01512345678',
      email: 'farmer@example.com',
      password: 'Namaa@123',
      confirm: 'Namaa@123',
      terms: true,
    });
    page.submitRegister();
    expect(registerCalls).toEqual([
      {
        fullName: 'مزارع تجريبي',
        mobile: '01512345678',
        email: 'farmer@example.com',
        password: 'Namaa@123',
      },
    ]);
  });
});
