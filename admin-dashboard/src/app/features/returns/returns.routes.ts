import { Routes } from '@angular/router';
import { adminGuard, featureAvailabilityGuard } from '../../core/auth.guards';

export const RETURNS_ROUTES: Routes = [{
  path: '', pathMatch: 'full', canActivate: [featureAvailabilityGuard('returns'), adminGuard],
  title: 'المرتجعات والاسترداد | نبته',
  loadComponent: () => import('./pages/returns-list-page/returns-list-page').then((m) => m.ReturnsListPage),
}];
