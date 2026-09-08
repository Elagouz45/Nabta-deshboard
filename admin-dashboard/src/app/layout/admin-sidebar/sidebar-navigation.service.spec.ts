import { describe, expect, it } from 'vitest';
import { ADMIN_NAVIGATION } from './admin-navigation.config';
import { isNavigationItemActive } from './sidebar-navigation.service';
import { nextOpenGroupIds } from './admin-sidebar';

describe('admin navigation configuration', () => {
  it('keeps the approved group order', () => {
    expect(ADMIN_NAVIGATION.map((group) => group.label)).toEqual(['الرئيسية', 'المبيعات', 'الكتالوج', 'العملاء', 'التسويق والعروض', 'المحتوى', 'الفريق', 'التقارير', 'الإعدادات', 'المشتريات والتوريد — عند الحاجة']);
  });

  it('does not define duplicate visible routes', () => {
    const routes = ADMIN_NAVIGATION.flatMap((group) => group.items.map((item) => item.route));
    expect(new Set(routes).size).toBe(routes.length);
  });
});

describe('sidebar dropdown state', () => {
  it('opens one group and closes the previously open group', () => {
    expect([...nextOpenGroupIds(new Set(['sales']), 'catalog')]).toEqual(['catalog']);
  });

  it('closes an open group when its heading is selected again', () => {
    expect(nextOpenGroupIds(new Set(['sales']), 'sales').size).toBe(0);
  });
});

describe('isNavigationItemActive', () => {
  const item = (route: string, match: 'exact' | 'prefix' = 'prefix') => ({ id: route, label: route, route, icon: 'home' as const, match });

  it.each([
    ['/orders/15', '/orders'],
    ['/products/22/edit', '/products'],
    ['/inventory/balances', '/inventory/balances'],
    ['/content/articles/8/edit', '/content/articles'],
    ['/settings/notifications', '/settings/notifications'],
  ])('matches nested URL %s to %s', (url, route) => expect(isNavigationItemActive(item(route), url)).toBe(true));

  it('keeps overview matching exact', () => {
    expect(isNavigationItemActive(item('/overview', 'exact'), '/overview/details')).toBe(false);
  });
});
