import { Routes } from '@angular/router';
import { adminGuard } from '../../core/auth.guards';

export const CATEGORIES_ROUTES: Routes = [{
  path: '', pathMatch: 'full', canActivate: [adminGuard], title: 'التصنيفات | نبته',
  loadComponent: () => import('./pages/categories-list-page/categories-list-page').then((m) => m.CategoriesListPage),
}];
