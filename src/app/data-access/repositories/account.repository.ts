import { Observable } from 'rxjs';
import {
  Address,
  AuthSession,
  CheckoutPayload,
  ContactMessage,
  Coupon,
  NotificationItem,
  NotificationPreferences,
  Order,
  OrderStatus,
  PaymentMethod,
  ShippingMethod,
  User,
} from '@core/models';

export abstract class AccountRepository {
  abstract login(mobile: string, password: string): Observable<AuthSession>;
  abstract register(input: {
    fullName: string;
    mobile: string;
    email?: string;
    password: string;
  }): Observable<AuthSession>;
  abstract forgotPassword(mobile: string): Observable<{ ok: true }>;
  abstract resetPassword(mobile: string, code: string, password: string): Observable<{ ok: true }>;
  abstract verifyPhone(mobile: string, code: string): Observable<AuthSession>;
  abstract currentUser(): Observable<User>;
  abstract updateProfile(patch: Partial<Pick<User, 'fullName' | 'email'>>): Observable<User>;
  abstract changePassword(current: string, next: string): Observable<{ ok: true }>;
  abstract listAddresses(userId: string): Observable<Address[]>;
  abstract saveAddress(address: Address): Observable<Address>;
  abstract deleteAddress(id: string): Observable<void>;
  abstract listOrders(userId: string | null): Observable<Order[]>;
  abstract getOrder(id: string): Observable<Order>;
  abstract placeOrder(payload: CheckoutPayload, items: { productId: string; quantity: number }[], userId: string | null): Observable<Order>;
  abstract updateOrderStatus(id: string, status: OrderStatus, reason?: string): Observable<Order>;
  abstract validateCoupon(code: string, subtotal: number): Observable<Coupon>;
  abstract listCoupons(): Observable<Coupon[]>;
  abstract listShipping(): Observable<ShippingMethod[]>;
  abstract listPayments(): Observable<PaymentMethod[]>;
  abstract sendContact(message: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): Observable<ContactMessage>;
  abstract listMessages(): Observable<ContactMessage[]>;
  abstract listCustomers(): Observable<User[]>;
  abstract notifications(userId: string): Observable<NotificationItem[]>;
  abstract saveNotificationPrefs(userId: string, prefs: NotificationPreferences): Observable<NotificationPreferences>;
  abstract requestCancel(orderId: string, reason: string): Observable<Order>;
}
