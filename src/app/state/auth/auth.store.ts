import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { STORAGE_KEYS } from '@core/constants/storage-keys';
import { AuthSession, User } from '@core/models';
import { StorageService } from '@core/services/storage.service';
import { CartStore } from '@state/cart/cart.store';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);
  private readonly cart = inject(CartStore);

  private readonly sessionSignal = signal<AuthSession | null>(this.readSession());

  readonly session = this.sessionSignal.asReadonly();
  readonly user = computed(() => this.sessionSignal()?.user ?? null);
  readonly isLoggedIn = computed(() => !!this.sessionSignal());
  readonly isAdmin = computed(() => this.sessionSignal()?.user.role === 'admin');

  setSession(session: AuthSession, remember = true): void {
    this.sessionSignal.set(session);
    if (remember) {
      this.storage.set(STORAGE_KEYS.authSession, session);
    } else {
      this.storage.remove(STORAGE_KEYS.authSession);
    }
    this.cart.mergeGuestIntoUser(session.user.id);
  }

  updateUser(user: User): void {
    const current = this.sessionSignal();
    if (!current) {
      return;
    }
    const next = { ...current, user };
    this.sessionSignal.set(next);
    this.storage.set(STORAGE_KEYS.authSession, next);
  }

  logout(redirect = '/'): void {
    this.sessionSignal.set(null);
    this.storage.remove(STORAGE_KEYS.authSession);
    this.cart.detachUser();
    void this.router.navigateByUrl(redirect);
  }

  private readSession(): AuthSession | null {
    const session = this.storage.get<AuthSession>(STORAGE_KEYS.authSession);
    if (!session) {
      return null;
    }
    if (Date.parse(session.expiresAt) < Date.now()) {
      this.storage.remove(STORAGE_KEYS.authSession);
      return null;
    }
    return session;
  }
}
