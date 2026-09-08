import { DestroyRef, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthStore } from '../../core/auth.store';
import { FeatureAvailability } from '../../core/feature-availability';
import { ADMIN_NAVIGATION } from './admin-navigation.config';
import { NavigationGroup, NavigationItem } from './navigation-item.model';

export class SidebarNavigationService {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthStore);
  private readonly features = inject(FeatureAvailability);
  private readonly currentUrlState = signal(this.router.url);
  readonly currentUrl = this.currentUrlState.asReadonly();
  readonly authorizedGroups = computed<readonly NavigationGroup[]>(() => ADMIN_NAVIGATION
    .map((group) => ({ ...group, items: group.items.filter((item) => this.canAccess(item)) }))
    .filter((group) => group.items.length > 0 || group.keepWhenEmpty));
  readonly activeGroupId = computed(() => this.authorizedGroups().find((group) => group.items.some((item) => this.isActive(item)))?.id ?? null);

  constructor() {
    const destroyRef = inject(DestroyRef);
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd), takeUntilDestroyed(destroyRef)).subscribe((event) => this.currentUrlState.set(event.urlAfterRedirects));
  }

  isActive(item: NavigationItem): boolean {
    return isNavigationItemActive(item, this.currentUrl());
  }

  private canAccess(item: NavigationItem): boolean {
    const user = this.auth.user();
    if (!user) return false;
    if (item.feature && !this.features.isAvailable(item.feature)) return false;
    if (item.demoOnly && !this.features.demoMode()) return false;
    if (item.adminOnly && user.role !== 'admin') return false;
    return !item.permission || this.auth.hasPermission(item.permission);
  }
}

export function isNavigationItemActive(item: NavigationItem, url: string): boolean {
  const path = url.split(/[?#]/, 1)[0];
  return item.match === 'exact' ? path === item.route : path === item.route || path.startsWith(`${item.route}/`);
}
