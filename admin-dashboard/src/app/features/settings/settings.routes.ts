import { Routes } from '@angular/router';
import { adminGuard, featureAvailabilityGuard } from '../../core/auth.guards';
import { SettingsSectionId } from './models/settings.model';

const page = (section: SettingsSectionId, title: string) => ({
  path: section,
  canActivate: [featureAvailabilityGuard('settings'), adminGuard],
  title: `${title} | نبته`,
  data: { section },
  loadComponent: () =>
    import('./pages/settings-section.page').then((module) => module.SettingsSectionPage),
});
export const SETTINGS_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'store' }, page('store', 'إعدادات المتجر'), page('orders', 'إعدادات الطلبات'), page('inventory', 'إعدادات المخزون'), page('payments', 'وسائل الدفع'), page('shipping', 'طرق الشحن'), page('taxes', 'الضرائب'), page('notifications', 'الإشعارات'), page('locale', 'اللغة والعملة'),
];
