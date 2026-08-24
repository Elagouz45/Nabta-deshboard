import { Component, ElementRef, computed, inject, input, signal } from '@angular/core';
import { NavigationStart, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { AuthStore } from '@state/auth/auth.store';
import { UiStore } from '@state/ui/ui.store';
import { LucideUser } from '@lucide/angular';

@Component({
  selector: 'app-account-menu',
  imports: [RouterLink, RouterLinkActive, LucideUser],
  host: {
    '[attr.data-variant]': 'variant()',
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'onEscape()',
  },
  template: `
    @if (variant() === 'drawer') {
      @if (auth.isLoggedIn()) {
        <p class="who">{{ auth.user()?.fullName }}</p>
        <a routerLink="/account" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeUi()">حسابي</a>
        <a routerLink="/account/orders" routerLinkActive="active" (click)="closeUi()">طلباتي</a>
        <button type="button" class="logout-link" (click)="logout()">تسجيل الخروج</button>
      } @else {
        <a routerLink="/auth/login" (click)="closeUi()">
          <svg lucideUser [size]="18"></svg>
          تسجيل الدخول
        </a>
      }
    } @else if (variant() === 'tab') {
      @if (auth.isLoggedIn()) {
        <a routerLink="/account" routerLinkActive="active" aria-label="حسابي">
          <span class="avatar sm">{{ initial() }}</span>
          حسابي
        </a>
      } @else {
        <a routerLink="/auth/login" aria-label="تسجيل الدخول">
          <svg lucideUser [size]="20"></svg>
          حساب
        </a>
      }
    } @else if (auth.isLoggedIn()) {
      <div class="wrap">
        <button
          type="button"
          class="icon-btn avatar-btn"
          [attr.aria-expanded]="open()"
          aria-haspopup="menu"
          aria-label="حسابي"
          (click)="toggle($event)"
        >
          <span class="avatar">{{ initial() }}</span>
        </button>
        @if (open()) {
          <div class="menu card" role="menu">
            <p class="who">{{ auth.user()?.fullName }}</p>
            <a role="menuitem" routerLink="/account" (click)="open.set(false)">حسابي</a>
            <a role="menuitem" routerLink="/account/orders" (click)="open.set(false)">طلباتي</a>
            <button role="menuitem" type="button" (click)="logout()">تسجيل الخروج</button>
          </div>
        }
      </div>
    } @else {
      <a routerLink="/auth/login" class="icon-btn" aria-label="تسجيل الدخول">
        <svg lucideUser [size]="22"></svg>
      </a>
    }
  `,
  styles: `
    :host { display: inline-flex; align-items: center; }
    :host([data-variant='drawer']) { display: grid; width: 100%; gap: 2px; }
    :host([data-variant='tab']) { flex: 1; display: flex; }
    .wrap { position: relative; }
    .avatar-btn { padding: 0; }
    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: var(--color-mint);
      color: var(--color-forest);
      font-weight: 700;
      font-size: 0.9rem;
    }
    .avatar.sm { width: 22px; height: 22px; font-size: 0.75rem; }
    .menu {
      position: absolute;
      inset-inline-end: 0;
      top: calc(100% + 8px);
      min-width: 200px;
      padding: 8px;
      z-index: 40;
      display: grid;
      gap: 2px;
    }
    .who {
      margin: 0;
      padding: 8px 10px 10px;
      font-weight: 700;
      border-bottom: 1px solid var(--color-border);
    }
    .menu a,
    .menu button,
    .logout-link {
      display: flex;
      align-items: center;
      min-height: 44px;
      padding: 0 10px;
      border: 0;
      border-radius: 10px;
      background: none;
      color: inherit;
      font: inherit;
      text-align: start;
      cursor: pointer;
    }
    .menu a:hover,
    .menu button:hover,
    .logout-link:hover { background: var(--color-mint); color: var(--color-forest); }
    .logout-link { width: 100%; color: var(--color-error); }
    :host([data-variant='drawer']) a,
    :host([data-variant='drawer']) .logout-link {
      min-height: 44px;
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--color-text);
      border-radius: 10px;
      padding-inline: 8px;
    }
    :host([data-variant='drawer']) a.active {
      color: var(--color-brand);
      background: var(--color-mint);
    }
    :host([data-variant='tab']) a {
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      font-size: 0.7rem;
      color: var(--color-text);
      min-height: 56px;
    }
    :host([data-variant='tab']) a.active { color: var(--color-brand); }
  `,
})
export class AccountMenuComponent {
  readonly variant = input<'header' | 'drawer' | 'tab'>('header');
  readonly auth = inject(AuthStore);
  private readonly ui = inject(UiStore);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly router = inject(Router);
  readonly open = signal(false);
  readonly initial = computed(() => {
    const name = this.auth.user()?.fullName?.trim();
    return name ? name[0] : '؟';
  });

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationStart => event instanceof NavigationStart),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.open.set(false));
  }

  toggle(event: Event): void {
    event.stopPropagation();
    this.open.update((value) => !value);
  }

  closeUi(): void {
    this.ui.closeOverlays();
  }

  logout(): void {
    this.open.set(false);
    this.ui.closeOverlays();
    this.auth.logout('/');
  }

  onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }

  onEscape(): void {
    this.open.set(false);
  }
}
