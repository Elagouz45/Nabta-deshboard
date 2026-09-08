import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { LucideEye, LucideEyeOff, LucideLockKeyhole, LucidePhone } from '@lucide/angular';
import { AuthStore } from '../core/auth.store';
import { normalizeApiError } from '../core/api-error-normalizer';

@Component({
  imports: [ReactiveFormsModule, LucideEye, LucideEyeOff, LucideLockKeyhole, LucidePhone],
  template: `
    <main class="login-page"><section class="login-card" aria-labelledby="login-title">
      <div class="brand"><span aria-hidden="true">ن</span><div><strong>نبته</strong><small>لوحة الإدارة</small></div></div>
      <header><p>مرحبًا بعودتك</p><h1 id="login-title">تسجيل دخول الإدارة</h1><span>أدخل بيانات حساب العمل للوصول إلى لوحة التحكم.</span></header>
      @if(error()){<div class="error" role="alert" tabindex="-1" #errorMessage>{{ error() }}</div>}
      <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <label>رقم الهاتف<div class="field"><svg lucidePhone aria-hidden="true"></svg><input formControlName="mobile" inputmode="tel" autocomplete="username" placeholder="01xxxxxxxxx" dir="ltr"></div>@if(form.controls.mobile.touched && form.controls.mobile.invalid){<small>أدخل رقم هاتف صحيحًا.</small>}</label>
        <label>كلمة المرور<div class="field"><svg lucideLockKeyhole aria-hidden="true"></svg><input formControlName="password" [type]="passwordVisible() ? 'text' : 'password'" autocomplete="current-password" placeholder="كلمة المرور"><button class="password-toggle" type="button" [attr.aria-label]="passwordVisible() ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'" [attr.aria-pressed]="passwordVisible()" (click)="passwordVisible.update((visible) => !visible)">@if(passwordVisible()){<svg lucideEyeOff></svg>}@else{<svg lucideEye></svg>}</button></div>@if(form.controls.password.touched && form.controls.password.invalid){<small>كلمة المرور مطلوبة.</small>}</label>
        <button class="btn" type="submit" [disabled]="form.invalid || submitting()">{{ submitting() ? 'جارٍ التحقق...' : 'تسجيل الدخول' }}</button>
      </form><footer>الحسابات الإدارية تُنشأ داخليًا فقط.</footer>
    </section></main>`,
  styles: [`
    .login-page{min-height:100dvh;display:grid;place-items:center;padding:1rem;background:var(--bg)}.login-card{width:min(28rem,100%);padding:2rem;border:1px solid var(--border);border-radius:1rem;background:var(--surface);box-shadow:var(--shadow)}
    .brand{display:flex;align-items:center;gap:.65rem;margin-bottom:2rem}.brand>span{display:grid;place-items:center;width:2.8rem;height:2.8rem;border-radius:.8rem;background:var(--forest);color:#fff;font:800 1.4rem var(--font-display)}.brand div{display:grid}.brand strong{font:700 1.05rem var(--font-display);color:var(--forest)}.brand small{color:var(--muted);font-size:.75rem}
    header p{margin:0;color:var(--brand);font-size:.82rem;font-weight:700}h1{margin:.25rem 0;color:var(--forest);font:700 1.55rem var(--font-display)}header>span{color:var(--muted);font-size:.86rem}.error{margin-top:1rem;padding:.75rem;border:1px solid #e4c3bb;border-radius:.6rem;background:#fff5f2;color:#8c4e40;font-size:.8rem}
    form{display:grid;gap:1rem;margin-top:1.5rem}label{display:grid;gap:.35rem;font-size:.82rem;font-weight:600}.field{position:relative;display:flex;align-items:center}.field>svg{position:absolute;inset-inline-start:.75rem;width:1rem;color:var(--muted)}input{padding-inline:2.25rem 2.75rem}label small{color:var(--danger)}
    .password-toggle{position:absolute;inset-inline-end:.35rem;display:grid;place-items:center;width:2.25rem;height:2.25rem;border:0;border-radius:.45rem;background:transparent;color:var(--muted);cursor:pointer}.password-toggle:hover{background:var(--pale);color:var(--forest)}.password-toggle svg{width:1rem}.btn{width:100%;margin-top:.25rem}.btn:disabled{opacity:.55;cursor:not-allowed}footer{margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--border);color:var(--muted);font-size:.74rem;text-align:center}
  `],
})
export class LoginPage {
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly errorMessage = viewChild<ElementRef<HTMLElement>>('errorMessage');
  readonly submitting = signal(false);
  readonly passwordVisible = signal(false);
  readonly error = signal('');
  readonly form = new FormGroup({
    mobile: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^01[0125]\d{8}$/)] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  submit(): void {
    if (this.form.invalid || this.submitting()) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true); this.error.set('');
    const { mobile, password } = this.form.getRawValue();
    this.auth.login(mobile, password).pipe(finalize(() => this.submitting.set(false))).subscribe({
      next: () => void this.router.navigateByUrl(this.safeReturnUrl()),
      error: (error: unknown) => { this.error.set(this.messageFor(error)); queueMicrotask(() => this.errorMessage()?.nativeElement.focus()); },
    });
  }

  private safeReturnUrl(): string {
    const value = this.route.snapshot.queryParamMap.get('returnUrl');
    return value?.startsWith('/') && !value.startsWith('//') ? value : '/overview';
  }

  private messageFor(error: unknown): string {
    if (error instanceof Error && error.message === 'FORBIDDEN') return 'هذا الحساب لا يملك صلاحية دخول لوحة الإدارة.';
    const normalized = normalizeApiError(error);
    return normalized.status === 401 ? 'رقم الهاتف أو كلمة المرور غير صحيحة.' : normalized.message;
  }
}
