import { computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AdminUser, AuthSession } from '../models';

const SESSION_KEY = 'nabtah.admin.session';

export class AuthStore {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly sessionState = signal<AuthSession | null>(this.readSession());
  readonly session = this.sessionState.asReadonly();
  readonly user = computed(() => this.sessionState()?.user ?? null);
  readonly isAuthenticated = computed(() => this.sessionState() !== null);

  login(mobile: string, password: string) {
    if (environment.demoAdmin && mobile === environment.demoAdmin.mobile && password === environment.demoAdmin.password) {
      return this.createDemoSession();
    }
    return this.http.post<AuthSession>(`${environment.apiBaseUrl}/auth/login`, { mobile, password }).pipe(
      tap((session) => {
        if (session.user.role !== 'admin' && session.user.role !== 'staff') throw new Error('FORBIDDEN');
        this.sessionState.set(session);
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      }),
    );
  }

  private createDemoSession(): Observable<AuthSession> {
    const session: AuthSession = {
      token: 'development-demo-session',
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      user: {
        id: 'demo-admin',
        fullName: 'مدير نبته التجريبي',
        mobile: '01090523549',
        email: null,
        role: 'admin',
        permissions: ['orders.view', 'products.view'],
      },
    };
    this.sessionState.set(session);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return of(session);
  }

  refreshProfile() {
    return this.http.get<AdminUser>(`${environment.apiBaseUrl}/me`).pipe(tap((user) => {
      const current = this.sessionState();
      if (!current) return;
      const session = { ...current, user };
      this.sessionState.set(session);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }));
  }

  hasPermission(permission: string): boolean {
    const user = this.user();
    return user?.role === 'admin' || user?.permissions?.includes(permission) === true;
  }

  logout(returnUrl = '/login'): void {
    this.clearSession();
    void this.router.navigate(['/login'], { queryParams: returnUrl === '/login' ? undefined : { returnUrl } });
  }

  clearSession(): void {
    this.sessionState.set(null);
    sessionStorage.removeItem(SESSION_KEY);
  }

  private readSession(): AuthSession | null {
    if (typeof sessionStorage === 'undefined') return null;
    try {
      const value = sessionStorage.getItem(SESSION_KEY);
      if (!value) return null;
      const session = JSON.parse(value) as AuthSession;
      if (Date.parse(session.expiresAt) <= Date.now()) {
        sessionStorage.removeItem(SESSION_KEY);
        return null;
      }
      return session;
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
  }
}
