import { Injectable, Injector, inject } from '@angular/core';
import { AccountRepository } from '@data-access/repositories/account.repository';
import { MockDatabase } from '@data-access/mock/mock-database.service';
import { MockHttp, notFound } from '@data-access/mock/mock-http.service';
import { COUPONS, MOCK_PASSWORDS, PAYMENT_METHODS, SHIPPING_METHODS } from '@data-access/mock/commerce.mock';
import { DemoAuthStorage } from '@data-access/mock/demo-auth.storage';
import { AuthStore } from '@state/auth/auth.store';
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
import { couponDiscountAmount, lineTotals, roundMoney, unitPrice } from '@core/utils/pricing.util';
import { Observable, from, switchMap } from 'rxjs';

const RESET_CODE = '123456';

@Injectable()
export class MockAccountRepository extends AccountRepository {
  private readonly db = inject(MockDatabase);
  private readonly http = inject(MockHttp);
  private readonly demo = inject(DemoAuthStorage);
  private readonly injector = inject(Injector);
  private prefs: Record<string, NotificationPreferences> = {};

  private sessionUser(): User | null {
    return this.injector.get(AuthStore).user();
  }

  login(mobile: string, password: string): Observable<AuthSession> {
    const user = this.db.users().find((u) => u.mobile === mobile);
    if (!user) {
      return this.invalidCredentials();
    }
    return from(this.demo.verifyPassword(mobile, password, MOCK_PASSWORDS[mobile])).pipe(
      switchMap((ok) => (ok ? this.http.ok(this.session(user)) : this.invalidCredentials())),
    );
  }

  register(input: { fullName: string; mobile: string; email?: string; password: string }): Observable<AuthSession> {
    if (this.db.users().some((u) => u.mobile === input.mobile)) {
      return this.http.fail({
        status: 422,
        code: 'mobile_taken',
        messageAr: 'رقم الهاتف مسجّل بالفعل.',
        messageEn: 'This mobile number is already registered.',
        fieldErrors: { mobile: 'رقم الهاتف مسجّل بالفعل.' },
      });
    }
    const user: User = {
      id: this.db.nextId('u'),
      fullName: input.fullName,
      mobile: input.mobile,
      email: input.email ?? null,
      role: 'customer',
      isPhoneVerified: false,
      createdAt: new Date().toISOString(),
    };
    this.db.users.update((rows) => [user, ...rows]);
    this.db.persistUsers();
    return from(this.demo.setPassword(input.mobile, input.password)).pipe(
      switchMap(() => this.http.ok(this.session(user))),
    );
  }

  forgotPassword(mobile: string): Observable<{ ok: true }> {
    if (!this.db.users().some((u) => u.mobile === mobile)) {
      return this.http.fail({
        status: 404,
        code: 'user_not_found',
        messageAr: 'لا يوجد حساب بهذا الرقم.',
        messageEn: 'No account exists for this number.',
      });
    }
    return this.http.ok({ ok: true });
  }

  resetPassword(mobile: string, code: string, password: string): Observable<{ ok: true }> {
    if (code !== RESET_CODE) {
      return this.http.fail({
        status: 422,
        code: 'invalid_code',
        messageAr: 'رمز التحقق غير صحيح. الرمز التجريبي 123456.',
        messageEn: 'Invalid code. Demo code is 123456.',
      });
    }
    MOCK_PASSWORDS[mobile] = password;
    void this.demo.setPassword(mobile, password);
    return this.http.ok({ ok: true });
  }

  verifyPhone(mobile: string, code: string): Observable<AuthSession> {
    if (code !== RESET_CODE) {
      return this.http.fail({
        status: 422,
        code: 'invalid_code',
        messageAr: 'رمز التحقق غير صحيح.',
        messageEn: 'Invalid verification code.',
      });
    }
    const user = this.db.users().find((u) => u.mobile === mobile);
    if (!user) {
      return this.http.fail(notFound('المستخدم', 'User'));
    }
    const verified = { ...user, isPhoneVerified: true };
    this.db.users.update((rows) => rows.map((u) => (u.id === user.id ? verified : u)));
    this.db.persistUsers();
    return this.http.ok(this.session(verified));
  }

  currentUser(): Observable<User> {
    return this.http.fail({ status: 401, code: 'unauthenticated', messageAr: 'يلزم تسجيل الدخول.', messageEn: 'Login required.' });
  }

  updateProfile(patch: Partial<Pick<User, 'fullName' | 'email'>>): Observable<User> {
    const current = this.sessionUser();
    if (!current) {
      return this.http.fail({
        status: 401,
        code: 'unauthenticated',
        messageAr: 'يلزم تسجيل الدخول.',
        messageEn: 'Login required.',
      });
    }
    const updated: User = { ...current, ...patch };
    this.db.users.update((rows) => rows.map((row) => (row.id === current.id ? updated : row)));
    this.db.persistUsers();
    this.injector.get(AuthStore).updateUser(updated);
    return this.http.ok(updated);
  }

  changePassword(current: string, next: string): Observable<{ ok: true }> {
    const user = this.sessionUser();
    if (!user || !current || !next) {
      return this.http.fail({
        status: 422,
        code: 'invalid',
        messageAr: 'تحقق من كلمة المرور.',
        messageEn: 'Check the password.',
      });
    }
    return from(this.demo.verifyPassword(user.mobile, current, MOCK_PASSWORDS[user.mobile])).pipe(
      switchMap((ok) => {
        if (!ok) {
          return this.http.fail({
            status: 422,
            code: 'invalid',
            messageAr: 'كلمة المرور الحالية غير صحيحة.',
            messageEn: 'Current password is incorrect.',
          });
        }
        MOCK_PASSWORDS[user.mobile] = next;
        return from(this.demo.setPassword(user.mobile, next)).pipe(switchMap(() => this.http.ok({ ok: true as const })));
      }),
    );
  }

  listAddresses(userId: string): Observable<Address[]> {
    return this.http.ok(this.db.addresses().filter((a) => a.userId === userId));
  }

  saveAddress(address: Address): Observable<Address> {
    const saved = { ...address, id: address.id || this.db.nextId('ad') };
    this.db.addresses.update((rows) => {
      let next = rows.filter((a) => a.id !== saved.id);
      if (saved.isDefault) {
        next = next.map((a) => (a.userId === saved.userId ? { ...a, isDefault: false } : a));
      }
      return [saved, ...next];
    });
    return this.http.ok(saved);
  }

  deleteAddress(id: string): Observable<void> {
    this.db.addresses.update((rows) => rows.filter((a) => a.id !== id));
    return this.http.ok(undefined as void);
  }

  listOrders(userId: string | null): Observable<Order[]> {
    const rows = userId ? this.db.orders().filter((o) => o.userId === userId) : this.db.orders();
    return this.http.ok(rows.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)));
  }

  getOrder(id: string): Observable<Order> {
    const row = this.db.orders().find((o) => o.id === id || o.orderNumber === id);
    return row ? this.http.ok(row) : this.http.fail(notFound('الطلب', 'Order'));
  }

  placeOrder(
    payload: CheckoutPayload,
    items: { productId: string; quantity: number }[],
    userId: string | null,
  ): Observable<Order> {
    if (!items.length) {
      return this.http.fail({
        status: 422,
        code: 'empty_cart',
        messageAr: 'السلة فارغة.',
        messageEn: 'Cart is empty.',
      });
    }
    if (!payload.acceptTerms) {
      return this.http.fail({
        status: 422,
        code: 'terms',
        messageAr: 'يجب الموافقة على الشروط.',
        messageEn: 'Terms must be accepted.',
      });
    }
    const products = this.db.products();
    const unavailable = items.some((item) => {
      const product = products.find((p) => p.id === item.productId);
      return !product || product.stockQuantity < item.quantity;
    });
    if (unavailable) {
      return this.http.fail({
        status: 422,
        code: 'stock',
        messageAr: 'أحد المنتجات غير متوفر بالكمية المطلوبة.',
        messageEn: 'One of the products is not available in the requested quantity.',
      });
    }
    let itemsSubtotal = 0;
    let saleDiscount = 0;
    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      const line = lineTotals(product, item.quantity);
      itemsSubtotal += line.lineSubtotal;
      saleDiscount += line.lineDiscount;
      return {
        productId: product.id,
        nameAr: product.nameAr,
        nameEn: product.nameEn,
        sku: product.sku,
        quantity: item.quantity,
        unitPrice: unitPrice(product),
        lineTotal: line.lineTotal,
        thumbnail: product.thumbnail,
      };
    });
    const shipping = SHIPPING_METHODS.find((s) => s.id === payload.shippingMethodId) ?? SHIPPING_METHODS[0];
    const couponCode = payload.couponCode;
    const coupon = couponCode
      ? (COUPONS.find((c) => c.code === couponCode.toUpperCase()) ?? null)
      : null;
    const afterSale = roundMoney(itemsSubtotal - saleDiscount);
    const couponDisc = couponDiscountAmount(afterSale, coupon);
    const total = roundMoney(afterSale - couponDisc + shipping.price);
    const now = new Date().toISOString();
    const order: Order = {
      id: this.db.nextId('ord'),
      orderNumber: `NAM-${now.slice(2, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 9000 + 1000)}`,
      userId,
      guestEmail: payload.email ?? null,
      customerName: payload.fullName,
      customerMobile: payload.mobile,
      customerMobileAlt: payload.mobileAlt ?? null,
      customerEmail: payload.email ?? null,
      address: {
        label: 'التسليم',
        fullName: payload.fullName,
        mobile: payload.mobile,
        ...payload.address,
      },
      items: orderItems,
      shippingMethodId: shipping.id,
      paymentMethod: payload.paymentMethod,
      couponCode: coupon?.code ?? null,
      subtotal: roundMoney(afterSale),
      discount: roundMoney(saleDiscount),
      couponDiscount: couponDisc,
      shipping: shipping.price,
      tax: 0,
      total,
      status: 'pending',
      statusHistory: [{ status: 'pending', at: now }],
      createdAt: now,
      updatedAt: now,
    };
    this.db.orders.update((rows) => [order, ...rows]);
    this.db.persistOrders();
    this.db.products.update((rows) =>
      rows.map((p) => {
        const used = items.find((i) => i.productId === p.id);
        if (!used) {
          return p;
        }
        const stockQuantity = Math.max(0, p.stockQuantity - used.quantity);
        return {
          ...p,
          stockQuantity,
          stockStatus: stockQuantity <= 0 ? 'out_of_stock' : stockQuantity <= 12 ? 'low_stock' : 'in_stock',
        };
      }),
    );
    return this.http.ok(order);
  }

  updateOrderStatus(id: string, status: OrderStatus, reason?: string): Observable<Order> {
    const current = this.db.orders().find((o) => o.id === id);
    if (!current) {
      return this.http.fail(notFound('الطلب', 'Order'));
    }
    const updated: Order = {
      ...current,
      status,
      cancellationReason: reason,
      updatedAt: new Date().toISOString(),
      statusHistory: [...current.statusHistory, { status, at: new Date().toISOString(), noteAr: reason, noteEn: reason }],
    };
    this.db.orders.update((rows) => rows.map((o) => (o.id === id ? updated : o)));
    this.db.persistOrders();
    return this.http.ok(updated);
  }

  validateCoupon(code: string, subtotal: number): Observable<Coupon> {
    const coupon = COUPONS.find((c) => c.code === code.trim().toUpperCase());
    if (!coupon || !coupon.active || Date.parse(coupon.expiresAt) < Date.now()) {
      return this.http.fail({
        status: 422,
        code: 'invalid_coupon',
        messageAr: 'الكوبون غير صالح أو منتهٍ.',
        messageEn: 'Coupon is invalid or expired.',
      });
    }
    if (subtotal < coupon.minSubtotal) {
      return this.http.fail({
        status: 422,
        code: 'coupon_min',
        messageAr: `الحد الأدنى لاستخدام الكوبون ${coupon.minSubtotal} ج.م.`,
        messageEn: `Minimum subtotal for this coupon is ${coupon.minSubtotal} EGP.`,
      });
    }
    return this.http.ok(coupon);
  }

  listCoupons(): Observable<Coupon[]> {
    return this.http.ok(COUPONS);
  }
  listShipping(): Observable<ShippingMethod[]> {
    return this.http.ok(SHIPPING_METHODS);
  }
  listPayments(): Observable<PaymentMethod[]> {
    return this.http.ok(PAYMENT_METHODS);
  }

  sendContact(message: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): Observable<ContactMessage> {
    const saved: ContactMessage = {
      ...message,
      id: this.db.nextId('msg'),
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    this.db.messages.update((rows) => [saved, ...rows]);
    return this.http.ok(saved);
  }

  listMessages(): Observable<ContactMessage[]> {
    return this.http.ok(this.db.messages());
  }

  listCustomers(): Observable<User[]> {
    return this.http.ok(this.db.users().filter((u) => u.role === 'customer'));
  }

  notifications(userId: string): Observable<NotificationItem[]> {
    return this.http.ok([
      {
        id: 'n1',
        userId,
        titleAr: 'تم تأكيد طلبك',
        titleEn: 'Your order was confirmed',
        bodyAr: 'يمكنك تتبع حالته من صفحة الطلبات.',
        bodyEn: 'You can track it from the orders page.',
        createdAt: new Date().toISOString(),
        read: false,
      },
    ]);
  }

  saveNotificationPrefs(userId: string, prefs: NotificationPreferences): Observable<NotificationPreferences> {
    this.prefs[userId] = prefs;
    return this.http.ok(prefs);
  }

  requestCancel(orderId: string, reason: string): Observable<Order> {
    const order = this.db.orders().find((o) => o.id === orderId);
    if (!order) {
      return this.http.fail(notFound('الطلب', 'Order'));
    }
    if (!['pending', 'confirmed'].includes(order.status)) {
      return this.http.fail({
        status: 422,
        code: 'cannot_cancel',
        messageAr: 'لا يمكن إلغاء الطلب في حالته الحالية.',
        messageEn: 'This order cannot be cancelled in its current status.',
      });
    }
    return this.updateOrderStatus(orderId, 'cancelled', reason);
  }

  private invalidCredentials(): Observable<AuthSession> {
    return this.http.fail({
      status: 401,
      code: 'invalid_credentials',
      messageAr: 'رقم الهاتف أو كلمة المرور غير صحيحة.',
      messageEn: 'Mobile number or password is incorrect.',
    });
  }

  private session(user: User): AuthSession {
    return {
      token: `mock.${user.id}.${btoa(user.mobile)}`,
      user,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    };
  }
}
