import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { adminGuard, authGuard, guestGuard } from './auth.guards';
import { AuthStore } from '@state/auth/auth.store';
import { provideHttpClient } from '@angular/common/http';
import { provideDataAccess } from '@data-access/provide-data-access';

@Component({ standalone: true, template: '' })
class Dummy {}

describe('auth guards', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: Dummy },
          { path: 'login', component: Dummy },
          { path: 'account', component: Dummy },
          { path: 'unauthorized', component: Dummy },
        ]),
        provideHttpClient(),
        provideDataAccess(),
      ],
    });
  });

  it('redirects anonymous users from authGuard', () => {
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as never, { url: '/account' } as never),
    );
    expect(String(result)).toContain('login');
  });

  it('allows guests on guestGuard', () => {
    const result = TestBed.runInInjectionContext(() => guestGuard({} as never, { url: '/auth/login' } as never));
    expect(result).toBe(true);
  });

  it('sends logged-in guests to the storefront home', () => {
    const auth = TestBed.inject(AuthStore);
    auth.setSession(
      {
        token: 't',
        expiresAt: '2099-01-01T00:00:00.000Z',
        user: {
          id: 'u',
          fullName: 'c',
          mobile: '01000000001',
          email: null,
          role: 'customer',
          isPhoneVerified: true,
          createdAt: '',
        },
      },
      false,
    );
    const result = TestBed.runInInjectionContext(() => guestGuard({} as never, { url: '/auth/login' } as never));
    expect(String(result)).toBe('/');
  });

  it('blocks non-admins from adminGuard', () => {
    const auth = TestBed.inject(AuthStore);
    auth.setSession(
      {
        token: 't',
        expiresAt: '2099-01-01T00:00:00.000Z',
        user: {
          id: 'u',
          fullName: 'c',
          mobile: '01000000001',
          email: null,
          role: 'customer',
          isPhoneVerified: true,
          createdAt: '',
        },
      },
      false,
    );
    const result = TestBed.runInInjectionContext(() => adminGuard({} as never, { url: '/admin' } as never));
    expect(String(result)).toContain('unauthorized');
  });
});
