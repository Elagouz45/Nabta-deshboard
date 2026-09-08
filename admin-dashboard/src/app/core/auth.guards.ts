import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from './auth.store';
import { AdminFeature } from '../../environments/environment.model';
import { FeatureAvailability } from './feature-availability';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthStore);
  return auth.isAuthenticated() ? true : inject(Router).createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

export const guestGuard: CanActivateFn = () => inject(AuthStore).isAuthenticated() ? inject(Router).createUrlTree(['/overview']) : true;

export const permissionGuard = (permission: string): CanActivateFn => () => inject(AuthStore).hasPermission(permission) ? true : inject(Router).createUrlTree(['/forbidden']);

export const adminGuard: CanActivateFn = () => inject(AuthStore).user()?.role === 'admin' ? true : inject(Router).createUrlTree(['/forbidden']);

export const featureAvailabilityGuard = (feature: AdminFeature): CanActivateFn => () =>
  inject(FeatureAvailability).isAvailable(feature) ? true : inject(Router).createUrlTree(['/unavailable']);
