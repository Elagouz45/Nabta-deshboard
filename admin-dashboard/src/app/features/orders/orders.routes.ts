import { Routes } from '@angular/router';
import { featureAvailabilityGuard, permissionGuard } from '../../core/auth.guards';

export const ORDERS_ROUTES: Routes = [
  { path: '', canActivate: [featureAvailabilityGuard('orders'), permissionGuard('orders.view')], title: 'الطلبات | نبته', loadComponent: () => import('../../pages/orders.page').then((m) => m.OrdersPage) },
  { path: ':id', canActivate: [featureAvailabilityGuard('orders'), permissionGuard('orders.view')], title: 'تفاصيل الطلب | نبته', loadComponent: () => import('../../pages/order-details.page').then((m) => m.OrderDetailsPage) },
];
