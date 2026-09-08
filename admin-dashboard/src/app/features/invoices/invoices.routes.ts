import { Routes } from '@angular/router';
import { adminGuard, featureAvailabilityGuard } from '../../core/auth.guards';

export const INVOICES_ROUTES: Routes = [
  { path: '', canActivate: [featureAvailabilityGuard('invoices'), adminGuard], title: 'الفواتير | نبته', loadComponent: () => import('./pages/invoices-list-page/invoices-list-page').then((m) => m.InvoicesListPage) },
  { path: ':invoice-id/print', canActivate: [featureAvailabilityGuard('invoices'), adminGuard], title: 'طباعة الفاتورة | نبته', loadComponent: () => import('./pages/invoice-print-page/invoice-print-page').then((m) => m.InvoicePrintPage) },
  { path: ':invoice-id', canActivate: [featureAvailabilityGuard('invoices'), adminGuard], title: 'تفاصيل الفاتورة | نبته', loadComponent: () => import('./pages/invoice-details-page/invoice-details-page').then((m) => m.InvoiceDetailsPage) },
];
