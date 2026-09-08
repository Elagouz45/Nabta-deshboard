import { Routes } from '@angular/router';
import { adminGuard, featureAvailabilityGuard } from '../../core/auth.guards';

export const CUSTOMERS_ROUTES: Routes = [
  {
    path: '', pathMatch: 'full', canActivate: [featureAvailabilityGuard('customers'), adminGuard],
    title: 'العملاء | نبته',
    loadComponent: () => import('./pages/customers-list-page/customers-list-page').then((m) => m.CustomersListPage),
  },
];
