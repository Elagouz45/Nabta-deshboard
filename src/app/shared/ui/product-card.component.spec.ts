import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideDataAccess } from '@data-access/provide-data-access';
import { PRODUCTS } from '@data-access/mock/products.mock';
import { CartStore } from '@state/cart/cart.store';
import { ComparisonStore } from '@state/comparison/comparison.store';
import { WishlistStore } from '@state/wishlist/wishlist.store';
import { ProductCardComponent } from './product-card.component';

describe('ProductCardComponent', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [provideRouter([]), provideHttpClient(), provideDataAccess()],
    });
  });

  it('adds to cart and toggles wishlist and compare', () => {
    const fixture = TestBed.createComponent(ProductCardComponent);
    const product = PRODUCTS.find((p) => p.stockStatus === 'in_stock')!;
    fixture.componentRef.setInput('product', product);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    buttons[0].click();
    buttons[1].click();
    buttons[2].click();

    expect(TestBed.inject(CartStore).quantity()).toBeGreaterThan(0);
    expect(TestBed.inject(WishlistStore).has(product.id)).toBe(true);
    expect(TestBed.inject(ComparisonStore).has(product.id)).toBe(true);
  });
});
