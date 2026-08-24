import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideDataAccess } from '@data-access/provide-data-access';
import { CartStore } from './cart.store';
import { WishlistStore } from '@state/wishlist/wishlist.store';
import { PRODUCTS } from '@data-access/mock/products.mock';

describe('cart and wishlist stores', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideDataAccess()],
    });
  });

  it('adds a product to the cart and updates totals', () => {
    const cart = TestBed.inject(CartStore);
    const product = PRODUCTS[0];
    expect(cart.add(product, 2)).toBe(true);
    expect(cart.quantity()).toBe(2);
    expect(cart.breakdown().total).toBeGreaterThan(0);
  });

  it('toggles wishlist membership', () => {
    const wishlist = TestBed.inject(WishlistStore);
    const product = PRODUCTS[1];
    wishlist.clear();
    wishlist.toggle(product);
    expect(wishlist.has(product.id)).toBe(true);
    wishlist.toggle(product);
    expect(wishlist.has(product.id)).toBe(false);
  });

  it('applies a percent coupon to cart totals', () => {
    const cart = TestBed.inject(CartStore);
    const product = PRODUCTS[0];
    cart.clear();
    expect(cart.add(product, 2)).toBe(true);
    const before = cart.breakdown().total;
    cart.setCoupon({
      id: 'c1',
      code: 'NAMAA10',
      type: 'percent',
      value: 10,
      minSubtotal: 0,
      active: true,
      expiresAt: '2099-01-01T00:00:00.000Z',
      descriptionAr: '',
      descriptionEn: '',
    });
    expect(cart.breakdown().total).toBeLessThan(before);
  });
});
