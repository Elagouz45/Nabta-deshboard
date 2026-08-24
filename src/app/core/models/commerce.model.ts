import { Product } from './product.model';

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  id: string;
  userId: string | null;
  items: CartItem[];
  couponCode: string | null;
  updatedAt: string;
}

export interface CartItemView extends CartItem {
  product: Product;
  lineSubtotal: number;
  lineDiscount: number;
  lineTotal: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface ComparisonItem {
  productId: string;
  addedAt: string;
}

export type CouponType = 'percent' | 'fixed';

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minSubtotal: number;
  active: boolean;
  expiresAt: string;
  descriptionAr: string;
  descriptionEn: string;
}

export interface ShippingMethod {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
}

export type PaymentMethodCode = 'cod' | 'card' | 'wallet';

export interface PaymentMethod {
  id: PaymentMethodCode;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  isPlaceholder: boolean;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface OrderItem {
  productId: string;
  nameAr: string;
  nameEn: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  thumbnail: string;
}

export interface OrderStatusEvent {
  status: OrderStatus;
  at: string;
  noteAr?: string;
  noteEn?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string | null;
  guestEmail: string | null;
  customerName: string;
  customerMobile: string;
  customerMobileAlt: string | null;
  customerEmail: string | null;
  address: Omit<import('./user.model').Address, 'id' | 'userId' | 'isDefault'>;
  items: OrderItem[];
  shippingMethodId: string;
  paymentMethod: PaymentMethodCode;
  couponCode: string | null;
  subtotal: number;
  discount: number;
  couponDiscount: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  statusHistory: OrderStatusEvent[];
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PriceBreakdown {
  itemsSubtotal: number;
  saleDiscount: number;
  couponDiscount: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface CheckoutPayload {
  fullName: string;
  mobile: string;
  mobileAlt?: string;
  email?: string;
  address: {
    governorate: string;
    city: string;
    area: string;
    street: string;
    building: string;
    landmark: string;
    notes: string;
  };
  shippingMethodId: string;
  paymentMethod: PaymentMethodCode;
  couponCode: string | null;
  acceptTerms: boolean;
}
