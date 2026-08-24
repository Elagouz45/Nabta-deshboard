import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { AccountRepository } from '@data-access/repositories/account.repository';
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

@Injectable()
export class HttpAccountRepository extends AccountRepository {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  login(mobile: string, password: string) {
    return this.http.post<AuthSession>(`${this.base}/auth/login`, { mobile, password });
  }
  register(input: { fullName: string; mobile: string; email?: string; password: string }) {
    return this.http.post<AuthSession>(`${this.base}/auth/register`, input);
  }
  forgotPassword(mobile: string) {
    return this.http.post<{ ok: true }>(`${this.base}/auth/forgot-password`, { mobile });
  }
  resetPassword(mobile: string, code: string, password: string) {
    return this.http.post<{ ok: true }>(`${this.base}/auth/reset-password`, { mobile, code, password });
  }
  verifyPhone(mobile: string, code: string) {
    return this.http.post<AuthSession>(`${this.base}/auth/verify-phone`, { mobile, code });
  }
  currentUser() {
    return this.http.get<User>(`${this.base}/me`);
  }
  updateProfile(patch: Partial<Pick<User, 'fullName' | 'email'>>) {
    return this.http.patch<User>(`${this.base}/me`, patch);
  }
  changePassword(current: string, next: string) {
    return this.http.post<{ ok: true }>(`${this.base}/me/password`, { current, next });
  }
  listAddresses(userId: string) {
    void userId;
    return this.http.get<Address[]>(`${this.base}/me/addresses`);
  }
  saveAddress(address: Address) {
    return address.id
      ? this.http.put<Address>(`${this.base}/me/addresses/${address.id}`, address)
      : this.http.post<Address>(`${this.base}/me/addresses`, address);
  }
  deleteAddress(id: string) {
    return this.http.delete<void>(`${this.base}/me/addresses/${id}`);
  }
  listOrders(userId: string | null) {
    return this.http.get<Order[]>(userId ? `${this.base}/me/orders` : `${this.base}/admin/orders`);
  }
  getOrder(id: string) {
    return this.http.get<Order>(`${this.base}/orders/${id}`);
  }
  placeOrder(payload: CheckoutPayload, items: { productId: string; quantity: number }[], userId: string | null) {
    return this.http.post<Order>(`${this.base}/checkout`, { ...payload, items, userId });
  }
  updateOrderStatus(id: string, status: OrderStatus, reason?: string) {
    return this.http.patch<Order>(`${this.base}/admin/orders/${id}`, { status, reason });
  }
  validateCoupon(code: string, subtotal: number) {
    return this.http.post<Coupon>(`${this.base}/coupons/validate`, { code, subtotal });
  }
  listCoupons() {
    return this.http.get<Coupon[]>(`${this.base}/admin/coupons`);
  }
  listShipping() {
    return this.http.get<ShippingMethod[]>(`${this.base}/shipping-methods`);
  }
  listPayments() {
    return this.http.get<PaymentMethod[]>(`${this.base}/payment-methods`);
  }
  sendContact(message: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) {
    return this.http.post<ContactMessage>(`${this.base}/contact`, message);
  }
  listMessages() {
    return this.http.get<ContactMessage[]>(`${this.base}/admin/messages`);
  }
  listCustomers() {
    return this.http.get<User[]>(`${this.base}/admin/customers`);
  }
  notifications(userId: string) {
    void userId;
    return this.http.get<NotificationItem[]>(`${this.base}/me/notifications`);
  }
  saveNotificationPrefs(userId: string, prefs: NotificationPreferences) {
    return this.http.put<NotificationPreferences>(`${this.base}/me/notifications/preferences`, prefs);
  }
  requestCancel(orderId: string, reason: string) {
    return this.http.post<Order>(`${this.base}/orders/${orderId}/cancel`, { reason });
  }
}
