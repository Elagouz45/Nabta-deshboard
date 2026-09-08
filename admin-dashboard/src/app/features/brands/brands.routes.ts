import { Routes } from '@angular/router';
import { adminGuard } from '../../core/auth.guards';
export const BRANDS_ROUTES:Routes=[{path:'',pathMatch:'full',canActivate:[adminGuard],title:'العلامات التجارية | نبته',loadComponent:()=>import('./pages/brands-list-page/brands-list-page').then(m=>m.BrandsListPage)}];
