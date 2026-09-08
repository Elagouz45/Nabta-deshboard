import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LucideLogOut, LucideMenu } from '@lucide/angular';
import { DashboardStore } from '../dashboard.store';
import { AuthStore } from '../core/auth.store';
import { AdminSidebar } from './admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-admin-shell',
  imports: [RouterOutlet, LucideLogOut, LucideMenu, AdminSidebar],
  providers: [DashboardStore],
  host: { '[class.menu-open]': 'mobileOpen()' },
  template: `
    <a class="skip-link" href="#admin-content">انتقل إلى المحتوى</a>
    <div class="shell">
      <app-admin-sidebar [mobileOpen]="mobileOpen()" (closeRequested)="closeMobileMenu()" />
      @if(mobileOpen()){<button class="scrim" type="button" aria-label="إغلاق القائمة" (click)="closeMobileMenu()"></button>}
      <section class="workspace" [attr.inert]="mobileOpen() ? '' : null">
        <header class="topbar">
          <button #menuTrigger class="icon-button menu" type="button" aria-label="فتح القائمة" aria-controls="admin-sidebar" [attr.aria-expanded]="mobileOpen()" (click)="mobileOpen.set(true)"><svg lucideMenu></svg></button>
          <div class="top-actions">
            <div class="profile" aria-label="الحساب الحالي"><span>{{ initials() }}</span><div><strong>{{ auth.user()?.fullName }}</strong><small>{{ auth.user()?.role === 'admin' ? 'مدير النظام' : 'موظف' }}</small></div></div>
            <button class="logout-button" type="button" aria-label="تسجيل الخروج" title="تسجيل الخروج" (click)="auth.logout()"><svg lucideLogOut></svg></button>
          </div>
        </header>
        <main id="admin-content" tabindex="-1">@if(store.error()){<div class="api-error" role="alert"><span>{{ store.error() }}</span><button type="button" (click)="store.loadOverview()">إعادة المحاولة</button></div>}<router-outlet /></main>
      </section>
    </div>
    @if(store.toast()){<div class="toast" role="status" aria-live="polite"><span aria-hidden="true">✓</span>{{ store.toast() }}</div>}
  `,
  styleUrl: './admin-shell.scss',
})
export class AdminShell {
  readonly store = inject(DashboardStore);
  readonly auth = inject(AuthStore);
  readonly mobileOpen = signal(false);
  private readonly menuTrigger = viewChild<ElementRef<HTMLButtonElement>>('menuTrigger');

  initials(): string { return this.auth.user()?.fullName.split(' ').slice(0, 2).map((part) => part[0]).join('') ?? ''; }

  closeMobileMenu(): void {
    if (!this.mobileOpen()) return;
    this.mobileOpen.set(false);
    queueMicrotask(() => this.menuTrigger()?.nativeElement.focus());
  }
}
