import { NavigationGroup } from './navigation-item.model';

export const ADMIN_NAVIGATION: readonly NavigationGroup[] = [
  { id: 'main', label: 'الرئيسية', items: [{ id: 'overview', label: 'نظرة عامة', route: '/overview', icon: 'home', match: 'exact' }] },
  { id: 'sales', label: 'المبيعات', items: [
    { id: 'orders', label: 'الطلبات', route: '/orders', icon: 'orders', permission: 'orders.view', feature: 'orders', match: 'prefix' },
    { id: 'invoices', label: 'الفواتير', route: '/invoices', icon: 'content', feature: 'invoices', match: 'prefix', adminOnly: true },
    { id: 'payments', label: 'المدفوعات', route: '/payments', icon: 'orders', feature: 'payments', match: 'prefix', adminOnly: true },
    { id: 'shipping', label: 'الشحن والتوصيل', route: '/shipping', icon: 'orders', feature: 'shipping', match: 'prefix', adminOnly: true },
    { id: 'returns', label: 'المرتجعات والاسترداد', route: '/returns', icon: 'orders', feature: 'returns', match: 'prefix', adminOnly: true },
  ] },
  { id: 'catalog', label: 'الكتالوج', items: [
    { id: 'products', label: 'المنتجات', route: '/products', icon: 'products', permission: 'products.view', feature: 'products', match: 'prefix' },
    { id: 'categories', label: 'التصنيفات', route: '/catalog/categories', icon: 'products', match: 'exact', adminOnly: true, demoOnly: true },
    { id: 'brands', label: 'العلامات التجارية', route: '/catalog/brands', icon: 'products', match: 'exact', adminOnly: true, demoOnly: true },
  ] },
  { id: 'customers', label: 'العملاء', items: [
    { id: 'customers-all', label: 'جميع العملاء', route: '/customers', icon: 'customers', feature: 'customers', match: 'prefix', adminOnly: true },
  ] },
  { id: 'marketing', label: 'التسويق والعروض', items: [
    { id: 'discounts', label: 'الخصومات والكوبونات', route: '/marketing/discounts', icon: 'products', match: 'prefix', adminOnly: true },
  ] },
  { id: 'content', label: 'المحتوى', items: [
    { id: 'articles', label: 'المقالات الزراعية', route: '/content/articles', icon: 'content', feature: 'content', match: 'prefix', adminOnly: true },
  ] },
  { id: 'team', label: 'الفريق', items: [
    { id: 'team-users', label: 'المستخدمون', route: '/team/users', icon: 'customers', match: 'prefix', adminOnly: true },
    { id: 'team-roles', label: 'الأدوار والصلاحيات', route: '/team/roles', icon: 'customers', match: 'prefix', adminOnly: true },
    { id: 'team-activity', label: 'سجل نشاط الفريق', route: '/team/activity-log', icon: 'customers', match: 'prefix', adminOnly: true },
  ] },
  { id: 'reports', label: 'التقارير', items: [
    { id: 'sales-analysis', label: 'تحليل المبيعات', route: '/reports/sales-analysis', icon: 'orders', feature: 'reports', match: 'exact', adminOnly: true },
    { id: 'orders-report', label: 'تقرير الطلبات', route: '/reports/orders', icon: 'orders', feature: 'reports', match: 'exact', adminOnly: true },
    { id: 'inventory-report', label: 'تقرير المخزون', route: '/reports/inventory', icon: 'inventory', feature: 'reports', match: 'exact', adminOnly: true },
    { id: 'product-performance', label: 'أداء المنتجات', route: '/reports/product-performance', icon: 'products', feature: 'reports', match: 'exact', adminOnly: true },
    { id: 'customers-report', label: 'تقرير العملاء', route: '/reports/customers', icon: 'customers', feature: 'reports', match: 'exact', adminOnly: true },
  ] },
  { id: 'settings', label: 'الإعدادات', items: [
    { id: 'trash', label: 'سلة المهملات', route: '/trash', icon: 'settings', match: 'exact', adminOnly: true },
    { id: 'store-settings', label: 'إعدادات المتجر', route: '/settings/store', icon: 'settings', feature: 'settings', match: 'exact', adminOnly: true },
    { id: 'order-settings', label: 'إعدادات الطلبات', route: '/settings/orders', icon: 'settings', feature: 'settings', match: 'exact', adminOnly: true },
    { id: 'inventory-settings', label: 'إعدادات المخزون', route: '/settings/inventory', icon: 'settings', feature: 'settings', match: 'exact', adminOnly: true },
    { id: 'payment-methods', label: 'وسائل الدفع', route: '/settings/payments', icon: 'settings', feature: 'settings', match: 'exact', adminOnly: true },
    { id: 'shipping-methods', label: 'طرق الشحن', route: '/settings/shipping', icon: 'settings', feature: 'settings', match: 'exact', adminOnly: true },
    { id: 'taxes', label: 'الضرائب', route: '/settings/taxes', icon: 'settings', feature: 'settings', match: 'exact', adminOnly: true },
    { id: 'notifications-settings', label: 'الإشعارات', route: '/settings/notifications', icon: 'settings', feature: 'settings', match: 'exact', adminOnly: true },
    { id: 'locale-settings', label: 'اللغة والعملة', route: '/settings/locale', icon: 'settings', feature: 'settings', match: 'exact', adminOnly: true },
  ] },
  { id: 'procurement', label: 'المشتريات والتوريد — عند الحاجة', items: [
    { id: 'suppliers', label: 'الموردون', route: '/procurement/suppliers', icon: 'customers', feature: 'procurement', match: 'exact', adminOnly: true },
    { id: 'purchase-orders', label: 'أوامر الشراء', route: '/procurement/purchase-orders', icon: 'orders', feature: 'procurement', match: 'exact', adminOnly: true },
    { id: 'supply-receipts', label: 'استلام التوريدات', route: '/procurement/receipts', icon: 'inventory', feature: 'procurement', match: 'exact', adminOnly: true },
  ] },
] as const;
