export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  mobile: string;
  governorate: string;
  itemsCount: number;
  total: number;
  status: OrderStatus;
  payment: 'الدفع عند الاستلام' | 'بطاقة بنكية' | 'محفظة إلكترونية';
  createdAt: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: StockStatus;
  active: boolean;
  thumbnail?: string;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  orders: number;
  spent: number;
  city: string;
  joinedAt: string;
}

export interface Activity {
  id: string;
  title: string;
  detail: string;
  time: string;
  tone: 'success' | 'warning' | 'info';
}

export interface AdminUser {
  id: string;
  fullName: string;
  mobile: string;
  email: string | null;
  role: 'admin' | 'staff';
  permissions?: string[];
}

export interface AuthSession {
  token: string;
  expiresAt: string;
  user: AdminUser;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  status: number;
  message: string;
  fieldErrors: Record<string, string>;
}


