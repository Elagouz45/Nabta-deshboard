import { computePriceBreakdown, couponDiscountAmount, discountPercent, lineTotals, unitPrice } from './pricing.util';
import { Product } from '@core/models';
import { Coupon } from '@core/models';

function product(partial: Partial<Product> & Pick<Product, 'regularPrice'>): Product {
  return {
    id: 'p',
    slug: 'p',
    sku: 's',
    nameAr: 'ن',
    nameEn: 'n',
    shortDescriptionAr: '',
    shortDescriptionEn: '',
    descriptionAr: '',
    descriptionEn: '',
    categoryId: 'c',
    subcategoryId: 's',
    brandId: 'b',
    companyId: 'co',
    images: [],
    thumbnail: '',
    imageAltAr: '',
    imageAltEn: '',
    salePrice: null,
    currency: 'EGP',
    stockQuantity: 10,
    stockStatus: 'in_stock',
    unit: 'ml',
    size: '',
    weight: '',
    formulation: 'EC',
    activeIngredients: [],
    composition: '',
    countryOfOrigin: 'مصر',
    targetCropIds: [],
    targetProblemIds: [],
    benefits: [],
    usageInstructions: { ar: '', en: '' },
    dosage: { ar: '', en: '' },
    safetyInstructions: { ar: '', en: '' },
    preHarvestInterval: { ar: '', en: '' },
    rating: 4,
    reviewsCount: 1,
    salesCount: 1,
    isFeatured: false,
    isNew: false,
    isBestSeller: false,
    isOnSale: false,
    isActive: true,
    tags: [],
    seoTitleAr: '',
    seoTitleEn: '',
    seoDescriptionAr: '',
    seoDescriptionEn: '',
    createdAt: '',
    updatedAt: '',
    ...partial,
  };
}

describe('pricing.util', () => {
  it('uses sale price when lower than regular', () => {
    const p = product({ regularPrice: 200, salePrice: 150 });
    expect(unitPrice(p)).toBe(150);
    expect(discountPercent(p)).toBe(25);
  });

  it('computes line totals from quantity', () => {
    const p = product({ regularPrice: 100, salePrice: 80 });
    expect(lineTotals(p, 2)).toEqual({ lineSubtotal: 200, lineDiscount: 40, lineTotal: 160 });
  });

  it('applies percent coupons above the minimum', () => {
    const coupon: Coupon = {
      id: '1',
      code: 'NAMAA10',
      type: 'percent',
      value: 10,
      minSubtotal: 100,
      active: true,
      expiresAt: '2099-01-01T00:00:00.000Z',
      descriptionAr: '',
      descriptionEn: '',
    };
    expect(couponDiscountAmount(200, coupon)).toBe(20);
    expect(couponDiscountAmount(50, coupon)).toBe(0);
  });

  it('builds a full breakdown', () => {
    const coupon: Coupon = {
      id: '1',
      code: 'F',
      type: 'fixed',
      value: 30,
      minSubtotal: 0,
      active: true,
      expiresAt: '2099-01-01T00:00:00.000Z',
      descriptionAr: '',
      descriptionEn: '',
    };
    const result = computePriceBreakdown({
      itemsSubtotal: 200,
      saleDiscount: 20,
      coupon,
      shipping: 55,
    });
    expect(result.total).toBe(205);
  });
});
