import { Routes } from '@angular/router';
import { adminGuard, featureAvailabilityGuard } from '../../core/auth.guards';

export const INVENTORY_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'balances' },
  { path: 'balances', canActivate: [featureAvailabilityGuard('inventory'), adminGuard], title: 'أرصدة المخزون | نبته', loadComponent: () => import('../../pages/inventory.page').then((m) => m.InventoryPage) },
];
