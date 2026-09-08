import { Routes } from '@angular/router';import { adminGuard,featureAvailabilityGuard } from '../../core/auth.guards';
export const SHIPPING_ROUTES:Routes=[{path:'',canActivate:[featureAvailabilityGuard('shipping'),adminGuard],title:'الشحن والتوصيل | نبته',loadComponent:()=>import('./pages/shipping-list-page/shipping-list-page').then(m=>m.ShippingListPage)}];
