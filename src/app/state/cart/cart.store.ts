import { Injectable, computed, inject, signal } from '@angular/core';
import { CatalogRepository } from '@data-access/repositories/catalog.repository';
import { AccountRepository } from '@data-access/repositories/account.repository';
import { STORAGE_KEYS } from '@core/constants/storage-keys';
import { MAX_CART_QTY } from '@core/constants/app.constants';
import { Cart, CartItem, Coupon, Product } from '@core/models';
import { StorageService } from '@core/services/storage.service';
import { computePriceBreakdown, lineTotals } from '@core/utils/pricing.util';
import { UiStore } from '@state/ui/ui.store';
import { forkJoin } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly storage = inject(StorageService);
  private readonly catalog = inject(CatalogRepository);
  private readonly accounts = inject(AccountRepository);
  private readonly ui = inject(UiStore);

  private userId: string | null = null;
  private storedCouponCode: string | null = null;
  private readonly itemsSignal = signal<CartItem[]>([]);
  private readonly productsSignal = signal<Product[]>([]);
  private readonly couponSignal = signal<Coupon | null>(null);
  readonly shippingId = signal('ship-std');
  readonly lastRemoved = signal<CartItem | null>(null);

  readonly items = this.itemsSignal.asReadonly();
  readonly products = this.productsSignal.asReadonly();
  readonly coupon = this.couponSignal.asReadonly();
  readonly quantity = computed(() => this.itemsSignal().reduce((sum, i) => sum + i.quantity, 0));

  readonly views = computed(() =>
    this.itemsSignal()
      .map((item) => {
        const product = this.productsSignal().find((p) => p.id === item.productId);
        if (!product) {
          return null;
        }
        return { ...item, product, ...lineTotals(product, item.quantity) };
      })
      .filter((v): v is NonNullable<typeof v> => !!v),
  );

  readonly breakdown = computed(() => {
    const views = this.views();
    const itemsSubtotal = views.reduce((s, v) => s + v.lineSubtotal, 0);
    const saleDiscount = views.reduce((s, v) => s + v.lineDiscount, 0);
    const shipping = this.shippingId() === 'ship-exp' ? 95 : this.shippingId() === 'ship-farm' ? 120 : 55;
    return computePriceBreakdown({
      itemsSubtotal,
      saleDiscount,
      coupon: this.couponSignal(),
      shipping,
    });
  });

  constructor() {
    this.restore(null);
  }

  restore(userId: string | null): void {
    this.userId = userId;
    const stored = this.storage.get<Cart>(this.key());
    this.itemsSignal.set(stored?.items ?? []);
    this.couponSignal.set(null);
    this.storedCouponCode = stored?.couponCode ?? null;
    this.hydrateProducts();
  }

  mergeGuestIntoUser(userId: string): void {
    const guest = this.storage.get<Cart>(STORAGE_KEYS.guestCart);
    const userCart = this.storage.get<Cart>(`${STORAGE_KEYS.userCartPrefix}${userId}`);
    const merged = new Map<string, CartItem>();
    [...(userCart?.items ?? []), ...(guest?.items ?? [])].forEach((item) => {
      const current = merged.get(item.productId);
      merged.set(item.productId, {
        productId: item.productId,
        quantity: Math.min(MAX_CART_QTY, (current?.quantity ?? 0) + item.quantity),
        addedAt: current?.addedAt ?? item.addedAt,
      });
    });
    this.userId = userId;
    this.itemsSignal.set([...merged.values()]);
    this.persist();
    this.storage.remove(STORAGE_KEYS.guestCart);
    this.hydrateProducts();
  }

  detachUser(): void {
    this.userId = null;
    this.restore(null);
  }

  add(product: Product, quantity = 1): boolean {
    if (product.stockStatus === 'out_of_stock') {
      this.ui.toast('المنتج غير متوفر حاليًا.', 'error');
      return false;
    }
    const existing = this.itemsSignal().find((i) => i.productId === product.id);
    const nextQty = (existing?.quantity ?? 0) + quantity;
    if (nextQty > product.stockQuantity) {
      this.ui.toast('الكمية المطلوبة أكبر من المخزون.', 'error');
      return false;
    }
    this.upsert(product.id, nextQty);
    this.ensureProduct(product);
    this.ui.toast('أُضيف المنتج إلى السلة.');
    return true;
  }

  setQuantity(productId: string, quantity: number): void {
    const product = this.productsSignal().find((p) => p.id === productId);
    const qty = Math.max(1, Math.min(MAX_CART_QTY, quantity, product?.stockQuantity ?? quantity));
    this.upsert(productId, qty);
  }

  remove(productId: string): void {
    const item = this.itemsSignal().find((i) => i.productId === productId);
    if (item) {
      this.lastRemoved.set(item);
    }
    this.itemsSignal.update((rows) => rows.filter((i) => i.productId !== productId));
    this.persist();
    this.ui.toast('تمت إزالة المنتج. يمكنك التراجع.', 'info');
  }

  undoRemove(): void {
    const item = this.lastRemoved();
    if (!item) {
      return;
    }
    this.upsert(item.productId, item.quantity);
    this.lastRemoved.set(null);
  }

  clear(): void {
    this.itemsSignal.set([]);
    this.couponSignal.set(null);
    this.persist();
  }

  setCoupon(coupon: Coupon | null): void {
    this.couponSignal.set(coupon);
    this.storedCouponCode = coupon?.code ?? null;
    this.persist();
  }

  private upsert(productId: string, quantity: number): void {
    this.itemsSignal.update((rows) => {
      const others = rows.filter((i) => i.productId !== productId);
      return [...others, { productId, quantity, addedAt: new Date().toISOString() }];
    });
    this.persist();
  }

  private persist(): void {
    const cart: Cart = {
      id: this.key(),
      userId: this.userId,
      items: this.itemsSignal(),
      couponCode: this.couponSignal()?.code ?? this.storedCouponCode,
      updatedAt: new Date().toISOString(),
    };
    this.storage.set(this.key(), cart);
  }

  private key(): string {
    return this.userId ? `${STORAGE_KEYS.userCartPrefix}${this.userId}` : STORAGE_KEYS.guestCart;
  }

  private ensureProduct(product: Product): void {
    this.productsSignal.update((rows) => (rows.some((p) => p.id === product.id) ? rows : [...rows, product]));
  }

  private hydrateProducts(): void {
    const ids = this.itemsSignal().map((i) => i.productId);
    if (!ids.length) {
      this.productsSignal.set([]);
      return;
    }
    forkJoin(ids.map((id) => this.catalog.getProductById(id))).subscribe({
      next: (products) => {
        this.productsSignal.set(products);
        this.restoreCoupon();
      },
      error: () => undefined,
    });
  }

  private restoreCoupon(): void {
    const code = this.storedCouponCode;
    if (!code || this.couponSignal()) {
      return;
    }
    const afterSale = this.views().reduce((sum, item) => sum + item.lineTotal, 0);
    this.accounts.validateCoupon(code, afterSale).subscribe({
      next: (coupon) => this.setCoupon(coupon),
      error: () => {
        this.storedCouponCode = null;
        this.persist();
      },
    });
  }
}
