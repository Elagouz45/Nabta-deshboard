import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth.guards';

export const routes: Routes = [
  { path: 'login', canActivate: [guestGuard], title: 'تسجيل دخول الإدارة | نبته', loadComponent: () => import('./pages/login.page').then((m) => m.LoginPage) },
  { path: 'forbidden', title: 'غير مصرح | نبته', loadComponent: () => import('./pages/forbidden.page').then((m) => m.ForbiddenPage) },
  { path: 'unavailable', title: 'الميزة غير متاحة | نبته', loadComponent: () => import('./pages/unavailable.page').then((m) => m.UnavailablePage) },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/admin-shell').then((m) => m.AdminShell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      { path: 'overview', loadChildren: () => import('./features/overview/overview.routes').then((m) => m.OVERVIEW_ROUTES) },
      { path: 'orders', loadChildren: () => import('./features/orders/orders.routes').then((m) => m.ORDERS_ROUTES) },
      { path: 'invoices', loadChildren: () => import('./features/invoices/invoices.routes').then((m) => m.INVOICES_ROUTES) },
      { path: 'payments', loadChildren: () => import('./features/payments/payments.routes').then((m) => m.PAYMENTS_ROUTES) },
      { path: 'shipping', loadChildren: () => import('./features/shipping/shipping.routes').then((m) => m.SHIPPING_ROUTES) },
      { path: 'returns', loadChildren: () => import('./features/returns/returns.routes').then((m) => m.RETURNS_ROUTES) },
      { path: 'pending/invoices', loadChildren: () => import('./features/invoices/invoices.routes').then((m) => m.INVOICES_ROUTES) },
      {
        path: 'pending/payments',
        loadChildren: () => import('./features/payments/payments.routes').then((m) => m.PAYMENTS_ROUTES),
      },
      {
        path: 'pending/shipping',
        loadChildren: () => import('./features/shipping/shipping.routes').then((m) => m.SHIPPING_ROUTES),
      },
      {
        path: 'pending/returns',
        loadChildren: () =>
          import('./features/returns/returns.routes').then((m) => m.RETURNS_ROUTES),
      },
      { path: 'products', loadChildren: () => import('./features/products/products.routes').then((m) => m.PRODUCTS_ROUTES) },
      { path: 'catalog/categories', loadChildren: () => import('./features/categories/categories.routes').then((m) => m.CATEGORIES_ROUTES) },
      { path: 'catalog/brands', loadChildren: () => import('./features/brands/brands.routes').then((m) => m.BRANDS_ROUTES) },
      {
        path: 'pending/categories',
        loadChildren: () => import('./features/categories/categories.routes').then((m) => m.CATEGORIES_ROUTES),
      },
      {
        path: 'pending/brands',
        loadChildren: () =>
          import('./features/brands/brands.routes').then((m) => m.BRANDS_ROUTES),
      },
      { path: 'inventory', loadChildren: () => import('./features/inventory/inventory.routes').then((m) => m.INVENTORY_ROUTES) },
      { path: 'customers', loadChildren: () => import('./features/customers/customers.routes').then((m) => m.CUSTOMERS_ROUTES) },
      {
        path: 'team',
        loadChildren: () => import('./features/team/team.routes').then((m) => m.TEAM_ROUTES),
      },
      {
        path: 'marketing',
        loadChildren: () => import('./features/marketing/marketing.routes').then((m) => m.MARKETING_ROUTES),
      },
      { path: 'content', loadChildren: () => import('./features/content/content.routes').then((m) => m.CONTENT_ROUTES) },
      { path: 'settings', loadChildren: () => import('./features/settings/settings.routes').then((m) => m.SETTINGS_ROUTES) },
      { path: 'procurement', loadChildren: () => import('./features/procurement/procurement.routes').then((m) => m.PROCUREMENT_ROUTES) },
      { path: 'reports', loadChildren: () => import('./features/reports/reports.routes').then((m) => m.REPORTS_ROUTES) },
      { path: 'trash', loadChildren: () => import('./features/trash/trash.routes').then((m) => m.TRASH_ROUTES) },
      { path: 'pending/sales-analysis', redirectTo: 'reports/sales-analysis', pathMatch: 'full' },
      { path: 'pending/orders-report', redirectTo: 'reports/orders', pathMatch: 'full' },
      { path: 'pending/inventory-report', redirectTo: 'reports/inventory', pathMatch: 'full' },
      { path: 'pending/product-performance', redirectTo: 'reports/product-performance', pathMatch: 'full' },
      { path: 'pending/customers-report', redirectTo: 'reports/customers', pathMatch: 'full' },
      { path: 'pending/suppliers', redirectTo: 'procurement/suppliers', pathMatch: 'full' },
      { path: 'pending/purchase-orders', redirectTo: 'procurement/purchase-orders', pathMatch: 'full' },
      { path: 'pending/supply-receipts', redirectTo: 'procurement/receipts', pathMatch: 'full' },
      { path: 'pending/order-settings', redirectTo: 'settings/orders', pathMatch: 'full' },
      { path: 'pending/inventory-settings', redirectTo: 'settings/inventory', pathMatch: 'full' },
      { path: 'pending/payment-methods', redirectTo: 'settings/payments', pathMatch: 'full' },
      { path: 'pending/shipping-methods', redirectTo: 'settings/shipping', pathMatch: 'full' },
      { path: 'pending/taxes', redirectTo: 'settings/taxes', pathMatch: 'full' },
      { path: 'pending/notifications-settings', redirectTo: 'settings/notifications', pathMatch: 'full' },
      { path: 'pending/locale-settings', redirectTo: 'settings/locale', pathMatch: 'full' },
      { path: 'pending/attributes', title: 'الصفحة غير موجودة | نبته', loadComponent: () => import('./pages/not-found.page').then((m) => m.NotFoundPage) },
      { path: 'pending/:feature', title: 'الميزة قيد الربط | نبته', loadComponent: () => import('./pages/pending-feature.page').then((m) => m.PendingFeaturePage) },
    ],
  },
  { path: '**', title: 'الصفحة غير موجودة | نبته', loadComponent: () => import('./pages/not-found.page').then((m) => m.NotFoundPage) },
];


