import { Routes } from '@angular/router';
import { adminGuard, featureAvailabilityGuard } from '../../core/auth.guards';

export const PAYMENTS_ROUTES: Routes = [{
  path: '',
  canActivate: [featureAvailabilityGuard('payments'), adminGuard],
  title: 'المدفوعات | نبته',
  loadComponent: () =>
    import('./pages/payments-list-page/payments-list-page').then((module) => module.PaymentsListPage),
}];
