import { Routes } from '@angular/router';
import { adminGuard, featureAvailabilityGuard, permissionGuard } from '../../core/auth.guards';

export const PRODUCTS_ROUTES: Routes = [
  { path: 'new', canActivate: [featureAvailabilityGuard('products'), permissionGuard('products.view'), adminGuard], title: 'إضافة منتج | نبته', loadComponent: () => import('./pages/product-create-page/product-create-page').then((m) => m.ProductCreatePage) },
  { path: '', pathMatch: 'full', canActivate: [featureAvailabilityGuard('products'), permissionGuard('products.view')], title: 'المنتجات | نبته', loadComponent: () => import('../../pages/products.page').then((m) => m.ProductsPage) },
];
