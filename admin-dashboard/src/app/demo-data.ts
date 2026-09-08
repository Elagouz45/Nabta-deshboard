import { Customer, Order, Product } from './models';

export function stockStatusForQuantity(quantity: number): Product['status'] {
  if (quantity === 0) return 'out_of_stock';
  return quantity <= 8 ? 'low_stock' : 'in_stock';
}

export const DEMO_ORDERS: Order[] = [
  { id: '1', orderNumber: '#NB-2048', customer: 'أحمد منصور', mobile: '01024568890', governorate: 'الشرقية', itemsCount: 3, total: 2480, status: 'pending', payment: 'الدفع عند الاستلام', createdAt: 'اليوم، 10:42 ص' },
  { id: '2', orderNumber: '#NB-2047', customer: 'محمود عادل', mobile: '01193821044', governorate: 'البحيرة', itemsCount: 2, total: 1320, status: 'processing', payment: 'بطاقة بنكية', createdAt: 'اليوم، 9:18 ص' },
  { id: '3', orderNumber: '#NB-2046', customer: 'سارة فتحي', mobile: '01265017332', governorate: 'المنوفية', itemsCount: 5, total: 3890, status: 'shipped', payment: 'محفظة إلكترونية', createdAt: 'أمس، 6:30 م' },
  { id: '4', orderNumber: '#NB-2045', customer: 'محمد جمال', mobile: '01088014921', governorate: 'الدقهلية', itemsCount: 1, total: 760, status: 'delivered', payment: 'الدفع عند الاستلام', createdAt: 'أمس، 3:05 م' },
];

export const DEMO_PRODUCTS: Product[] = [
  { id: 'p1', sku: 'FER-NPK-20', name: 'سماد NPK المتوازن 20-20-20', category: 'أسمدة', price: 680, stock: 42, status: 'in_stock', active: true },
  { id: 'p2', sku: 'INS-ABM-01', name: 'مبيد أبامكتين مركز', category: 'مبيدات حشرية', price: 415, stock: 7, status: 'low_stock', active: true },
  { id: 'p3', sku: 'FUN-COP-50', name: 'مبيد فطري نحاسي', category: 'مبيدات فطرية', price: 525, stock: 0, status: 'out_of_stock', active: true },
  { id: 'p4', sku: 'TOO-SPR-16', name: 'رشاشة ظهر يدوية 16 لتر', category: 'مستلزمات', price: 890, stock: 19, status: 'in_stock', active: true },
];

export const DEMO_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'أحمد منصور', mobile: '01024568890', orders: 8, spent: 12640, city: 'الزقازيق', joinedAt: '15 مايو 2026' },
  { id: 'c2', name: 'محمود عادل', mobile: '01193821044', orders: 5, spent: 8940, city: 'دمنهور', joinedAt: '2 يونيو 2026' },
  { id: 'c3', name: 'سارة فتحي', mobile: '01265017332', orders: 11, spent: 18270, city: 'شبين الكوم', joinedAt: '20 مارس 2026' },
];
